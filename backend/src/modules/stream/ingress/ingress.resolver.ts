import { Args, Mutation, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/generated/client'
import type { IngressInput } from 'livekit-server-sdk'

import { Authorization, Authorized } from '@/shared/decorators'

import { IngressService } from './ingress.service'

@Resolver('Ingress')
export class IngressResolver {
	public constructor(private readonly ingressService: IngressService) {}

	@Mutation(() => Boolean, { name: 'createIngress' })
	@Authorization()
	public async create(
		@Authorized() user: User,
		@Args('ingressType') ingressType: IngressInput,
	) {
		return this.ingressService.create(user, ingressType)
	}
}
