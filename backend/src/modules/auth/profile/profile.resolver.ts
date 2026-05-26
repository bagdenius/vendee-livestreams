import { Args, Mutation, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/generated/client'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs'
import Upload from 'graphql-upload/Upload.mjs'

import { Authorization, Authorized } from '@/shared/decorators'
import { FileValidationPipe } from '@/shared/pipes'

import { ChangeProfileInfoInput } from './inputs'
import { ProfileService } from './profile.service'

@Resolver('Profile')
export class ProfileResolver {
	constructor(private readonly profileService: ProfileService) {}

	@Mutation(() => Boolean, { name: 'changeProfileAvatar' })
	@Authorization()
	public async changeAvatar(
		@Authorized() user: User,
		@Args('avatar', { type: () => GraphQLUpload }, FileValidationPipe)
		avatar: Upload,
	) {
		return this.profileService.changeAvatar(user, avatar)
	}

	@Mutation(() => Boolean, { name: 'removeProfileAvatar' })
	@Authorization()
	public async removeAvatar(@Authorized() user: User) {
		return this.profileService.removeAvatar(user)
	}

	@Mutation(() => Boolean, { name: 'changeProfileInfo' })
	@Authorization()
	public async changeInfo(
		@Authorized() user: User,
		@Args('data') input: ChangeProfileInfoInput,
	) {
		return this.profileService.changeInfo(user, input)
	}
}
