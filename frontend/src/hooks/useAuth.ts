import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import { useAuthStore } from '@/store/auth/auth.store'

export function useAuth() {
  const client = useApolloClient()

  const isAuthentificated = useAuthStore((state) => state.isAuthentificated)
  const setIsAuthentificated = useAuthStore(
    (state) => state.setIsAuthentificated,
  )

  // Cached query results belong to the previous user, so drop them whenever
  // the auth state changes: refetch active queries on login, just clear on exit.
  const auth = useCallback(() => {
    setIsAuthentificated(true)
    // Failed refetches are already reported through each query's own `error`.
    client.resetStore().catch(() => {})
  }, [client, setIsAuthentificated])

  // Clear the cache before flipping the flag, otherwise the stale user is still
  // cached when the flag becomes false and useCurrentUser would log back in.
  const exit = useCallback(async () => {
    await client.clearStore()
    setIsAuthentificated(false)
  }, [client, setIsAuthentificated])

  return {
    isAuthentificated,
    auth,
    exit,
  }
}
