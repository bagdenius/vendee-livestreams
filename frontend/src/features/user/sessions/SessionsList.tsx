'use client'

import { Heading, ToggleCardSkeleton } from '@/components/ui/elements'
import {
  useGetCurrentSessionQuery,
  useGetSessionsByUserQuery,
} from '@/graphql/generated'
import { useTranslations } from 'next-intl'
import { SessionItem } from './SessionItem'

export function SessionsList() {
  const t = useTranslations('dashboard.settings.sessions')

  const { data: currentSessionData, loading: isLoadingCurrentSession } =
    useGetCurrentSessionQuery()
  const currentSession = currentSessionData?.getCurrentSession

  const { data: sessionsData, loading: isLoadingSessions } =
    useGetSessionsByUserQuery()
  const sessions = sessionsData?.getSessionsByUser ?? []

  return (
    <div className='space-y-6'>
      <Heading title={t('info.current')} size='sm' />
      {isLoadingCurrentSession ? (
        <ToggleCardSkeleton />
      ) : (
        currentSession && (
          <SessionItem session={currentSession} isCurrentSession />
        )
      )}
      <Heading title={t('info.active')} size='sm' />
      {isLoadingSessions ? (
        Array.from({ length: 3 }).map((_, index) => (
          <ToggleCardSkeleton key={index} />
        ))
      ) : sessions.length ? (
        sessions.map((session, index) => (
          <SessionItem key={index} session={session} />
        ))
      ) : (
        <div className='text-muted-foreground'>{t('info.notFound')}</div>
      )}
    </div>
  )
}
