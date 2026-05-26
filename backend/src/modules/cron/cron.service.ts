import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { PrismaService } from '@/core/prisma'

import { MailService } from '../libs/mail'

@Injectable()
export class CronService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly mailer: MailService,
	) {}

	@Cron('0 0 * * * *')
	// @Cron('*/10 * * * * *')
	public async deleteDeactivatedAccounts() {
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDay() - 7)

		const deactivatedAccounts = await this.prisma.user.findMany({
			where: { isDeactivated: true, deactivatedAt: { lte: sevenDaysAgo } },
		})

		for (const user of deactivatedAccounts) {
			await this.mailer.sendAccountDeletion(user.email)
		}

		console.log('DEACTIVATED ACCOUNTS: ', deactivatedAccounts)

		await this.prisma.user.deleteMany({
			where: { isDeactivated: true, deactivatedAt: { lte: sevenDaysAgo } },
		})
	}
}
