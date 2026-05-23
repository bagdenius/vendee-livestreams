import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'

import { GraphQLContext } from '../types'

export const UserAgent = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		if (context.getType() === 'http') {
			const request = context.switchToHttp().getRequest<Request>()
			return request.headers['user-agent']
		} else {
			const ctx = GqlExecutionContext.create(context)
			return ctx.getContext<GraphQLContext>().req.headers['user-agent']
		}
	},
)
