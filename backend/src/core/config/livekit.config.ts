import { ConfigService } from '@nestjs/config'

import { LiveKitOptions } from '@/modules/libs/livekit/types'

export function getLiveKitConfig(configService: ConfigService): LiveKitOptions {
	return {
		apiUrl: configService.getOrThrow<string>('LIVEKIT_URL'),
		apiKey: configService.getOrThrow<string>('LIVEKIT_API_KEY'),
		apiSecret: configService.getOrThrow<string>('LIVEKIT_API_SECRET'),
	}
}
