import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { TokenType } from '@prisma/generated/enums'
import { hash } from 'argon2'
import { Request } from 'express'

import { PrismaService } from '@/core/prisma'
import { MailService } from '@/modules/libs/mail/mail.service'
import { generateToken, getSessionMetadata } from '@/shared/utils'

import { NewPasswordInput } from './inputs'
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

	public async setNewPassword(input: NewPasswordInput) {
		const { password, token } = input

		const existingToken = await this.prisma.token.findUnique({
			where: { token, type: TokenType.PASSWORD_RESET },
		})
		if (!existingToken) throw new NotFoundException('Token not found')

		const hasExpired = new Date(existingToken.expiresIn) < new Date()
		if (hasExpired) throw new BadRequestException('Token has expired')

		await this.prisma.user.update({
			where: { id: existingToken.userId },
			data: { password: await hash(password) },
		})

		await this.prisma.token.delete({
			where: { id: existingToken.id, type: TokenType.PASSWORD_RESET },
		})

		return true
	}
}
