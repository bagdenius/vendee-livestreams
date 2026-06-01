import { TokenType } from '@prisma/generated/client'
import ms from 'ms'
import { v4 as uuidv4 } from 'uuid'

import { PrismaService } from '@/core/prisma'

export async function generateToken(
	prismaService: PrismaService,
	userId: string,
	type: TokenType,
	isUUID: boolean = true,
) {
	let token: string

	if (isUUID) token = uuidv4()
	else
		token = Math.floor(Math.random() * (1000000 - 100000) + 100000).toString()

	const expiresIn = new Date(new Date().getTime() + ms('5m'))
	const existringToken = await prismaService.token.findFirst({
		where: { type, user: { id: userId } },
	})
	if (existringToken)
		await prismaService.token.delete({ where: { id: existringToken.id } })

	const newToken = await prismaService.token.create({
		data: { token, expiresIn, type, user: { connect: { id: userId } } },
		include: { user: true },
	})
	return newToken
}
