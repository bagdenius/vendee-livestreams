import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/generated/client'

import { Authorization, Authorized } from '@/shared/decorators'

import { MakePaymentModel, TransactionModel } from './models'
import { TransactionService } from './transaction.service'

@Resolver('Transaction')
export class TransactionResolver {
	public constructor(private readonly transactionService: TransactionService) {}

	@Query(() => [TransactionModel], { name: 'getMyTransactions' })
	@Authorization()
	public async getMyTransactions(@Authorized('id') userId: string) {
		return this.transactionService.getMyTransactions(userId)
	}

	@Mutation(() => MakePaymentModel, { name: 'makePayment' })
	@Authorization()
	public async makePayment(
		@Authorized() user: User,
		@Args('planId') planId: string,
	) {
		return this.transactionService.makePayment(user, planId)
	}
}
