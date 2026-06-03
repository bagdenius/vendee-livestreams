import {
	Body,
	Controller,
	Headers,
	HttpCode,
	HttpStatus,
	Post,
	RawBody,
	UnauthorizedException,
} from '@nestjs/common'

import { WebhookService } from './webhook.service'

@Controller('webhooks')
export class WebhookController {
	public constructor(private readonly webhookService: WebhookService) {}

	@Post('livekit')
	@HttpCode(HttpStatus.OK)
	public async receiveLivekitWebhook(
		@Body() body: string,
		@Headers('Authorization') authorization: string,
	) {
		if (!authorization)
			throw new UnauthorizedException('Authorization header is missing')

		return this.webhookService.receiveLivekitWebhook(body, authorization)
	}

	@Post('stripe')
	@HttpCode(HttpStatus.OK)
	public async receiveStripeWebhook(
		@RawBody() rawBody: string,
		@Headers('stripe-signature') signature: string,
	) {
		if (!signature)
			throw new UnauthorizedException('Stripe signature header is missing')

		const event = this.webhookService.constructStripeEvent(rawBody, signature)
		await this.webhookService.receiveStripeWebhook(event)
	}
}
