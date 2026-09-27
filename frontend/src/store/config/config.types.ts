import { type ThemeColor } from '@/libs/constants'

export interface ConfigStore {
  themeColor: ThemeColor
  setThemeColor: (themeColor: ThemeColor) => void
}
