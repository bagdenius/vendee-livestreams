import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TransactionStatus } from '@prisma/generated/enums'
import Stripe from 'stripe'

import { PrismaService } from '@/core/prisma'

import { LivekitService } from '../libs/livekit'
import { StripeService } from '../libs/stripe'
import { TelegramService } from '../libs/telegram'
import { NotificationService } from '../notification'

@Injectable()
export class WebhookService {
	public constructor(
		private readonly configService: ConfigService,
		private readonly prisma: PrismaService,
		private readonly livekit: LivekitService,
		private readonly notificationService: NotificationService,
		private readonly telegramService: TelegramService,
		private readonly stripe: StripeService,
	) {}

	public async receiveLivekitWebhook(body: string, authorization: string) {
		const event = await this.livekit.receiver.receive(body, authorization, true)

		if (event.event === 'ingress_started') {
			const stream = await this.prisma.stream.update({
				where: { ingressId: event.ingressInfo?.ingressId },
				data: { isLive: true },
				include: { user: true },
			})

			const follows = await this.prisma.follow.findMany({
				where: {
					followingId: stream.userId,
					follower: { isDeactivated: false },
				},
				include: { follower: { include: { notificationSettings: true } } },
			})

			for (const follow of follows) {
				const follower = follow.follower
				if (follower.notificationSettings?.siteNotifications)
					await this.notificationService.createStreamStart(
						follower.id,
						stream.user,
					)

				if (
					follower.notificationSettings?.telegramNotifications &&
					follower.telegramId
				)
					await this.telegramService.sendStreamStart(
						follower.telegramId,
						stream.user,
					)
			}
		}

		if (event.event === 'ingress_ended') {
			const stream = await this.prisma.stream.update({
				where: { ingressId: event.ingressInfo?.ingressId },
				data: { isLive: false },
			})

			await this.prisma.chatMessage.deleteMany({
				where: { streamId: stream.id },
			})
		}
	}

	public async receiveStripeWebhook(event: Stripe.Event) {
		const session = event.data.object as Stripe.Checkout.Session

		if (event.type === 'checkout.session.completed') {
			if (
				!session.metadata?.planId ||
				!session.metadata?.userId ||
				!session.metadata?.channelId
			)
				throw new BadRequestException('Wrong metadata')

			const planId = session.metadata.planId
			const userId = session.metadata.userId
			const channelId = session.metadata.channelId

			const expiresAt = new Date()
			expiresAt.setDate(expiresAt.getDay() + 30)

			const sponsorshipSubscription =
				await this.prisma.sponsorshipSubscription.create({
					data: { expiresAt, planId, userId, channelId },
					include: {
						plan: true,
						user: true,
						channel: { include: { notificationSettings: true } },
					},
				})

			await this.prisma.transaction.updateMany({
				where: {
					stripeSubscriptionId: session.id,
					status: TransactionStatus.PENDING,
				},
				data: { status: TransactionStatus.SUCCESS },
			})

			if (
				sponsorshipSubscription.channel.notificationSettings?.siteNotifications
			)
				await this.notificationService.createNewSponsorship(
					sponsorshipSubscription.channel.id,
					sponsorshipSubscription.plan,
					sponsorshipSubscription.user,
				)

			if (
				sponsorshipSubscription.channel.notificationSettings
					?.telegramNotifications &&
				sponsorshipSubscription.channel.telegramId
			)
				await this.telegramService.sendNewSponsorship(
					sponsorshipSubscription.channel.telegramId,
					sponsorshipSubscription.plan,
					sponsorshipSubscription.user,
				)
		}

		if (event.type === 'checkout.session.expired')
			await this.prisma.transaction.updateMany({
				where: { stripeSubscriptionId: session.id },
				data: { status: TransactionStatus.EXPIRED },
			})

		if (event.type === 'checkout.session.async_payment_failed')
			await this.prisma.transaction.updateMany({
				where: { stripeSubscriptionId: session.id },
				data: { status: TransactionStatus.FAILED },
			})
	}

	public constructStripeEvent(payload: string, signature: string) {
		return this.stripe.webhooks.constructEvent(
			payload,
			signature,
			this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET'),
		)
	}
}
