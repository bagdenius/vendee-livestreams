import { Markup } from 'telegraf'

export const BUTTONS = {
	authSuccess: Markup.inlineKeyboard([
		[
			Markup.button.callback('📋 My folllowings', 'follows'),
			Markup.button.callback('👤 My profile', 'me'),
		],
		[Markup.button.url('🌐 Go to Website', 'https://vendee-livestreams.com')],
	]),
	profile: Markup.inlineKeyboard([
		Markup.button.url(
			'⚙️ Profile settings',
			'https://vendee-livestreams.com/dashboard/settings',
		),
	]),
}
