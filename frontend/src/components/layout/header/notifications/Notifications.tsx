import { BellIcon } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/common'

import { useGetUnreadNotificationsCountQuery } from '@/graphql/generated'

import { NotificationsList } from './NotificationsList'

export function Notifications() {
  const { data, loading } = useGetUnreadNotificationsCountQuery()
  const count = data?.getUnreadNotificationsCount ?? 0

  const displayCount = count > 10 ? '+9' : count

  if (loading) return null

  return (
    <Popover>
      <PopoverTrigger>
        {count !== 0 && (
          <div className='bg-primary absolute top-3.5 right-16 rounded-full px-1 text-xs font-semibold text-white'>
            {displayCount}
          </div>
        )}
        <BellIcon className='text-foreground size-5' />
      </PopoverTrigger>
      <PopoverContent align='end' className='max-h-125 w-80 overflow-y-auto'>
        <NotificationsList />
      </PopoverContent>
    </Popover>
  )
}
