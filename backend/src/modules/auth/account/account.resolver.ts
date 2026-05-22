import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Authorization, Authorized } from '@/shared/decorators'

import { AccountService } from './account.service'
import { CreateUserInput } from './inputs'
import { UserModel } from './models'

@Resolver('Account')
export class AccountResolver {
	public constructor(private readonly accountService: AccountService) {}

	@Authorization()
	@Query(() => UserModel, { name: 'getMe' })
	public async me(@Authorized('id') id: string) {
		return this.accountService.me(id)
	}

	@Mutation(() => Boolean, { name: 'createUser' })
	public async create(@Args('data') input: CreateUserInput) {
		return this.accountService.create(input)
	}
}
