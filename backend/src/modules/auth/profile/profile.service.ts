import {
	BadRequestException,
	ConflictException,
	Injectable,
} from '@nestjs/common'
import { User } from '@prisma/generated/client'
import Upload from 'graphql-upload/Upload.mjs'
import sharp from 'sharp'

import { PrismaService } from '@/core/prisma'
import { StorageService } from '@/modules/libs/storage'

import { ChangeProfileInfoInput } from './inputs'

@Injectable()
export class ProfileService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly storageService: StorageService,
	) {}

	public async changeAvatar(user: User, file: Upload) {
		if (!file.file)
			throw new BadRequestException('Upoload file is not provided')

		if (user.avatar) await this.storageService.remove(user.avatar)

		const chunks: Buffer[] = []
		for await (const chunk of file.file.createReadStream()) chunks.push(chunk)

		const buffer = Buffer.concat(chunks)
		const filename = `/channels/${user.username}.webp`

		const processedBuffer = await sharp(buffer, {
			animated: file.file.filename.endsWith('.gif'),
		})
			.resize(512, 512)
			.webp()
			.toBuffer()
		await this.storageService.upload(processedBuffer, filename, 'image/webp')

		await this.prisma.user.update({
			where: { id: user.id },
			data: { avatar: filename },
		})

		return true
	}

	public async removeAvatar(user: User) {
		if (!user.avatar) return

		await this.storageService.remove(user.avatar)

		await this.prisma.user.update({
			where: { id: user.id },
			data: { avatar: null },
		})

		return true
	}

	public async changeInfo(user: User, input: ChangeProfileInfoInput) {
		const { username, displayName, bio } = input

		const usernameExists = await this.prisma.user.findUnique({
			where: { username },
		})
		if (usernameExists && username !== user.username)
			throw new ConflictException('Username already taken')

		await this.prisma.user.update({
			where: { id: user.id },
			data: {
				username,
				displayName,
				bio,
			},
		})

		return true
	}
}
