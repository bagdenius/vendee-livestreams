import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { PrismaService } from '@/core/prisma'

import { MailService } from '../libs/mail'
import { StorageService } from '../libs/storage'
import { TelegramService } from '../libs/telegram'
import { NotificationService } from '../notification'

@Injectable()
export class CronService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly mailer: MailService,
		private readonly storageService: StorageService,
		private readonly telegramService: TelegramService,
		private readonly notificationService: NotificationService,
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	public async deleteDeactivatedAccounts() {
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDay() - 7)

		const deactivatedAccounts = await this.prisma.user.findMany({
			where: { isDeactivated: true, deactivatedAt: { lte: sevenDaysAgo } },
			include: { notificationSettings: true, stream: true },
		})

		for (const user of deactivatedAccounts) {
			await this.mailer.sendAccountDeletion(user.email)

			if (user.notificationSettings?.telegramNotifications && user.telegramId)
				await this.telegramService.sendAccountDeletion(user.telegramId)

			if (user.avatar) await this.storageService.remove(user.avatar)

			if (user.stream?.thumbnail)
				await this.storageService.remove(user.stream.thumbnail)
		}

		await this.prisma.user.deleteMany({
			where: { isDeactivated: true, deactivatedAt: { lte: sevenDaysAgo } },
		})
	}

	@Cron('0 0 */4 * *')
	public async notifyUserEnableTwoFactor() {
		const users = await this.prisma.user.findMany({
			where: { isTotpEnabled: false },
			include: { notificationSettings: true },
		})

		for (const user of users) {
			await this.mailer.sendEnableTwoFactor(user.email)

			if (user.notificationSettings?.siteNotifications)
				await this.notificationService.createEnableTwoFactor(user.id)

			if (user.notificationSettings?.telegramNotifications && user.telegramId)
				await this.telegramService.sendEnableTwoFactor(user.telegramId)
		}
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	public async verifyChannels() {
		const users = await this.prisma.user.findMany({
			include: { notificationSettings: true },
		})

		for (const user of users) {
			const followersCount = await this.prisma.follow.count({
				where: { followingId: user.id },
			})

			if (followersCount > 10 && !user.isVerified) {
				await this.prisma.user.update({
					where: { id: user.id },
					data: { isVerified: true },
				})

				await this.mailer.sendVerifyChannel(user.email)

				if (user.notificationSettings?.siteNotifications)
					await this.notificationService.createVerifyChannel(user.id)

				if (user.notificationSettings?.telegramNotifications && user.telegramId)
					await this.telegramService.sendVerifyChannel(user.telegramId)
			}
		}
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	public async deleteOldNotifications() {
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

		await this.prisma.notification.deleteMany({
			where: { createdAt: { lte: sevenDaysAgo } },
		})
	}
}
