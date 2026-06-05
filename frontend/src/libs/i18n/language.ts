'use server'

import { cookies } from 'next/headers'

import { defaultLanguage, I18N_COOKIE_NAME, type Language } from './i18n.config'

export async function getCurrentLanguage() {
	const cookiesStore = await cookies()
	const language = cookiesStore.get(I18N_COOKIE_NAME)?.value ?? defaultLanguage
	return language
}

export async function setLanguage(language: Language) {
	const cookiesStore = await cookies()
	return cookiesStore.set(I18N_COOKIE_NAME, language)
}
