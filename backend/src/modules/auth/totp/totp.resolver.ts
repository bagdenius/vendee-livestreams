import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/generated/client'

import { Authorization, Authorized } from '@/shared/decorators'

import { EnableTotpInput } from './inputs'
import { TotpModel } from './models'
import { TotpService } from './totp.service'

@Resolver('Totp')
export class TotpResolver {
	public constructor(private readonly totpService: TotpService) {}

	@Query(() => TotpModel, { name: 'generateTotpSecret' })
	@Authorization()
	public async generate(@Authorized() user: User) {
		return this.totpService.generate(user)
	}

	@Mutation(() => Boolean, { name: 'enableTotp' })
	@Authorization()
	public async enable(
		@Authorized() user: User,
		@Args('data') input: EnableTotpInput,
	) {
		return this.totpService.enable(user, input)
	}

	@Mutation(() => Boolean, { name: 'disableTotp' })
	@Authorization()
	public async disable(@Authorized() user: User) {
		return this.totpService.disable(user)
	}
}
