import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Authorization, Authorized } from '@/shared/decorators'

import { ChangeNotificationSettingsInput } from './inputs'
import { ChangeNotificationSettingsResponse, NotificationModel } from './models'
import { NotificationService } from './notification.service'

@Resolver('Notification')
export class NotificationResolver {
	public constructor(
		private readonly notificationService: NotificationService,
	) {}

	@Query(() => Number, { name: 'getUnreadNotificationsCount' })
	@Authorization()
	public async getUnreadCount(@Authorized('id') userId: string) {
		return this.notificationService.getUnreadCount(userId)
	}

	@Query(() => [NotificationModel], { name: 'getNotificationsByUser' })
	@Authorization()
	public async getByUser(@Authorized('id') userId: string) {
		return this.notificationService.getByUser(userId)
	}

	@Mutation(() => ChangeNotificationSettingsResponse, {
		name: 'changeNotificationsSettings',
	})
	@Authorization()
	public async changeSettings(
		@Authorized('id') userId: string,
		@Args('data') input: ChangeNotificationSettingsInput,
	) {
		return this.notificationService.changeSettings(userId, input)
	}
}
