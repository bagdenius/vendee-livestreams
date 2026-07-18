import messages from '@/../public/languages/en.json'

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof messages
  }
}
