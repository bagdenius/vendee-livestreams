import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { User } from '@prisma/generated/client'
import { TokenType } from '@prisma/generated/enums'
import { verify } from 'argon2'
import type { Request } from 'express'

import { PrismaService } from '@/core/prisma'
import { MailService } from '@/modules/libs/mail'
import {
	destroySession,
	generateToken,
	getSessionMetadata,
} from '@/shared/utils'

import { DeactivateAccountInput } from './inputs'

@Injectable()
export class DeactivationService {
	public constructor(
		private readonly configService: ConfigService,
		private readonly prisma: PrismaService,
		private readonly mailer: MailService,
	) {}

	public async validateDeactivationToken(req: Request, token: string) {
		const existingToken = await this.prisma.token.findUnique({
			where: { token, type: TokenType.DEACTIVATE_ACCOUNT },
		})
		if (!existingToken) throw new NotFoundException('Token not found')

		const hasExpired = new Date(existingToken.expiresIn) < new Date()
		if (hasExpired) throw new BadRequestException('Token has expired')

		await this.prisma.user.update({
			where: { id: existingToken.userId },
			data: { isDeactivated: true, deactivatedAt: new Date() },
		})

		await this.prisma.token.delete({
			where: { id: existingToken.id, type: TokenType.DEACTIVATE_ACCOUNT },
		})

		return destroySession(req, this.configService)
	}

	public async sendDeactivationToken(
		req: Request,
		user: User,
		userAgent: string,
	) {
		const deactivationToken = await generateToken(
			this.prisma,
			user.id,
			TokenType.DEACTIVATE_ACCOUNT,
			false,
		)

		const metadata = getSessionMetadata(req, userAgent)

		await this.mailer.sendDeactivateToken(
			user.email,
			deactivationToken.token,
			metadata,
		)

		return true
	}

	public async deactivate(
		req: Request,
		input: DeactivateAccountInput,
		user: User,
		userAgent: string,
	) {
		const { email, password, pin } = input

		if (user.email !== email) throw new BadRequestException('Wrong email')

		const isValidPassword = await verify(user.password, password)
		if (!isValidPassword) throw new BadRequestException('Wrong password')

		if (!pin) {
			await this.sendDeactivationToken(req, user, userAgent)
			return { message: 'Verification code is required' }
		}

		await this.validateDeactivationToken(req, pin)

		return { user }
	}
}
