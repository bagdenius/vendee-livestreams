import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Prisma, User } from '@prisma/generated/client'
import Upload from 'graphql-upload/Upload.mjs'
import { AccessToken } from 'livekit-server-sdk'
import sharp from 'sharp'

import { PrismaService } from '@/core/prisma'

import { StorageService } from '../libs/storage'

import {
	ChangeStreamInfoInput,
	FiltersInput,
	GenerateStreamTokenInput,
} from './inputs'

@Injectable()
export class StreamService {
	public constructor(
		private readonly configService: ConfigService,
		private readonly prisma: PrismaService,
		private readonly storageService: StorageService,
	) {}

	private getBySearchTerm(searchTerm: string): Prisma.StreamWhereInput {
		return {
			OR: [
				{ title: { contains: searchTerm, mode: 'insensitive' } },
				{ user: { username: { contains: searchTerm, mode: 'insensitive' } } },
			],
		}
	}

	private async getStreamByUserId(userId: string) {
		const stream = await this.prisma.stream.findUnique({
			where: { id: userId },
		})
		if (!stream) throw new NotFoundException('Stream not found')
		return stream
	}

	public async getAll(input: FiltersInput = {}) {
		const { take, skip, searchTerm } = input

		const whereClause = searchTerm
			? this.getBySearchTerm(searchTerm)
			: undefined

		const streams = await this.prisma.stream.findMany({
			take: take ?? 12,
			skip: skip ?? 0,
			where: { user: { isDeactivated: false }, ...whereClause },
			include: { user: true, category: true },
			orderBy: { createdAt: 'desc' },
		})

		return streams
	}

	public async getRandom() {
		const total = await this.prisma.stream.count({
			where: { user: { isDeactivated: false } },
		})

		const randomIndexes = new Set<number>()
		while (randomIndexes.size < 4) {
			const randomIndex = Math.floor(Math.random() * total)
			randomIndexes.add(randomIndex)
		}

		const streams = await this.prisma.stream.findMany({
			where: { user: { isDeactivated: false } },
			include: { user: true, category: true },
			take: total,
			skip: 0,
		})

		return Array.from(randomIndexes).map((index) => streams[index])
	}

	public async changeInfo(userId: string, input: ChangeStreamInfoInput) {
		const { title, categoryId } = input
		await this.prisma.stream.update({
			where: { userId },
			data: { title, category: { connect: { id: categoryId } } },
		})
		return true
	}

	public async changeThumbnail(user: User, file: Upload) {
		if (!file.file)
			throw new BadRequestException('Upoload file is not provided')

		const stream = await this.getStreamByUserId(user.id)

		if (stream.thumbnail) await this.storageService.remove(stream.thumbnail)

		const chunks: Buffer[] = []
		for await (const chunk of file.file.createReadStream()) chunks.push(chunk)

		const buffer = Buffer.concat(chunks)
		const filename = `/streams/${user.username}.webp`

		const processedBuffer = await sharp(buffer, {
			animated: file.file.filename.endsWith('.gif'),
		})
			.resize(1920, 1080)
			.webp()
			.toBuffer()

		await this.storageService.upload(processedBuffer, filename, 'image/webp')

		await this.prisma.stream.update({
			where: { userId: user.id },
			data: { thumbnail: filename },
		})

		return true
	}

	public async removeThumbnail(userId: string) {
		const stream = await this.getStreamByUserId(userId)

		if (!stream.thumbnail) return

		await this.storageService.remove(stream.thumbnail)

		await this.prisma.stream.update({
			where: { userId },
			data: { thumbnail: null },
		})

		return true
	}

	public async generateToken(input: GenerateStreamTokenInput) {
		const { userId, channelId } = input

		let self: { id: string; username: string }

		const user = await this.prisma.user.findUnique({ where: { id: userId } })

		if (user) self = { id: user.id, username: user.username }
		else
			self = {
				id: userId,
				username: `Viewer ${Math.floor(Math.random() * 100000)}`,
			}

		const channel = await this.prisma.user.findUnique({
			where: { id: channelId },
		})
		if (!channel) throw new NotFoundException('Channel not found')

		const isHost = self.id === channel.id

		const token = new AccessToken(
			this.configService.getOrThrow<string>('LIVEKIT_API_KEY'),
			this.configService.getOrThrow<string>('LIVEKIT_API_SECRET'),
			{
				identity: isHost ? `Host-${self.id}` : self.id.toString(),
				name: self.username,
			},
		)

		token.addGrant({
			room: channel.id,
			roomJoin: true,
			canPublish: false,
		})

		return { token: token.toJwt() }
	}
}
