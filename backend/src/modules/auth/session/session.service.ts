import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import { Request } from 'express'

import { PrismaService } from '@/core/prisma'
import { RedisService } from '@/core/redis'
import { RedisSession, RedisSessionWithId } from '@/shared/types'
import { getSessionMetadata } from '@/shared/utils'

import { LoginInput } from './inputs'

@Injectable()
export class SessionService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly redis: RedisService,
		private readonly configService: ConfigService,
	) {}

	public async findByUser(req: Request) {
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

	public async findCurrent(req: Request) {
		const sessionId = req.session.id
		const sessionData = await this.redis.get(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`,
		)
		if (!sessionData) throw new NotFoundException('Session not found')
		const session = JSON.parse(sessionData) as RedisSession
		return { ...session, id: sessionId }
	}

	public async login(req: Request, input: LoginInput, userAgent: string) {
		const { login, password } = input

		const user = await this.prisma.user.findFirst({
			where: {
				OR: [{ username: { equals: login } }, { email: { equals: login } }],
			},
		})
		if (!user) throw new NotFoundException('User with provided login not found')

		const isValidPassword = await verify(user.password, password)
		if (!isValidPassword) throw new UnauthorizedException('Wrong password')

		const metadata = getSessionMetadata(req, userAgent)

		return new Promise((resolve, reject) => {
			req.session.createdAt = new Date()
			req.session.userId = user.id
			req.session.metadata = metadata

			req.session.save((err) => {
				if (err)
					return reject(
						new InternalServerErrorException('Failed to save session'),
					)
				resolve(user)
			})
		})
	}

	public async logout(req: Request) {
		return new Promise((resolve, reject) => {
			req.session.destroy((err) => {
				if (err)
					return reject(
						new InternalServerErrorException('Failed to end session'),
					)
				req.res?.clearCookie(
					this.configService.getOrThrow<string>('SESSION_NAME'),
				)
				resolve(true)
			})
		})
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
