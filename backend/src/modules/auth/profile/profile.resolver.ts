import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/generated/client'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs'
import Upload from 'graphql-upload/Upload.mjs'

import { Authorization, Authorized } from '@/shared/decorators'
import { FileValidationPipe } from '@/shared/pipes'

import {
	ChangeProfileInfoInput,
	SocialLinkInput,
	SocialLinksOrderInput,
} from './inputs'
import { SocialLinkModel } from './models'
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

	@Mutation(() => Boolean, { name: 'createSocialLink' })
	@Authorization()
	public async createSocialLink(
		@Authorized() user: User,
		@Args('data') input: SocialLinkInput,
	) {
		return this.profileService.createSocialLink(user, input)
	}

	@Mutation(() => Boolean, { name: 'reorderSocialLinks' })
	@Authorization()
	public async reorderSocialLinks(
		@Args('list', { type: () => [SocialLinksOrderInput] })
		list: SocialLinksOrderInput[],
	) {
		return this.profileService.reorderSocialLinks(list)
	}

	@Mutation(() => Boolean, { name: 'updateSocialLink' })
	@Authorization()
	public async updateSocialLink(
		@Args('id') id: string,
		@Args('data') input: SocialLinkInput,
	) {
		return this.profileService.updateSocialLink(id, input)
	}

	@Mutation(() => Boolean, { name: 'removeSocialLink' })
	@Authorization()
	public async removeSocialLink(@Args('id') id: string) {
		return this.profileService.removeSocialLink(id)
	}

	@Query(() => [SocialLinkModel], { name: 'getSocialLinks' })
	@Authorization()
	public async getSocialLinks(@Authorized('id') userId: string) {
		return this.profileService.getSocialLinks(userId)
	}
}
