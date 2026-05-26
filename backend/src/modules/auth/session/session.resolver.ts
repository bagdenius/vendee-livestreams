import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Authorization, UserAgent } from '@/shared/decorators'
import type { GraphQLContext } from '@/shared/types'

import { AuthModel } from '../account/models'

import { LoginInput } from './inputs'
import { SessionModel } from './models'
import { SessionService } from './session.service'

@Resolver('Session')
export class SessionResolver {
	public constructor(private readonly sessionService: SessionService) {}

	@Query(() => [SessionModel], { name: 'getSessionsByUser' })
	@Authorization()
	public async getByUser(@Context() { req }: GraphQLContext) {
		return this.sessionService.getByUser(req)
	}

	@Query(() => SessionModel, { name: 'getCurrentSession' })
	@Authorization()
	public async getCurrent(@Context() { req }: GraphQLContext) {
		return this.sessionService.getCurrent(req)
	}

	@Mutation(() => AuthModel, { name: 'loginUser' })
	public async login(
		@Context() { req }: GraphQLContext,
		@Args('data') input: LoginInput,
		@UserAgent() userAgent: string,
	) {
		return await this.sessionService.login(req, input, userAgent)
	}

	@Mutation(() => Boolean, { name: 'logoutUser' })
	@Authorization()
	public async logout(@Context() { req }: GraphQLContext) {
		return await this.sessionService.logout(req)
	}

	@Mutation(() => Boolean, { name: 'clearSessionCookie' })
	public clearSession(@Context() { req }: GraphQLContext) {
		return this.sessionService.clearSession(req)
	}

	@Mutation(() => Boolean, { name: 'removeSession' })
	@Authorization()
	public async remove(
		@Context() { req }: GraphQLContext,
		@Args('id') id: string,
	) {
		return await this.sessionService.remove(req, id)
	}
}
