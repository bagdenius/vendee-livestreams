import { configStore } from '@/store/config/config.store'

export function useConfig() {
  const themeColor = configStore((state) => state.themeColor)
  const setTheme = configStore((state) => state.setThemeColor)

  return { themeColor, setTheme }
}
