'use client'

import { useConfig } from '@/hooks'
import { useEffect } from 'react'

export function ThemeColorSwitcher() {
  const { themeColor } = useConfig()

  useEffect(() => {
    const themeColorClass = [...document.body.classList].find((className) =>
      className.startsWith('theme-color-'),
    )
    if (themeColorClass) {
      document.body.classList.remove(themeColorClass)
    }
    document.body.classList.add(`theme-color-${themeColor}`)
  }, [themeColor])

  return null
}
