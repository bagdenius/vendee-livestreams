import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Notification, NotificationType } from '@prisma/generated/client'

import { UserModel } from '@/modules/auth/account/models'

registerEnumType(NotificationType, { name: 'NotificationType' })

@ObjectType()
export class NotificationModel implements Notification {
	@Field(() => String)
	public id: string

	@Field(() => String)
	public message: string

	@Field(() => NotificationType)
	public type: NotificationType

	@Field(() => Boolean)
	public isRead: boolean

	@Field(() => UserModel)
	public user: UserModel

	@Field(() => String)
	public userId: string

	@Field(() => Date)
	public createdAt: Date

	@Field(() => Date)
	public updatedAt: Date
}
