import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { AuthStore } from './auth.types'

export const authStore = create(
  persist<AuthStore>(
    (set) => ({
      isAuthentificated: false,
      setIsAuthentificated: (value: boolean) =>
        set({ isAuthentificated: value }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
