import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'

import { Authorization, Authorized } from '@/shared/decorators'

import { ChatService } from './chat.service'
import { ChangeChatSettingsInput, SendMessageInput } from './inputs'
import { ChatMessageModel } from './models'

type ChatMessageAddedPayload = {
	chatMessageAdded: ChatMessageModel
}

type ChatMessageAddedVariables = {
	streamId: string
}

@Resolver('Chat')
export class ChatResolver {
	private readonly pubSub: PubSub

	public constructor(private readonly chatService: ChatService) {
		this.pubSub = new PubSub()
	}

	@Query(() => [ChatMessageModel], { name: 'getMessagesByStream' })
	public async getByStream(@Args('streamId') streamId: string) {
		return this.chatService.getByStream(streamId)
	}

	@Mutation(() => ChatMessageModel, { name: 'sendChatMessage' })
	@Authorization()
	public async send(
		@Authorized('id') userId: string,
		@Args('data') input: SendMessageInput,
	) {
		const message = await this.chatService.send(userId, input)
		await this.pubSub.publish('CHAT_MESSAGE_ADDED', {
			chatMessageAdded: message,
		})
		return message
	}

	@Subscription(() => ChatMessageModel, {
		name: 'chatMessageAdded',
		filter: (
			payload: ChatMessageAddedPayload,
			variables: ChatMessageAddedVariables,
		) => payload.chatMessageAdded.streamId === variables.streamId,
	})
	public chatMessageAdded(@Args('streamId') streamId: string) {
		return this.pubSub.asyncIterableIterator('CHAT_MESSAGE_ADDED')
	}

	@Mutation(() => Boolean, { name: 'changeChatSettings' })
	@Authorization()
	public async changeSettings(
		@Authorized('id') userId: string,
		@Args('data') input: ChangeChatSettingsInput,
	) {
		return this.chatService.changeSettings(userId, input)
	}
}
