import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '@/core/prisma'

import { TelegramService } from '../libs/telegram'
import { NotificationService } from '../notification'

@Injectable()
export class FollowService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly notificationService: NotificationService,
		private readonly telegramService: TelegramService,
	) {}

	public async getMyFollowers(userId: string) {
		return await this.prisma.follow.findMany({
			where: { followingId: userId },
			orderBy: { createdAt: 'desc' },
			include: { follower: true },
		})
	}

	public async getMyfollowings(userId: string) {
		return await this.prisma.follow.findMany({
			where: { followerId: userId },
			orderBy: { createdAt: 'desc' },
			include: { following: true },
		})
	}

	public async follow(userId: string, channelId: string) {
		if (userId === channelId)
			throw new ConflictException('You cannot follow yourself')

		const channel = await this.prisma.user.findUnique({
			where: { id: channelId },
		})
		if (!channel) throw new NotFoundException('Channel not found')

		const existingFollow = await this.prisma.follow.findFirst({
			where: { followerId: userId, followingId: channelId },
		})
		if (existingFollow)
			throw new ConflictException('You are following this channel already')

		const follow = await this.prisma.follow.create({
			data: { followerId: userId, followingId: channelId },
			include: {
				follower: true,
				following: { include: { notificationSettings: true } },
			},
		})

		if (follow.following.notificationSettings?.siteNotifications)
			await this.notificationService.createNewFollower(
				follow.followingId,
				follow.follower,
			)

		if (
			follow.following.notificationSettings?.telegramNotifications &&
			follow.following.telegramId
		)
			await this.telegramService.sendNewFollower(
				follow.following.telegramId,
				follow.follower,
			)

		return true
	}

	public async unfollow(userId: string, channelId: string) {
		if (userId === channelId)
			throw new ConflictException('You cannot unfollow yourself')

		const channel = await this.prisma.user.findUnique({
			where: { id: channelId },
		})
		if (!channel) throw new NotFoundException('Channel not found')

		const existingFollow = await this.prisma.follow.findFirst({
			where: { followerId: userId, followingId: channelId },
		})
		if (!existingFollow)
			throw new ConflictException('You are not following this channel already')

		await this.prisma.follow.delete({ where: { id: existingFollow.id } })

		return true
	}
}
