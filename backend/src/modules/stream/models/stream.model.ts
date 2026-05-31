import { Field, ID, ObjectType } from '@nestjs/graphql'
import type { Stream } from '@prisma/generated/client'

import { UserModel } from '@/modules/auth/account/models'
import { CategoryModel } from '@/modules/category/models'
import { ChatMessageModel } from '@/modules/chat/models'

@ObjectType()
export class StreamModel implements Stream {
	@Field(() => ID)
	public id: string

	@Field(() => String)
	public title: string

	@Field(() => String, { nullable: true })
	public thumbnail: string

	@Field(() => String, { nullable: true })
	public ingressId: string

	@Field(() => String, { nullable: true })
	public serverUrl: string

	@Field(() => String, { nullable: true })
	public streamKey: string

	@Field(() => Boolean)
	public isLive: boolean

	@Field(() => Boolean)
	public isChatEnabled: boolean

	@Field(() => Boolean)
	public isChatFollowersOnly: boolean

	@Field(() => Boolean)
	public isChatPremiumFollowersOnly: boolean

	@Field(() => UserModel)
	public user: UserModel

	@Field(() => String)
	public userId: string

	@Field(() => CategoryModel)
	public category: CategoryModel

	@Field(() => String)
	public categoryId: string

	@Field(() => [ChatMessageModel])
	public chatMessages: ChatMessageModel

	@Field(() => Date)
	public createdAt: Date

	@Field(() => Date)
	public updatedAt: Date
}
