import { Field, ID, ObjectType } from '@nestjs/graphql'
import type { ChatMessage } from '@prisma/generated/client'

import { UserModel } from '@/modules/auth/account/models'
import { StreamModel } from '@/modules/stream/models'

@ObjectType()
export class ChatMessageModel implements ChatMessage {
	@Field(() => ID)
	public id: string

	@Field(() => String)
	public text: string

	@Field(() => StreamModel)
	public stream: StreamModel

	@Field(() => String)
	public streamId: string

	@Field(() => UserModel)
	public user: UserModel

	@Field(() => String)
	public userId: string

	@Field(() => Date)
	public createdAt: Date

	@Field(() => Date)
	public updatedAt: Date
}
