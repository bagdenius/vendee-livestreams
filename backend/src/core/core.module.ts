import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { AccountModule } from '@/modules/auth/account'
import { DeactivationModule } from '@/modules/auth/deactivation'
import { PasswordRecoveryModule } from '@/modules/auth/password-recovery'
import { ProfileModule } from '@/modules/auth/profile'
import { SessionModule } from '@/modules/auth/session'
import { TotpModule } from '@/modules/auth/totp'
import { VerificationModule } from '@/modules/auth/verification'
import { CategoryModule } from '@/modules/category'
import { ChannelModule } from '@/modules/channel'
import { ChatModule } from '@/modules/chat'
import { CronModule } from '@/modules/cron'
import { FollowModule } from '@/modules/follow'
import { LivekitModule } from '@/modules/libs/livekit'
import { MailModule } from '@/modules/libs/mail'
import { StorageModule } from '@/modules/libs/storage'
import { TelegramModule } from '@/modules/libs/telegram'
import { NotificationModule } from '@/modules/notification'
import { StreamModule } from '@/modules/stream'
import { IngressModule } from '@/modules/stream/ingress'
import { WebhookModule } from '@/modules/webhook'
import { IS_DEV_ENV } from '@/shared/utils'

import { getGraphQLConfig, getLiveKitConfig } from './config'
import { PrismaModule } from './prisma'
import { RedisModule } from './redis'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: !IS_DEV_ENV }),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			imports: [ConfigModule],
			useFactory: getGraphQLConfig,
			inject: [ConfigService],
		}),
		LivekitModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getLiveKitConfig,
			inject: [ConfigService],
		}),
		PrismaModule,
		RedisModule,
		MailModule,
		StorageModule,
		TelegramModule,
		CronModule,
		AccountModule,
		SessionModule,
		ProfileModule,
		VerificationModule,
		PasswordRecoveryModule,
		TotpModule,
		DeactivationModule,
		StreamModule,
		IngressModule,
		WebhookModule,
		CategoryModule,
		ChatModule,
		FollowModule,
		ChannelModule,
		NotificationModule,
	],
})
export class CoreModule {}
