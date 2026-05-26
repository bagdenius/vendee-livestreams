import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { UserAgent } from '@/shared/decorators'
import type { GraphQLContext } from '@/shared/types'

import { AuthModel } from '../account/models'

import { VerificationInput } from './inputs'
import { VerificationService } from './verification.service'

@Resolver('Verification')
export class VerificationResolver {
	public constructor(
		private readonly verificationService: VerificationService,
	) {}

	@Mutation(() => AuthModel, { name: 'verifyAccount' })
	public async verify(
		@Context() { req }: GraphQLContext,
		@Args('data') input: VerificationInput,
		@UserAgent() userAgent: string,
	) {
		return this.verificationService.verify(req, input, userAgent)
	}
}
