import { type DynamicModule, Module } from '@nestjs/common'

import { StripeService } from './stripe.service'
import {
	type StripeAsyncOptions,
	type StripeOptions,
	StripeOptionsSymbol,
} from './types'

@Module({})
export class StripeModule {
	public static forRoot(options: StripeOptions): DynamicModule {
		return {
			module: StripeModule,
			providers: [
				{
					provide: StripeOptionsSymbol,
					useValue: options,
				},
				StripeService,
			],
			exports: [StripeService],
			global: true,
		}
	}

	public static forRootAsync(options: StripeAsyncOptions): DynamicModule {
		return {
			module: StripeModule,
			imports: options.imports || [],
			providers: [
				{
					provide: StripeOptionsSymbol,
					useFactory: options.useFactory,
					inject: options.inject || [],
				},
				StripeService,
			],
			exports: [StripeService],
			global: true,
		}
	}
}
