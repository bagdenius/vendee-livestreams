import { Injectable, NotFoundException } from '@nestjs/common'
import { TokenType } from '@prisma/generated/enums'
import { Request } from 'express'

import { PrismaService } from '@/core/prisma'
import { MailService } from '@/modules/libs/mail/mail.service'
import { generateToken, getSessionMetadata } from '@/shared/utils'

import { ResetPasswordInput } from './inputs/reset-password.input'

@Injectable()
export class PasswordRecoveryService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly mailer: MailService,
	) {}

	public async resetPassword(
		req: Request,
		input: ResetPasswordInput,
		userAgent: string,
	) {
		const { email } = input

		const user = await this.prisma.user.findUnique({ where: { email } })
		if (!user) throw new NotFoundException('User not found')

		const resetToken = await generateToken(
			this.prisma,
			user,
			TokenType.PASSWORD_RESET,
		)

		const metadata = getSessionMetadata(req, userAgent)

		await this.mailer.sendPasswordResetToken(
			user.email,
			resetToken.token,
			metadata,
		)
		return true
	}
}
