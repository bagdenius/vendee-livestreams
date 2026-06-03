import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/core/prisma'

@Injectable()
export class SubscriptionService {
	public constructor(private readonly prisma: PrismaService) {}

	public async getMySponsors(userId: string) {
		return await this.prisma.sponsorshipSubscription.findMany({
			where: { channelId: userId },
			orderBy: { createdAt: 'desc' },
			include: { plan: true, user: true, channel: true },
		})
	}
}
