import {
	Body,
	Controller,
	Headers,
	HttpCode,
	HttpStatus,
	Post,
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
}
