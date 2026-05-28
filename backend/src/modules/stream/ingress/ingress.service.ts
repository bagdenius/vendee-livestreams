import { BadRequestException, Injectable } from '@nestjs/common'
import type { User } from '@prisma/generated/client'
import {
	type CreateIngressOptions,
	IngressAudioEncodingPreset,
	IngressAudioOptions,
	IngressInput,
	IngressVideoEncodingPreset,
	IngressVideoOptions,
} from 'livekit-server-sdk'

import { PrismaService } from '@/core/prisma'
import { LivekitService } from '@/modules/libs/livekit/livekit.service'

@Injectable()
export class IngressService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly livekit: LivekitService,
	) {}

	private async resetIngresses(user: User) {
		const ingresses = await this.livekit.ingress.listIngress({
			roomName: user.id,
		})

		const rooms = await this.livekit.room.listRooms([user.id])

		for (const room of rooms) await this.livekit.room.deleteRoom(room.name)

		for (const ingress of ingresses)
			if (ingress.ingressId)
				await this.livekit.ingress.deleteIngress(ingress.ingressId)
	}

	public async create(user: User, ingressType: IngressInput) {
		await this.resetIngresses(user)

		const options: CreateIngressOptions = {
			name: user.username,
			roomName: user.id,
			participantName: user.username,
			participantIdentity: user.id,
		}

		if (ingressType === IngressInput.WHIP_INPUT)
			options.enableTranscoding = true
		else {
			options.video = new IngressVideoOptions({
				source: 1,
				encodingOptions: {
					case: 'preset',
					value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
				},
			})

			options.audio = new IngressAudioOptions({
				source: 2,
				encodingOptions: {
					case: 'preset',
					value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
				},
			})
		}

		const ingress = await this.livekit.ingress.createIngress(
			ingressType,
			options,
		)

		if (!ingress || !ingress.url || !ingress.streamKey)
			throw new BadRequestException('Failed to create ingress')

		await this.prisma.stream.update({
			where: { userId: user.id },
			data: {
				ingressId: ingress.ingressId,
				serverUrl: ingress.url,
				streamKey: ingress.streamKey,
			},
		})

		return true
	}
}
