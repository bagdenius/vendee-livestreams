import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/generated/client'

import { PrismaService } from '@/core/prisma'
import { StripeService } from '@/modules/libs/stripe'

@Injectable()
export class TransactionService {
	public constructor(
		private readonly configService: ConfigService,
		private readonly prisma: PrismaService,
		private readonly stripe: StripeService,
	) {}

	public async getMyTransactions(userId: string) {
		return await this.prisma.transaction.findMany({
			where: { userId },
		})
	}

	public async makePayment(user: User, planId: string) {
		const plan = await this.prisma.sponsorshipPlan.findUnique({
			where: { id: planId },
			include: { channel: true },
		})
		if (!plan) throw new NotFoundException('Plan not found')

		if (user.id === plan.channel.id)
			throw new ConflictException(
				'You cannot arrange sponsorship for yourself.',
			)

		const existingSubscription =
			await this.prisma.sponsorshipSubscription.findFirst({
				where: { userId: user.id, channelId: plan.channel.id },
			})
		if (existingSubscription)
			throw new ConflictException(
				'You have already signed up for sponsorship for this channel.',
			)

		const customer = await this.stripe.customers.create({
			name: user.username,
			email: user.email,
		})

		const session = await this.stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: plan.title,
							description: plan.description ?? 'No description',
						},
						unit_amount: Math.round(plan.price * 100),
						recurring: { interval: 'month' },
					},
					quantity: 1,
				},
			],
			mode: 'subscription',
			success_url: `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/success?price=${encodeURIComponent(plan.price)}&username=${encodeURIComponent(plan.channel.username)}`,
			cancel_url: this.configService.getOrThrow<string>('ALLOWED_ORIGIN'),
			customer: customer.id,
			metadata: {
				planId: plan.id,
				userId: user.id,
				channelId: plan.channel.id,
			},
		})

		await this.prisma.transaction.create({
			data: {
				amount: plan.price,
				currency: session.currency ?? 'usd',
				stripeSubscriptionId: session.id,
				user: { connect: { id: user.id } },
			},
		})

		return { url: session.url }
	}
}
