import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { PrismaService } from '@/core/prisma'

import { MailService } from '../libs/mail'
import { StorageService } from '../libs/storage'
import { TelegramService } from '../libs/telegram'

@Injectable()
export class CronService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly mailer: MailService,
		private readonly storageService: StorageService,
		private readonly telegramService: TelegramService,
	) {}

	@Cron('0 0 0 * * *')
	// @Cron('*/10 * * * * *')
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

		// console.log('DEACTIVATED ACCOUNTS: ', deactivatedAccounts)

		await this.prisma.user.deleteMany({
			where: { isDeactivated: true, deactivatedAt: { lte: sevenDaysAgo } },
		})
	}
}
