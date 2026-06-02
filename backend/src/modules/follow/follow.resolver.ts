import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Authorization, Authorized } from '@/shared/decorators'

import { FollowService } from './follow.service'
import { FollowModel } from './models'

@Resolver('Follow')
export class FollowResolver {
	public constructor(private readonly followService: FollowService) {}

	@Query(() => [FollowModel], { name: 'getMyFollowers' })
	@Authorization()
	public async getMyFollowers(@Authorized('id') userId: string) {
		return this.followService.getMyFollowers(userId)
	}

	@Query(() => [FollowModel], { name: 'getMyfollowings' })
	@Authorization()
	public async getMyfollowings(@Authorized('id') userId: string) {
		return this.followService.getMyfollowings(userId)
	}

	@Mutation(() => Boolean, { name: 'followChannel' })
	@Authorization()
	public async follow(
		@Authorized('id') userId: string,
		@Args('channelId') channelId: string,
	) {
		return this.followService.follow(userId, channelId)
	}

	@Mutation(() => Boolean, { name: 'unfollowChannel' })
	@Authorization()
	public async unfollow(
		@Authorized('id') userId: string,
		@Args('channelId') channelId: string,
	) {
		return this.followService.unfollow(userId, channelId)
	}
}
