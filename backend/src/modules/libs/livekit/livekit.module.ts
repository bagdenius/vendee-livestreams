import { type DynamicModule, Module } from '@nestjs/common'

import { LivekitService } from './livekit.service'
import {
	type LiveKitAsyncOptions,
	type LiveKitOptions,
	LiveKitOptionsSymbol,
} from './types'

@Module({})
export class LivekitModule {
	public static forRoot(options: LiveKitOptions): DynamicModule {
		return {
			module: LivekitModule,
			providers: [
				{
					provide: LiveKitOptionsSymbol,
					useValue: options,
				},
				LivekitService,
			],
			exports: [LivekitService],
			global: true,
		}
	}

	public static forRootAsync(options: LiveKitAsyncOptions): DynamicModule {
		return {
			module: LivekitModule,
			imports: options.imports || [],
			providers: [
				{
					provide: LiveKitOptionsSymbol,
					useFactory: options.useFactory,
					inject: options.inject || [],
				},
				LivekitService,
			],
			exports: [LivekitService],
			global: true,
		}
	}
}
