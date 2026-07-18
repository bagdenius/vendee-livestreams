'use client'

import { useSidebar } from '@/hooks'
import { cn } from '@/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { GetRecommendedChannelsQuery } from '@/graphql/generated'

import { Button } from '../common'

import { ChannelAvatar } from './ChannelAvatar'
import { ChannelVerified } from './ChannelVerified'
import { Hint } from './Hint'
import { LiveBadge } from './LiveBadge'

interface ChannelItemProps {
  channel: GetRecommendedChannelsQuery['getRecommendedChannels'][0]
}

export function ChannelItem({ channel }: ChannelItemProps) {
  const pathname = usePathname()
  const { isCollapsed } = useSidebar()

  const { username, avatar, isVerified, stream } = channel

  const isActive = pathname === `/${username}`

  return isCollapsed ? (
    <Hint label={username} side='right'>
      <Link
        href={`/${username}`}
        className='mt-3 flex w-full items-center justify-center'
      >
        <ChannelAvatar channel={channel} isLive={stream.isLive} />
      </Link>
    </Hint>
  ) : (
    <Button
      className={cn('mt-2 h-11 w-full justify-start', isActive && 'bg-accent')}
      variant='ghost'
      nativeButton={false}
      render={
        <Link href={`/${username}`} className='flex w-full items-center'>
          <ChannelAvatar size='sm' channel={channel} isLive={stream.isLive} />
          <h2 className='truncate pl-3'>{username}</h2>
          {isVerified && <ChannelVerified size='sm' />}
          {!stream.isLive && (
            <div className='absolute right-5'>
              <LiveBadge />
            </div>
          )}
        </Link>
      }
    />
  )
}
