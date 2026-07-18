'use client'

import { useCurrentUser } from '@/hooks'

export default function Homepage() {
  const { user, isLoading } = useCurrentUser()

  return (
    <div>
      <div>{isLoading ? 'Loading...' : JSON.stringify(user)}</div>
    </div>
  )
}
