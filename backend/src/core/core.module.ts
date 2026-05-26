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
import { CronModule } from '@/modules/cron'
import { MailModule } from '@/modules/libs/mail'
import { StorageModule } from '@/modules/libs/storage'
import { IS_DEV_ENV } from '@/shared/utils'

import { getGraphQLConfig } from './config'
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
		PrismaModule,
		RedisModule,
		MailModule,
		StorageModule,
		CronModule,
		AccountModule,
		SessionModule,
		ProfileModule,
		VerificationModule,
		PasswordRecoveryModule,
		TotpModule,
		DeactivationModule,
	],
})
export class CoreModule {}
