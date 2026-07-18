'use client'

import { useCurrentUser } from '@/hooks'

export default function Homepage() {
  const { user, isLoadingUser: isLoading } = useCurrentUser()

  return (
    <div>
      <div>{isLoading ? 'Loading...' : JSON.stringify(user)}</div>
    </div>
  )
}
