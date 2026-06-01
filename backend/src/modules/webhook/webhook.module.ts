import { type MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'

import { RawBodyMiddleware } from '@/shared/middlewares'

import { NotificationService } from '../notification'

import { WebhookController } from './webhook.controller'
import { WebhookService } from './webhook.service'

@Module({
	controllers: [WebhookController],
	providers: [WebhookService, NotificationService],
})
export class WebhookModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(RawBodyMiddleware)
			.forRoutes({ path: 'webhooks/livekit', method: RequestMethod.POST })
	}
}
