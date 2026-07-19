'use client'

import { Button } from '@/components/ui/common'
import { ConfirmModal } from '@/components/ui/elements/ConfirmModal'
import { useDisableTotpMutation } from '@/graphql/generated'
import { useCurrentUser } from '@/hooks'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function DisableTotp() {
  const t = useTranslations('dashboard.settings.account.twofactor.disable')

  const { refetch } = useCurrentUser()
  const [disableTotp, { loading: isDisablingTotp }] = useDisableTotpMutation({
    onCompleted() {
      refetch()
      toast.success(t('successMessage'))
    },
    onError() {
      toast.error(t('errorMessage'))
    },
  })

  return (
    <ConfirmModal
      heading={t('heading')}
      message={t('message')}
      onConfirm={() => disableTotp()}
    >
      <Button variant='secondary' disabled={isDisablingTotp}>
        {t('trigger')}
      </Button>
    </ConfirmModal>
  )
}
