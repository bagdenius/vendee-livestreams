import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '@/core/prisma'

@Injectable()
export class ChannelService {
	public constructor(private readonly prisma: PrismaService) {}

	public async getRecommended() {
		return await this.prisma.user.findMany({
			where: { isDeactivated: false },
			orderBy: { followings: { _count: 'desc' } },
			include: { stream: true },
			take: 7,
		})
	}

	public async getByUsername(username: string) {
		const channel = await this.prisma.user.findUnique({
			where: { username, isDeactivated: false },
			include: {
				socialLinks: { orderBy: { position: 'asc' } },
				stream: { include: { category: true } },
				followings: true,
			},
		})
		if (!channel) throw new NotFoundException('Channel not found')
		return channel
	}

	public async getFollowersCountByChannel(channelId: string) {
		return await this.prisma.follow.count({ where: { followingId: channelId } })
	}
}
