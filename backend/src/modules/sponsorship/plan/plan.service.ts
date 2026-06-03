import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '@/core/prisma'
import { StripeService } from '@/modules/libs/stripe'

import { CreatePlanInput } from './inputs'

@Injectable()
export class PlanService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly stripe: StripeService,
	) {}

	public async getMyPlans(userId: string) {
		return await this.prisma.sponsorshipPlan.findMany({
			where: { channelId: userId },
		})
	}

	public async create(userId: string, input: CreatePlanInput) {
		const { title, description, price } = input

		const channel = await this.prisma.user.findUnique({
			where: { id: userId },
		})
		if (!channel?.isVerified)
			throw new ForbiddenException(
				'Subscription plans can only be created by verified channels.',
			)

		const stripePlan = await this.stripe.plans.create({
			amount: Math.round(price * 100),
			currency: 'usd',
			interval: 'month',
			product: {
				name: title,
			},
		})

		await this.prisma.sponsorshipPlan.create({
			data: {
				title,
				description,
				price,
				stripeProductId:
					typeof stripePlan.product === 'string'
						? stripePlan.product
						: stripePlan.product?.id || 'Unknown',
				stripePlanId: stripePlan.id,
				channel: { connect: { id: userId } },
			},
		})

		return true
	}

	public async remove(planId: string) {
		const plan = await this.prisma.sponsorshipPlan.findUnique({
			where: { id: planId },
		})

		if (!plan) throw new NotFoundException('Plan not found')

		await this.stripe.plans.del(plan.stripePlanId)
		await this.stripe.products.del(plan.stripeProductId)

		await this.prisma.sponsorshipPlan.delete({ where: { id: plan.id } })

		return true
	}
}
