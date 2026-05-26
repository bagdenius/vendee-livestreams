import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import type { User } from '@prisma/generated/client'
import { hash, verify } from 'argon2'

import { PrismaService } from '@/core/prisma'

import { VerificationService } from '../verification'

import {
	ChangeEmailInput,
	ChangePasswordInput,
	CreateUserInput,
} from './inputs'

@Injectable()
export class AccountService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly verificationService: VerificationService,
	) {}

	public async me(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			include: { socialLinks: true },
		})
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

	public async changeEmail(user: User, input: ChangeEmailInput) {
		const { email } = input
		await this.prisma.user.update({ where: { id: user.id }, data: { email } })
		return true
	}

	public async changePassword(user: User, input: ChangePasswordInput) {
		const { oldPassword, newPassword } = input

		const isValidPassword = await verify(user.password, oldPassword)
		if (!isValidPassword)
			throw new UnauthorizedException('Old password is wrong')

		await this.prisma.user.update({
			where: { id: user.id },
			data: { password: await hash(newPassword) },
		})

		return true
	}
}
