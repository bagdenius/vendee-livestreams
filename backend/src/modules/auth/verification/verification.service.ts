import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { User } from '@prisma/generated/client'
import { TokenType } from '@prisma/generated/enums'
import { Request } from 'express'

import { PrismaService } from '@/core/prisma'
import { MailService } from '@/modules/libs/mail'
import { generateToken, getSessionMetadata, saveSession } from '@/shared/utils'

import { VerificationInput } from './inputs'

@Injectable()
export class VerificationService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly mailer: MailService,
	) {}

	public async verify(
		req: Request,
		input: VerificationInput,
		userAgent: string,
	) {
		const { token } = input

		const existingToken = await this.prisma.token.findUnique({
			where: { token, type: TokenType.EMAIL_VERIFY },
		})
		if (!existingToken) throw new NotFoundException('Token not found')

		const hasExpired = new Date(existingToken.expiresIn) < new Date()
		if (hasExpired) throw new BadRequestException('Token has expired')

		const user = await this.prisma.user.update({
			where: { id: existingToken.userId },
			data: { isEmailVerified: true },
		})

		await this.prisma.token.delete({
			where: { id: existingToken.id, type: TokenType.EMAIL_VERIFY },
		})

		const metadata = getSessionMetadata(req, userAgent)

		return saveSession(req, user, metadata)
	}

	public async sendVerificationToken(user: User) {
		const verificationToken = await generateToken(
			this.prisma,
			user.id,
			TokenType.EMAIL_VERIFY,
		)
		await this.mailer.sendVerificationToken(user.email, verificationToken.token)
		return true
	}
}
