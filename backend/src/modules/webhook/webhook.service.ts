import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/core/prisma'

import { LivekitService } from '../libs/livekit/livekit.service'

@Injectable()
export class WebhookService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly livekit: LivekitService,
	) {}

	public async receiveLivekitWebhook(body: string, authorization: string) {
		const event = await this.livekit.receiver.receive(body, authorization, true)

		if (event.event === 'ingress_started') {
			console.log('STREAM STARTED: ', event.ingressInfo?.url)

			await this.prisma.stream.update({
				where: { ingressId: event.ingressInfo?.ingressId },
				data: { isLive: true },
			})
		}
		if (event.event === 'ingress_ended') {
			console.log('STREAM ENDED: ', event.ingressInfo?.url)

			await this.prisma.stream.update({
				where: { ingressId: event.ingressInfo?.ingressId },
				data: { isLive: false },
			})
		}
	}
}
