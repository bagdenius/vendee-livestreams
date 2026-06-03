import { Query, Resolver } from '@nestjs/graphql'

import { Authorization, Authorized } from '@/shared/decorators'

import { SubscriptionModel } from './models'
import { SubscriptionService } from './subscription.service'

@Resolver('Subscription')
export class SubscriptionResolver {
	public constructor(
		private readonly subscriptionService: SubscriptionService,
	) {}

	@Query(() => [SubscriptionModel], { name: 'getMySponsors' })
	@Authorization()
	public async getMySponsors(@Authorized('id') userId: string) {
		return this.subscriptionService.getMySponsors(userId)
	}
}
