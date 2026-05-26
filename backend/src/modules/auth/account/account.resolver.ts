import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/generated/client'

import { Authorization, Authorized } from '@/shared/decorators'

import { AccountService } from './account.service'
import {
	ChangeEmailInput,
	ChangePasswordInput,
	CreateUserInput,
} from './inputs'
import { UserModel } from './models'

@Resolver('Account')
export class AccountResolver {
	public constructor(private readonly accountService: AccountService) {}

	@Query(() => UserModel, { name: 'getMe' })
	@Authorization()
	public async me(@Authorized('id') id: string) {
		return this.accountService.me(id)
	}

	@Mutation(() => Boolean, { name: 'createUser' })
	public async create(@Args('data') input: CreateUserInput) {
		return this.accountService.create(input)
	}

	@Mutation(() => Boolean, { name: 'changeEmail' })
	@Authorization()
	public async changeEmail(
		@Authorized() user: User,
		@Args('data') input: ChangeEmailInput,
	) {
		return this.accountService.changeEmail(user, input)
	}

	@Mutation(() => Boolean, { name: 'changePassword' })
	@Authorization()
	public async changePassword(
		@Authorized() user: User,
		@Args('data') input: ChangePasswordInput,
	) {
		return this.accountService.changePassword(user, input)
	}
}
