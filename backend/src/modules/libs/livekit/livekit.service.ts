import { Inject, Injectable } from '@nestjs/common'
import {
	IngressClient,
	RoomServiceClient,
	WebhookReceiver,
} from 'livekit-server-sdk'

import { type LiveKitOptions, LiveKitOptionsSymbol } from './types'

@Injectable()
export class LivekitService {
	private readonly roomService: RoomServiceClient
	private readonly ingressClient: IngressClient
	private readonly webhookReceiver: WebhookReceiver

	public constructor(
		@Inject(LiveKitOptionsSymbol)
		private readonly options: LiveKitOptions,
	) {
		this.roomService = new RoomServiceClient(
			this.options.apiUrl,
			this.options.apiKey,
			this.options.apiSecret,
		)
		this.ingressClient = new IngressClient(this.options.apiUrl)
		this.webhookReceiver = new WebhookReceiver(
			this.options.apiKey,
			this.options.apiSecret,
		)
	}

	public get ingress(): IngressClient {
		return this.createProxy(this.ingressClient)
	}

	public get room(): RoomServiceClient {
		return this.createProxy(this.roomService)
	}

	public get receiver(): WebhookReceiver {
		return this.createProxy(this.webhookReceiver)
	}

	public createProxy<T extends object>(target: T): T {
		return new Proxy(target, {
			get: (obj, prop: string | symbol, receiver) => {
				const value = Reflect.get(obj, prop, receiver) as T[keyof T]
				if (typeof value === 'function') return value.bind(obj) as T[keyof T]
				return value
			},
		})
	}
}
