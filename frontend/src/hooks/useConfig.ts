import { useConfigStore } from '@/store/config/config.store'

export function useConfig() {
  const themeColor = useConfigStore((state) => state.themeColor)
  const setTheme = useConfigStore((state) => state.setThemeColor)

  return { themeColor, setTheme }
}
