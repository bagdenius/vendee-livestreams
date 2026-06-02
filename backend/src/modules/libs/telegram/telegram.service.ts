import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/generated/client'
import { TokenType } from '@prisma/generated/enums'
import { Action, Command, Ctx, Start, Update } from 'nestjs-telegraf'
import { Context, Telegraf } from 'telegraf'

import { PrismaService } from '@/core/prisma'
import type { SessionMetadata } from '@/shared/types'

import { BUTTONS } from './telegram.buttons'
import { MESSAGES } from './telegram.messages'

@Update()
@Injectable()
export class TelegramService extends Telegraf {
	private readonly _token: string

	public constructor(
		private readonly configService: ConfigService,
		private readonly prisma: PrismaService,
	) {
		super(configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'))
		this._token = this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN')
	}

	private async connectTelegram(userId: string, chatId: string) {
		return await this.prisma.user.update({
			where: { id: userId },
			data: { telegramId: chatId },
		})
	}

	private async getUserByChatId(chatId: string) {
		return await this.prisma.user.findUnique({
			where: { telegramId: chatId },
			include: { followers: true, followings: true },
		})
	}

	private getMessageText(ctx: Context): string | undefined {
		const message = ctx.message
		if (!message || !('text' in message)) return undefined
		return message.text
	}

	@Start()
	public async onStart(@Ctx() ctx: Context) {
		const chatId = ctx.chat?.id?.toString()
		if (!chatId) return ctx.reply('An error occured')

		const text = this.getMessageText(ctx)
		const token = text?.split(' ')[1]

		if (!token) {
			const user = await this.getUserByChatId(chatId)
			if (user) return this.onMe(ctx)
			return ctx.replyWithHTML(MESSAGES.welcome, BUTTONS.profile)
		}

		const authToken = await this.prisma.token.findUnique({
			where: { token, type: TokenType.TELEGRAM_AUTH },
		})
		if (!authToken) return ctx.reply(MESSAGES.invalidToken)

		const hasExpired = authToken.expiresIn < new Date()
		if (hasExpired) {
			await this.prisma.token.delete({ where: { id: authToken.id } })
			return ctx.reply(MESSAGES.invalidToken)
		}

		await this.connectTelegram(authToken.userId, chatId)

		await this.prisma.token.delete({ where: { id: authToken.id } })

		return ctx.replyWithHTML(MESSAGES.authSuccess, BUTTONS.authSuccess)
	}

	@Command('me')
	@Action('me')
	public async onMe(@Ctx() ctx: Context) {
		const chatId = ctx.chat?.id?.toString()
		if (!chatId) return ctx.reply('An error occured')

		const user = await this.getUserByChatId(chatId)
		if (!user) return ctx.reply('User not found')

		const followersCount = await this.prisma.follow.count({
			where: { followingId: user.id },
		})

		await ctx.replyWithHTML(
			MESSAGES.profile(user, followersCount),
			BUTTONS.profile,
		)
	}

	@Command('follows')
	@Action('follows')
	public async onFollows(@Ctx() ctx: Context) {
		const chatId = ctx.chat?.id?.toString()
		if (!chatId) return ctx.reply('An error occured')

		const user = await this.getUserByChatId(chatId)
		if (!user) return ctx.reply('❌ User not found')

		const follows = await this.prisma.follow.findMany({
			where: { followerId: user.id },
			include: { following: true },
		})

		if (user && follows.length) {
			const followsList = follows
				.map((follow) => MESSAGES.follows(follow.following))
				.join('\n')

			const message = `<b>🌟 following channels:</b>\n\n${followsList}`

			await ctx.replyWithHTML(message)
		} else {
			await ctx.replyWithHTML("<b>❌ You don't follow any channel.</b>")
		}
	}

	public async sendPasswordResetToken(
		chatId: string,
		token: string,
		metadata: SessionMetadata,
	) {
		await this.telegram.sendMessage(
			chatId,
			MESSAGES.resetPassword(token, metadata),
			{ parse_mode: 'HTML' },
		)
	}

	public async sendDeactivationToken(
		chatId: string,
		token: string,
		metadata: SessionMetadata,
	) {
		await this.telegram.sendMessage(
			chatId,
			MESSAGES.deactivate(token, metadata),
			{ parse_mode: 'HTML' },
		)
	}

	public async sendAccountDeletion(chatId: string) {
		await this.telegram.sendMessage(chatId, MESSAGES.accountDeleted, {
			parse_mode: 'HTML',
		})
	}

	public async sendStreamStart(chatId: string, channel: User) {
		await this.telegram.sendMessage(chatId, MESSAGES.streamStart(channel), {
			parse_mode: 'HTML',
		})
	}

	public async sendNewFollower(chatId: string, follower: User) {
		const user = await this.getUserByChatId(chatId)

		if (!user)
			return await this.telegram.sendMessage(chatId, '❌ User not found')

		await this.telegram.sendMessage(
			chatId,
			MESSAGES.newFollower(follower, user.followings.length),
			{ parse_mode: 'HTML' },
		)
	}
}
