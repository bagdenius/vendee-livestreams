import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import type { GraphQLContext } from '@/shared/types'

import { UserModel } from '../account/models'

import { LoginInput } from './inputs'
import { SessionService } from './session.service'

@Resolver('Session')
export class SessionResolver {
	public constructor(private readonly sessionService: SessionService) {}

	@Mutation(() => UserModel, { name: 'loginUser' })
	public async login(
		@Context() { req }: GraphQLContext,
		@Args('data') input: LoginInput,
	) {
		return await this.sessionService.login(req, input)
	}

	@Mutation(() => Boolean, { name: 'logoutUser' })
	public async logout(@Context() { req }: GraphQLContext) {
		return await this.sessionService.logout(req)
	}
}
