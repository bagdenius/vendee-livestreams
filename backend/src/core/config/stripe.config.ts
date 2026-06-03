import { ConfigService } from '@nestjs/config'

import { StripeOptions } from '@/modules/libs/stripe/types'

export function getStripeConfig(configService: ConfigService): StripeOptions {
	return {
		apiKey: configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
		config: {
			apiVersion: '2025-02-24.acacia',
		},
	}
}
