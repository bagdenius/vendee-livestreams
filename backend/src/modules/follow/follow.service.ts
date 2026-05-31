import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '@/core/prisma'

@Injectable()
export class FollowService {
	public constructor(private readonly prisma: PrismaService) {}

	public async getMyFollowers(userId: string) {
		return await this.prisma.follow.findMany({
			where: { followingId: userId },
			orderBy: { createdAt: 'desc' },
			include: { follower: true },
		})
	}

	public async getMyFollowings(userId: string) {
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

		await this.prisma.follow.create({
			data: { followerId: userId, followingId: channelId },
		})

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
