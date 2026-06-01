import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/core/prisma'

import { LivekitService } from '../libs/livekit/livekit.service'
import { NotificationService } from '../notification'

@Injectable()
export class WebhookService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly livekit: LivekitService,
		private readonly notificationService: NotificationService,
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
}
