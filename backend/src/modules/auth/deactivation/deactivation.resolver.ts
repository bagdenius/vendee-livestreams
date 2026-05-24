import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/generated/client'

import { Authorization, Authorized, UserAgent } from '@/shared/decorators'
import type { GraphQLContext } from '@/shared/types'

import { AuthModel } from '../account/models'

import { DeactivationService } from './deactivation.service'
import { DeactivateAccountInput } from './inputs'

@Resolver('Deactivate')
export class DeactivationResolver {
	public constructor(
		private readonly deactivationService: DeactivationService,
	) {}

	@Mutation(() => AuthModel, { name: 'deactivateAccount' })
	@Authorization()
	public async deactivate(
		@Context() { req }: GraphQLContext,
		@Args('data') input: DeactivateAccountInput,
		@Authorized() user: User,
		@UserAgent() userAgent: string,
	) {
		return await this.deactivationService.deactivate(
			req,
			input,
			user,
			userAgent,
		)
	}
}
