'use client'

import { ChannelAvatar } from '@/components/ui/elements'
import { useCurrentUser } from '@/hooks'

export default function Homepage() {
  const { user, isLoading } = useCurrentUser()

  return (
    <div>
      <div>{isLoading ? 'Loading...' : JSON.stringify(user)}</div>
    </div>
  )
}
