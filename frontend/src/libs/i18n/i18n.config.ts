export const I18N_COOKIE_NAME = 'language'
export const languages = ['en', 'uk'] as const
export const defaultLanguage = 'en'

export type Language = (typeof languages)[number]
