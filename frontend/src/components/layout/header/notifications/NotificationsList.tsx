import parse from 'html-react-parser'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react/jsx-runtime'

import { Separator, Spinner } from '@/components/ui/common'

import {
  useGetNotificiationsByUserQuery,
  useGetUnreadNotificationsCountQuery,
} from '@/graphql/generated'

import { getNotificationIcon } from '@/utils/get-notification-icon.util'

export function NotificationsList() {
  const t = useTranslations('layout.header.menu.profile.notifications')
  const { refetch } = useGetUnreadNotificationsCountQuery()
  const { data, loading } = useGetNotificiationsByUserQuery({
    onCompleted() {
      refetch()
    },
  })
  const notifications = data?.getNotificationsByUser ?? []

  return (
    <>
      <h2 className='text-center text-lg font-medium'>{t('heading')}</h2>
      <Separator />
      {loading ? (
        <div className='text-foreground flex items-center justify-center gap-x-2 text-sm'>
          <Spinner className='size-5' />
          {t('loading')}
        </div>
      ) : notifications.length ? (
        notifications.map((notification, index) => {
          const Icon = getNotificationIcon(notification.type)
          return (
            <Fragment key={notification.id}>
              <div className='hover:bg-accent flex items-center gap-x-3 text-sm'>
                <div className='bg-foreground rounded-full p-2'>
                  <Icon className='text-secondary' />
                </div>
                <div>{parse(notification.message)}</div>
              </div>
              {index < notifications.length - 1 && <Separator />}
            </Fragment>
          )
        })
      ) : (
        <div className='text-muted-foreground text-center'>{t('empty')}</div>
      )}
    </>
  )
}
