import {
	createParamDecorator,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { User } from '@prisma/generated/client'
import type { Request } from 'express'

import type { GraphQLContext } from '../types'

export const Authorized = createParamDecorator(
	(data: keyof User | undefined, context: ExecutionContext) => {
		const user =
			context.getType() === 'http'
				? context.switchToHttp().getRequest<Request>().user
				: GqlExecutionContext.create(context).getContext<GraphQLContext>().req
						.user

		if (!user) throw new UnauthorizedException('User is not authenticated')

		return data ? user[data] : user
	},
)
