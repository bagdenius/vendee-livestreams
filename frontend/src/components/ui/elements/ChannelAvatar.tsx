'use client'

import { cn, getMediaSource } from '@/shared/utils'
import { cva, type VariantProps } from 'class-variance-authority'

import { GetMeQuery } from '@/graphql/generated'

import { Avatar, AvatarFallback, AvatarImage } from '../common'

const avatarSizes = cva('', {
  variants: {
    size: { sm: 'size-7', default: 'size-9', lg: 'size-14', xl: 'size-32' },
  },
  defaultVariants: { size: 'default' },
})

interface ChannelAvatarProps extends VariantProps<typeof avatarSizes> {
  channel: Pick<GetMeQuery['getMe'], 'username' | 'avatar'>
  isLive?: boolean
}

export function ChannelAvatar({ size, channel, isLive }: ChannelAvatarProps) {
  return (
    <div className='relative'>
      <Avatar
        className={cn(avatarSizes({ size }), isLive && 'ring-2 ring-rose-500')}
      >
        <AvatarImage
          src={getMediaSource(channel.avatar!)}
          className='object-cover'
        />
        <AvatarFallback className={cn(size === 'xl' ? 'text-5xl' : 'text-xl')}>
          {channel.username[0]}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}
