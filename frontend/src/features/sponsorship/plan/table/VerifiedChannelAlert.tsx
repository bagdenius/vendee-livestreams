'use client'

import { ShieldAlertIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function VerifiedChannelAlert() {
  const t = useTranslations('dashboard.plans.alert')

  return (
    <div className='flex h-[75vh] w-full flex-col items-center justify-center'>
      <ShieldAlertIcon className='text-muted-foreground size-20' />
      <h1 className='mt-6 text-2xl font-semibold'></h1>
      <p className='text-muted-foreground mt-3 w-full items-center text-center lg:w-[60%]'>
        {t('description')}
      </p>
    </div>
  )
}
