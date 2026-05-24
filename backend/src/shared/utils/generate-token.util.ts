import { TokenType, type User } from '@prisma/generated/client'
import ms from 'ms'
import { v4 as uuidv4 } from 'uuid'

import { PrismaService } from '@/core/prisma'

export async function generateToken(
	prismaService: PrismaService,
	user: User,
	type: TokenType,
	isUUID: boolean = false,
) {
	let token: string

	if (isUUID) token = uuidv4()
	else
		token = Math.floor(Math.random() * (1000000 - 100000) + 100000).toString()

	const expiresIn = new Date(new Date().getTime() + ms('5m'))
	const existringToken = await prismaService.token.findFirst({
		where: { type, user: { id: user.id } },
	})
	if (existringToken)
		await prismaService.token.delete({ where: { id: existringToken.id } })

	const newToken = await prismaService.token.create({
		data: { token, expiresIn, type, user: { connect: { id: user.id } } },
		include: { user: true },
	})
	return newToken
}
