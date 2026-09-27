'use client'

import { CardContainer } from '@/components/ui/elements'
import { useConfig } from '@/hooks'
import { THEME_COLORS } from '@/libs/constants'
import { CheckIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function ChangeThemeColorForm() {
  const t = useTranslations('dashboard.settings.appearance.color')
  const config = useConfig()

  return (
    <CardContainer
      heading={t('heading')}
      description={t('description')}
      rightContent={
        <div className='flex gap-2'>
          {THEME_COLORS.map((themeColor) => {
            const isActive = config.themeColor === themeColor.name

            return (
              <button
                key={themeColor.name}
                type='button'
                onClick={() => config.setTheme(themeColor.name)}
              >
                <span
                  className='hover:border-foreground flex size-9 shrink-0 -translate-x-1 items-center justify-center rounded-full hover:border-2'
                  style={{
                    backgroundColor: `hsl(${themeColor.color})`,
                  }}
                >
                  {isActive && <CheckIcon className='size-5 text-white' />}
                </span>
              </button>
            )
          })}
        </div>
      }
    />
  )
}
