import { Inject, Injectable } from '@nestjs/common'
import Stripe from 'stripe'

import { type StripeOptions, StripeOptionsSymbol } from './types'

@Injectable()
export class StripeService extends Stripe {
	public constructor(
		@Inject(StripeOptionsSymbol)
		private readonly options: StripeOptions,
	) {
		super(options.apiKey, options.config)
	}
}
