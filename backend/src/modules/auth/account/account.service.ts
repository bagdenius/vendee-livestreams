import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from 'argon2'

import { PrismaService } from '@/core/prisma'

import { CreateUserInput } from './inputs'

@Injectable()
export class AccountService {
	public constructor(private readonly prisma: PrismaService) {}

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

		await this.prisma.user.create({
			data: {
				username,
				email,
				password: await hash(password),
				displayName: username,
			},
		})

		return true
	}
}
