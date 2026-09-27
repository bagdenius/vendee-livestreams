'use client'

import { Heading, ToggleCardSkeleton } from '@/components/ui/elements'
import { useCurrentUser } from '@/hooks'
import { useTranslations } from 'next-intl'
import { InstructionModal } from './InstructionModal'
import { CreateIngressForm } from './forms/CreateIngressForm'
import { StreamUrl } from './forms/StreamUrl'
import { StreamKey } from './forms/StreamKey'

export function KeysSettings() {
  const t = useTranslations('dashboard.keys.header')

  const { user, isLoadingUser } = useCurrentUser()

  return (
    <div className='lg:px-10'>
      <div className='block items-center justify-between space-y-3 lg:flex lg:space-y-0'>
        <Heading
          title={t('heading')}
          description={t('description')}
          size='lg'
        />
        <div className='flex items-center gap-x-4'>
          <InstructionModal />
          <CreateIngressForm />
        </div>
      </div>
      <div className='mt-5 space-y-6'>
        {isLoadingUser ? (
          Array.from({ length: 2 }).map((_, index) => (
            <ToggleCardSkeleton key={index} />
          ))
        ) : (
          <>
            <StreamUrl value={user?.stream.serverUrl!} />
            <StreamKey value={user?.stream.streamKey!} />
          </>
        )}
      </div>
    </div>
  )
}
