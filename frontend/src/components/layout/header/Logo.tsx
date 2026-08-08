'use client'

import LogoImage from '@/components/images/LogoImage'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function Logo() {
  const t = useTranslations('layout.logo')

  return (
    <Link
      href='/'
      className='flex items-center gap-x-2 transition-opacity hover:opacity-75'
    >
      <LogoImage />
      <div className='hidden leading-tight lg:block'>
        <h2 className='text-accent-foreground text-xl'>Vendee</h2>
        <p className='text-muted-foreground text-xs'>{t('platform')}</p>
      </div>
    </Link>
  )
}
