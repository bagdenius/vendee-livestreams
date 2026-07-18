import {
	BadRequestException,
	ConflictException,
	Injectable,
} from '@nestjs/common'
import { User } from '@prisma/generated/client'
import { FileUpload } from 'graphql-upload/processRequest.mjs'
import sharp from 'sharp'

import { PrismaService } from '@/core/prisma'
import { StorageService } from '@/modules/libs/storage'

import {
	ChangeProfileInfoInput,
	SocialLinkInput,
	SocialLinksOrderInput,
} from './inputs'

@Injectable()
export class ProfileService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly storageService: StorageService,
	) {}

	public async changeAvatar(user: User, file: FileUpload) {
		if (!file) throw new BadRequestException('Upload file is not provided')

		if (user.avatar) await this.storageService.remove(user.avatar)

		const chunks: Buffer[] = []
		for await (const chunk of file.createReadStream()) chunks.push(chunk)

		const buffer = Buffer.concat(chunks)
		const filename = `channels/${user.username}.webp`

		const processedBuffer = await sharp(buffer, {
			animated: file.filename.endsWith('.gif'),
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

	public async createSocialLink(user: User, input: SocialLinkInput) {
		const { title, url } = input

		const lastSocialLink = await this.prisma.socialLink.findFirst({
			where: { userId: user.id },
			orderBy: { position: 'desc' },
		})

		const newPosition = lastSocialLink ? lastSocialLink.position + 1 : 1

		await this.prisma.socialLink.create({
			data: {
				title,
				url,
				position: newPosition,
				user: { connect: { id: user.id } },
			},
		})

		return true
	}

	public async reorderSocialLinks(list: SocialLinksOrderInput[]) {
		if (!list.length) return

		const updatePromises = list.map((socialLink) => {
			return this.prisma.socialLink.update({
				where: { id: socialLink.id },
				data: { position: socialLink.position },
			})
		})

		await Promise.all(updatePromises)

		return true
	}

	public async updateSocialLink(id: string, input: SocialLinkInput) {
		const { title, url } = input
		await this.prisma.socialLink.update({ where: { id }, data: { title, url } })
		return true
	}

	public async removeSocialLink(id: string) {
		await this.prisma.socialLink.delete({ where: { id } })
		return true
	}

	public async getSocialLinks(userId: string) {
		return await this.prisma.socialLink.findMany({
			where: { userId },
			orderBy: { position: 'asc' },
		})
	}
}
