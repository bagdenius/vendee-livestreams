import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Prisma, User } from '@prisma/generated/client'
import Upload from 'graphql-upload/Upload.mjs'
import sharp from 'sharp'

import { PrismaService } from '@/core/prisma'

import { StorageService } from '../libs/storage'

import { FiltersInput } from './inputs'
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input'

@Injectable()
export class StreamService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly storageService: StorageService,
	) {}

	private findBySearchTerm(searchTerm: string): Prisma.StreamWhereInput {
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
			? this.findBySearchTerm(searchTerm)
			: undefined

		const streams = await this.prisma.stream.findMany({
			take: take ?? 12,
			skip: skip ?? 0,
			where: { user: { isDeactivated: false }, ...whereClause },
			include: { user: true },
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
			include: { user: true },
			take: total,
			skip: 0,
		})

		return Array.from(randomIndexes).map((index) => streams[index])
	}

	public async changeInfo(userId: string, input: ChangeStreamInfoInput) {
		const { title } = input
		await this.prisma.stream.update({ where: { userId }, data: { title } })
		return true
	}

	public async changeThumbnail(user: User, file: Upload) {
		if (!file.file)
			throw new BadRequestException('Upoload file is not provided')

		const stream = await this.getStreamByUserId(user.id)

		if (stream.thumbnailUrl)
			await this.storageService.remove(stream.thumbnailUrl)

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
			data: { thumbnailUrl: filename },
		})

		return true
	}

	public async removeThumbnail(userId: string) {
		const stream = await this.getStreamByUserId(userId)

		if (!stream.thumbnailUrl) return

		await this.storageService.remove(stream.thumbnailUrl)

		await this.prisma.stream.update({
			where: { userId },
			data: { thumbnailUrl: null },
		})

		return true
	}
}
