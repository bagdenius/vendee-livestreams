'use client'

import { useSidebar } from '@/hooks'
import { ArrowLeftFromLineIcon, ArrowRightFromLineIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/common'
import { Hint } from '@/components/ui/elements/Hint'

export function SidebarHeader() {
  const t = useTranslations('layout.sidebar.header')

  const { isCollapsed, open, close } = useSidebar()
  const label = isCollapsed ? t('expand') : t('collapse')

  return isCollapsed ? (
    <div className='mb-4 hidden w-full items-center justify-center pt-4 lg:flex'>
      <Hint label={label} side='right'>
        <Button onClick={() => open()} variant='ghost' size='icon'>
          <ArrowRightFromLineIcon className='size-4' />
        </Button>
      </Hint>
    </div>
  ) : (
    <div className='mb-2 flex w-full items-center justify-between p-3 pl-4'>
      <h2 className='text-foreground text-lg font-semibold'>
        {t('navigation')}
      </h2>
      <Hint label={label} side='right'>
        <Button onClick={() => close()} variant='ghost' size='icon'>
          <ArrowLeftFromLineIcon className='size-4' />
        </Button>
      </Hint>
    </div>
  )
}
