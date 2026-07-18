'use client'

import { useSidebar } from '@/hooks'
import { useTranslations } from 'next-intl'

import { Separator } from '@/components/ui/common'
import { ChannelItem } from '@/components/ui/elements'

import { useGetRecommendedChannelsQuery } from '@/graphql/generated'

export function RecommendedChannels() {
  const t = useTranslations('layout.sidebar.recommended')
  const { isCollapsed } = useSidebar()

  const { data, loading: isLoadingRecommendedChannels } =
    useGetRecommendedChannelsQuery()
  const channels = data?.getRecommendedChannels ?? []

  return (
    <div>
      <Separator className='mb-3' />
      {!isCollapsed && (
        <h2 className='text-foreground mb-2 px-2 text-lg font-semibold'>
          {t('heading')}
        </h2>
      )}
      {isLoadingRecommendedChannels ? (
        <div>Loading...</div>
      ) : (
        channels.map((channel) => (
          <ChannelItem key={channel.id} channel={channel} />
        ))
      )}
    </div>
  )
}
