import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { UserAgent } from '@/shared/decorators'
import type { GraphQLContext } from '@/shared/types'

import { NewPasswordInput, ResetPasswordInput } from './inputs'
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

	@Mutation(() => Boolean, { name: 'setNewPassword' })
	public async setNewPassword(@Args('data') input: NewPasswordInput) {
		return this.passwordRecoveryService.setNewPassword(input)
	}
}
