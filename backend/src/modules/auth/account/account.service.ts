import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from 'argon2'

import { PrismaService } from '@/core/prisma'

import { VerificationService } from '../verification'

import { CreateUserInput } from './inputs'

@Injectable()
export class AccountService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly verificationService: VerificationService,
	) {}

	public async me(id: string) {
		const user = await this.prisma.user.findUnique({ where: { id } })
		return user
	}

	public async create(input: CreateUserInput) {
		const { username, email, password } = input

		const isUsernameExists = await this.prisma.user.findUnique({
			where: { username },
		})
		if (isUsernameExists)
			throw new ConflictException('Provided username already taken')

		const isEmailExists = await this.prisma.user.findUnique({
			where: { email },
		})
		if (isEmailExists)
			throw new ConflictException('Provided email already taken')

		const user = await this.prisma.user.create({
			data: {
				username,
				email,
				password: await hash(password),
				displayName: username,
			},
		})

		await this.verificationService.sendVerificationToken(user)

		return true
	}
}
