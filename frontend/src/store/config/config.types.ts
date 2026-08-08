import type { ThemeColor } from '@/libs/constants/theme-colors.constants'

export interface ConfigStore {
  themeColor: ThemeColor
  setThemeColor: (themeColor: ThemeColor) => void
}
