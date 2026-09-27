import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/common'
import type { GetSessionsByUserQuery } from '@/graphql/generated'
import { useFormatDate } from '@/hooks'
import { useTranslations } from 'next-intl'
import { ReactElement } from 'react'
import { SessionMap } from './SessionMap'

interface SessionModalProps {
  children: ReactElement
  session: GetSessionsByUserQuery['getSessionsByUser'][0]
}

export function SessionModal({ children, session }: SessionModalProps) {
  const t = useTranslations(
    'dashboard.settings.sessions.sessionItem.sessionModal',
  )
  const formatDate = useFormatDate()

  return (
    <Dialog>
      <DialogTrigger render={children} />
      <DialogContent className='sm:max-w-md'>
        <DialogTitle className='text-xl'>{t('heading')}</DialogTitle>
        <div className='space-y-3'>
          <div className='flex items-center'>
            <span className='font-medium'>{t('device')}</span>
            <span className='text-muted-foreground ml-2'>
              {session.metadata.device.browser}, {session.metadata.device.os}
            </span>
          </div>
          <div className='flex items-center'>
            <span className='font-medium'>{t('location')}</span>
            <span className='text-muted-foreground ml-2'>
              {session.metadata.location.city},{' '}
              {session.metadata.location.country}
            </span>
          </div>
          <div className='flex items-center'>
            <span className='font-medium'>{t('ipAdress')}</span>
            <span className='text-muted-foreground ml-2'>
              {session.metadata.ip}
            </span>
          </div>
          <div className='flex items-center'>
            <span className='font-medium'>{t('createdAt')}</span>
            <span className='text-muted-foreground ml-2'>
              {formatDate(session.createdAt, true)}
            </span>
          </div>
          <SessionMap
            latitude={session.metadata.location.latitude}
            longitude={session.metadata.location.longitude}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
