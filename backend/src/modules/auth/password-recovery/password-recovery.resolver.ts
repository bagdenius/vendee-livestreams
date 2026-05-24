import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { UserAgent } from '@/shared/decorators'
import type { GraphQLContext } from '@/shared/types'

import { ResetPasswordInput } from './inputs/reset-password.input'
import { PasswordRecoveryService } from './password-recovery.service'

@Resolver('PasswordRecovery')
export class PasswordRecoveryResolver {
	public constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService,
	) {}

	@Mutation(() => Boolean, { name: 'resetPassword' })
	public async resetPassword(
		@Context() { req }: GraphQLContext,
		@Args('data') input: ResetPasswordInput,
		@UserAgent() userAgent: string,
	) {
		return this.passwordRecoveryService.resetPassword(req, input, userAgent)
	}
}
