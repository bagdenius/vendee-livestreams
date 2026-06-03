import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { NotificationService } from '../notification'

import { CronService } from './cron.service'

@Module({
	imports: [ScheduleModule.forRoot()],
	providers: [CronService, NotificationService],
})
export class CronModule {}
