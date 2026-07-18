'use client'

import { cn } from '@/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { CheckIcon } from 'lucide-react'

const channelVerifiedSizes = cva('', {
  variants: { size: { sm: 'size-3', default: 'size-4' } },
  defaultVariants: { size: 'default' },
})

interface ChannelVerifiedProps extends VariantProps<
  typeof channelVerifiedSizes
> {}

export function ChannelVerified({ size }: ChannelVerifiedProps) {
  return (
    <span
      className={cn(
        'bg-primary flex items-center justify-center rounded-full p-0.5',
        channelVerifiedSizes({ size }),
      )}
    >
      <CheckIcon
        className={cn(
          'stroke-[4px] text-white',
          size === 'sm' ? 'size-2' : 'size-2.75',
        )}
      />
    </span>
  )
}
