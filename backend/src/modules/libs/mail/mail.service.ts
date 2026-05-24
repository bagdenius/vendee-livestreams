import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'
import type { SentMessageInfo } from 'nodemailer'

import type { SessionMetadata } from '@/shared/types'

import { PasswordRecoveryTemplate, VerificationTemplate } from './templates'

@Injectable()
export class MailService {
	public constructor(
		private readonly configService: ConfigService,
		private readonly mailerService: MailerService,
	) {}

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

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({ to: email, subject, html })
	}
}
