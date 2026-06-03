import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'
import type { SentMessageInfo } from 'nodemailer'

import type { SessionMetadata } from '@/shared/types'

import {
	AccountDeletionTemplate,
	DeactivateTemplate,
	EnableTwoFactorTemplate,
	PasswordRecoveryTemplate,
	VerificationTemplate,
	VerifyChannelTemplate,
} from './templates'

@Injectable()
export class MailService {
	public constructor(
		private readonly configService: ConfigService,
		private readonly mailerService: MailerService,
	) {}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({ to: email, subject, html })
	}

	public async sendVerificationToken(
		email: string,
		token: string,
	): Promise<SentMessageInfo> {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(VerificationTemplate({ domain, token }))
		return this.sendMail(email, 'Account verification', html)
	}

	public async sendPasswordResetToken(
		email: string,
		token: string,
		metadata: SessionMetadata,
	): Promise<SentMessageInfo> {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(
			PasswordRecoveryTemplate({ domain, token, metadata }),
		)
		return this.sendMail(email, 'Password recovery', html)
	}

	public async sendDeactivateToken(
		email: string,
		token: string,
		metadata: SessionMetadata,
	): Promise<SentMessageInfo> {
		const html = await render(DeactivateTemplate({ token, metadata }))
		return this.sendMail(email, 'Account deactivation', html)
	}

	public async sendAccountDeletion(email: string): Promise<SentMessageInfo> {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(AccountDeletionTemplate({ domain }))
		return this.sendMail(email, 'Account deleted', html)
	}

	public async sendEnableTwoFactor(email: string): Promise<SentMessageInfo> {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(EnableTwoFactorTemplate({ domain }))
		return this.sendMail(email, 'Ensure your security', html)
	}

	public async sendVerifyChannel(email: string): Promise<SentMessageInfo> {
		const html = await render(VerifyChannelTemplate())
		return this.sendMail(email, 'Your channel has been verified', html)
	}
}
