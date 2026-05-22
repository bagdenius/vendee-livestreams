import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'

import { PrismaService } from '@/core/prisma'

import { GraphQLContext } from '../types'

@Injectable()
export class GraphQLAuthGuard implements CanActivate {
	public constructor(private readonly prisma: PrismaService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const request = ctx.getContext<GraphQLContext>().req

		if (typeof request.session?.userId === 'undefined')
			throw new UnauthorizedException('User is not authenticated')

		const user = await this.prisma.user.findUnique({
			where: { id: request.session.userId },
		})
		if (!user) throw new UnauthorizedException('User not found')

		request.user = user

		return true
	}
}
