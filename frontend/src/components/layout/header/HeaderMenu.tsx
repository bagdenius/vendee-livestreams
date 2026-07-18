'use client'

import { useAuth } from '@/hooks'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

import { Button } from '@/components/ui/common'

import { ProfileMenu } from './ProfileMenu'

export function HeaderMenu() {
  const t = useTranslations('layout.header.menu')
  const { isAuthentificated } = useAuth()

  return (
    <div className='ml-auto flex items-center gap-x-4'>
      {isAuthentificated ? (
        <ProfileMenu />
      ) : (
        <>
          <Link href='/auth/login'>
            <Button variant='secondary'>{t('login')}</Button>
          </Link>
          <Link href='/auth/signup'>
            <Button>{t('signup')}</Button>
          </Link>
        </>
      )}
    </div>
  )
}
