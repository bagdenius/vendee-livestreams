'use client'

import { Skeleton } from '@/components/ui/common'
import { CardContainer } from '@/components/ui/elements/CardContainer'
import { useCurrentUser } from '@/hooks'
import { useTranslations } from 'next-intl'
import { EnableTotp } from './EnableTotp'
import { DisableTotp } from './DisableTotp'

export function WrapperTotp() {
  const t = useTranslations('dashboard.settings.account.twofactor')

  const { user, isLoadingUser } = useCurrentUser()

  return isLoadingUser ? (
    <WrapperTotpSkeleton />
  ) : (
    <CardContainer
      heading={t('heading')}
      description={t('description')}
      rightContent={
        <div className='flex items-center gap-x-4'>
          {!user?.isTotpEnabled ? <EnableTotp /> : <DisableTotp />}
        </div>
      }
    />
  )
}

export function WrapperTotpSkeleton() {
  return <Skeleton className='h-24 w-full' />
}
