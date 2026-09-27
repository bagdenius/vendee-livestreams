'use client'

import { CardContainer, ConfirmModal } from '@/components/ui/elements'
import {
  useGetSessionsByUserQuery,
  useRemoveSessionMutation,
  type GetSessionsByUserQuery,
} from '@/graphql/generated'
import { getBrowserIcon } from '@/shared/utils'
import { useTranslations } from 'next-intl'
import { SessionModal } from './SessionModal'
import { Button } from '@/components/ui/common'
import { toast } from 'sonner'

interface SessionItemProps {
  session: GetSessionsByUserQuery['getSessionsByUser'][0]
  isCurrentSession?: boolean
}

export function SessionItem({
  session,
  isCurrentSession,
}: SessionItemProps) {
  const t = useTranslations('dashboard.settings.sessions.sessionItem')

  const { refetch } = useGetSessionsByUserQuery()

  const [remove, { loading: isRemoving }] = useRemoveSessionMutation({
    onCompleted() {
      refetch()
      toast.success(t('successMessage'))
    },
    onError() {
      toast.error(t('errorMessage'))
    },
  })

  const Icon = getBrowserIcon(session.metadata.device.browser)

  return (
    <CardContainer
      heading={`${session.metadata.device.browser}, ${session.metadata.device.os}`}
      description={`${session.metadata.location.city}, ${session.metadata.location.country}`}
      Icon={Icon}
      rightContent={
        <div className='flex items-center gap-x-4'>
          {!isCurrentSession && (
            <ConfirmModal
              heading={t('confirmModal.heading')}
              message={t('confirmModal.message')}
              onConfirm={() => remove({ variables: { id: session.id } })}
            >
              <Button variant='secondary' disabled={isRemoving}>
                {t('deleteButton')}
              </Button>
            </ConfirmModal>
          )}
          <SessionModal session={session}>
            <Button>{t('detailsButton')}</Button>
          </SessionModal>
        </div>
      }
    />
  )
}
