import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { ConfigStore } from './config.types'
import { ThemeColor } from '@/libs/constants/theme-colors.constants'

export const configStore = create(
  persist<ConfigStore>(
    (set) => ({
      themeColor: 'violet',
      setThemeColor: (themeColor: ThemeColor) => set({ themeColor }),
    }),
    {
      name: 'config',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
