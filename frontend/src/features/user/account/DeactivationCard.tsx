'use client'

import { Button } from '@/components/ui/common'
import { CardContainer } from '@/components/ui/elements/CardContainer'
import { ConfirmModal } from '@/components/ui/elements/ConfirmModal'
import { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { useRouter } from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.deactivation')

  return { title: t('heading') }
}

export function DeactivationCard() {
  const t = useTranslations('dashboard.settings.account.deactivation')

  const router = useRouter()

  return (
    <CardContainer
      heading={t('heading')}
      description={t('description')}
      rightContent={
        <div className='flex items-center gap-x-4'>
          <ConfirmModal
            heading={t('confirmModal.heading')}
            message={t('confirmModal.message')}
            onConfirm={() => router.push('/auth/deactivation')}
          >
            <Button>{t('button')}</Button>
          </ConfirmModal>
        </div>
      }
    ></CardContainer>
  )
}
