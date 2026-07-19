import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import { Request } from 'express'
import { TOTP } from 'otpauth'

import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { RedisSession, RedisSessionWithId } from '@/shared/types'
import { destroySession, getSessionMetadata, saveSession } from '@/shared/utils'

import { VerificationService } from '../verification'

import { LoginInput } from './inputs'

@Injectable()
export class SessionService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly redis: RedisService,
		private readonly configService: ConfigService,
		private readonly verificationService: VerificationService,
	) {}

	public async getByUser(req: Request) {
		const userId = req.session.userId
		if (!userId) throw new NotFoundException('User in session not found')

		const keys = await this.redis.keys(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}*`,
		)
		if (!keys?.length) throw new NotFoundException('Sessions not found')

		const userSessions: RedisSessionWithId[] = []
		for (const key of keys) {
			const sessionData = await this.redis.get(key)
			if (sessionData) {
				const session = JSON.parse(sessionData) as RedisSession
				if (session.userId === userId)
					userSessions.push({ ...session, id: key.split(':')[1] })
			}
		}
		if (!userSessions.length) throw new NotFoundException('Sessions not found')

		userSessions.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		)

		return userSessions.filter((session) => session.id !== req.session.id)
	}

	public async getCurrent(req: Request) {
		const sessionId = req.session.id
		const sessionData = await this.redis.get(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`,
		)
		if (!sessionData) throw new NotFoundException('Session not found')
		const session = JSON.parse(sessionData) as RedisSession
		return { ...session, id: sessionId }
	}

	public async login(req: Request, input: LoginInput, userAgent: string) {
		const { login, password, pin } = input

		const user = await this.prisma.user.findFirst({
			where: {
				OR: [{ username: { equals: login } }, { email: { equals: login } }],
			},
		})
		if (!user || user.isDeactivated)
			throw new NotFoundException('User with provided login not found')

		const isValidPassword = await verify(user.password, password)
		if (!isValidPassword) throw new UnauthorizedException('Wrong password')

		if (!user.isEmailVerified) {
			await this.verificationService.sendVerificationToken(user)
			throw new BadRequestException(
				'Your account is not verified. Please check your email for verification',
			)
		}

		if (user.isTotpEnabled) {
			if (!pin)
				return { message: 'A code is required to complete authorization.' }

			const totp = new TOTP({
				issuer: 'VendeeLivestream',
				label: `${user.email}`,
				algorithm: 'SHA1',
				digits: 6,
				secret: user.totpSecret!,
			})

			const delta = totp.validate({ token: pin })
			if (delta === null) throw new BadRequestException('Wrong code')
		}

		const metadata = getSessionMetadata(req, userAgent)

		return saveSession(req, user, metadata)
	}

	public async logout(req: Request) {
		return destroySession(req, this.configService)
	}

	public clearSession(req: Request) {
		req.res?.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))
		return true
	}

	public async remove(req: Request, id: string) {
		if (req.session.id === id)
			throw new ConflictException('Current session cannot be removed')
		await this.redis.del(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`,
		)
		return true
	}
}
