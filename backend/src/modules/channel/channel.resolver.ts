import { Args, Query, Resolver } from '@nestjs/graphql'

import { UserModel } from '../auth/account/models'

import { ChannelService } from './channel.service'

@Resolver('Channel')
export class ChannelResolver {
	public constructor(private readonly channelService: ChannelService) {}

	@Query(() => [UserModel], { name: 'getRecommendedChannels' })
	public async getRecommended() {
		return this.channelService.getRecommended()
	}

	@Query(() => UserModel, { name: 'getChannelByUsername' })
	public async getByUsername(@Args('username') username: string) {
		return this.channelService.getByUsername(username)
	}

	@Query(() => Number, { name: 'getFollowersCountByChannel' })
	public async getFollowersCountByChannel(
		@Args('channelId') channelId: string,
	) {
		return this.channelService.getFollowersCountByChannel(channelId)
	}
}
