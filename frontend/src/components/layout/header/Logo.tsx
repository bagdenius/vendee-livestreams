'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

export function Logo() {
  const t = useTranslations('layout.logo')

  return (
    <Link
      href='/'
      className='flex items-center gap-x-2 transition-opacity hover:opacity-75'
    >
      <Image src='/images/logo.svg' alt='Vendee logo' width={32} height={32} />
      <div className='hidden leading-tight lg:block'>
        <h2 className='text-accent-foreground text-xl'>Vendee</h2>
        <p className='text-muted-foreground text-xs'>{t('platform')}</p>
      </div>
    </Link>
  )
}
