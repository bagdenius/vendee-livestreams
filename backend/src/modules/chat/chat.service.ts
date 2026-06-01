import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '@/core/prisma'

import { ChangeChatSettingsInput, SendMessageInput } from './inputs'

@Injectable()
export class ChatService {
	public constructor(private readonly prisma: PrismaService) {}

	public async getByStream(streamId: string) {
		return await this.prisma.chatMessage.findMany({
			where: { streamId },
			orderBy: { createdAt: 'desc' },
			include: { user: true },
		})
	}

	public async send(userId: string, input: SendMessageInput) {
		const { text, streamId } = input

		const stream = await this.prisma.stream.findUnique({
			where: { id: streamId },
		})
		if (!stream) throw new NotFoundException('Stream not found')
		if (!stream.isLive) throw new BadRequestException('Stream is not live')

		return await this.prisma.chatMessage.create({
			data: {
				text,
				user: { connect: { id: userId } },
				stream: { connect: { id: streamId } },
			},
			include: { stream: true },
		})
	}

	public async changeSettings(userId: string, input: ChangeChatSettingsInput) {
		const { isChatEnabled, isChatFollowersOnly, isChatSponsorsOnly } = input

		await this.prisma.stream.update({
			where: { userId: userId },
			data: { isChatEnabled, isChatFollowersOnly, isChatSponsorsOnly },
		})

		return true
	}
}
