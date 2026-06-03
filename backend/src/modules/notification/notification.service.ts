import { Injectable } from '@nestjs/common'
import {
	NotificationType,
	type SponsorshipPlan,
	TokenType,
	type User,
} from '@prisma/generated/client'

import { PrismaService } from '@/core/prisma'
import { generateToken } from '@/shared/utils'

import { ChangeNotificationSettingsInput } from './inputs'

@Injectable()
export class NotificationService {
	public constructor(private readonly prisma: PrismaService) {}

	public async getUnreadCount(userId: string) {
		return await this.prisma.notification.count({
			where: { userId, isRead: false },
		})
	}

	public async getByUser(userId: string) {
		await this.prisma.notification.updateMany({
			where: { userId, isRead: false },
			data: { isRead: true },
		})

		return await this.prisma.notification.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
		})
	}

	public async changeSettings(
		userId: string,
		input: ChangeNotificationSettingsInput,
	) {
		const { siteNotifications, telegramNotifications } = input

		const notificationSettings = await this.prisma.notificationSettings.upsert({
			where: { userId: userId },
			create: {
				user: { connect: { id: userId } },
				siteNotifications,
				telegramNotifications,
			},
			update: { siteNotifications, telegramNotifications },
			include: { user: true },
		})

		if (
			notificationSettings.telegramNotifications &&
			!notificationSettings.user.telegramId
		) {
			const telegramAuthToken = await generateToken(
				this.prisma,
				userId,
				TokenType.TELEGRAM_AUTH,
			)

			return {
				notificationSettings,
				telegramAuthToken: telegramAuthToken.token,
			}
		}

		if (
			!notificationSettings.telegramNotifications &&
			notificationSettings.user.telegramId
		) {
			await this.prisma.user.update({
				where: { id: userId },
				data: { telegramId: null },
			})
			return { notificationSettings }
		}

		return { notificationSettings }
	}

	public async createStreamStart(userId: string, channel: User) {
		return await this.prisma.notification.create({
			data: {
				message: `
				<b className='font-medium'>Don't miss it!</b>
				<p>Join the stream on the channel 
					<a className='font-semibold' href='/${channel.username}'>${channel.displayName}
					</a>.
				</p>`,
				type: NotificationType.STREAM_START,
				user: { connect: { id: userId } },
			},
		})
	}

	public async createNewFollower(userId: string, follower: User) {
		return await this.prisma.notification.create({
			data: {
				message: `
				<b className='font-medium'>You've got a new follower!</b>
				<p>This is a user 
					<a className='font-semibold' href='/${follower.username}'>${follower.displayName}
					</a>.
				</p>`,
				type: NotificationType.NEW_FOLLOWER,
				user: { connect: { id: userId } },
			},
		})
	}

	public async createNewSponsorship(
		userId: string,
		plan: SponsorshipPlan,
		sponsor: User,
	) {
		return await this.prisma.notification.create({
			data: {
				message: `
				<b className='font-medium'>You've got a new sponsor!</b>
				<p>User <a className='font-semibold' href='/${sponsor.username}'>${sponsor.displayName}</a> became your sponsor by choosing the <strong>${plan.title}</strong> plan.
				</p>`,
				type: NotificationType.NEW_SPONSORSHIP,
				user: { connect: { id: userId } },
			},
		})
	}

	public async createEnableTwoFactor(userId: string) {
		return await this.prisma.notification.create({
			data: {
				message: `
				<b className='font-medium'>Ensure your security!</b>
				<p>Enable two-factor authentication in your account settings to increase your security.</p>`,
				type: NotificationType.ENABLE_TWO_FACTOR,
				userId,
			},
		})
	}

	public async createVerifyChannel(userId: string) {
		return await this.prisma.notification.create({
			data: {
				message: `
				<b className='font-medium'>Congratulations!</b>
				<p>Your channel has been verified and there will now be a checkmark next to your channel.</p>
				`,
				type: NotificationType.VERIFIED_CHANNEL,
				userId,
			},
		})
	}
}
