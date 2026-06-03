import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Authorization, Authorized } from '@/shared/decorators'

import { CreatePlanInput } from './inputs'
import { PlanModel } from './models'
import { PlanService } from './plan.service'

@Resolver('Plan')
export class PlanResolver {
	public constructor(private readonly planService: PlanService) {}

	@Query(() => [PlanModel], { name: 'getMySponsorshipPlans' })
	@Authorization()
	public async getMyPlans(@Authorized('id') userId: string) {
		return this.planService.getMyPlans(userId)
	}

	@Mutation(() => Boolean, { name: 'createSponsorshipPlan' })
	@Authorization()
	public async create(
		@Authorized('id') userId: string,
		@Args('data') input: CreatePlanInput,
	) {
		return this.planService.create(userId, input)
	}

	@Mutation(() => Boolean, { name: 'removeSponsorshipPlan' })
	@Authorization()
	public async remove(@Args('planId') planId: string) {
		return this.planService.remove(planId)
	}
}
