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

  const exit = useCallback(() => {
    // Drop the current user synchronously, in the same tick as flipping the
    // flag: a stale cached user with a false flag would make useCurrentUser log
    // back in, and a true flag while queries fail as UNAUTHENTICATED would make
    // it call exit() again in a loop.
    client.cache.evict({ id: 'ROOT_QUERY', fieldName: 'getMe' })
    client.cache.gc()
    setIsAuthentificated(false)
    client.clearStore().catch(() => {})
  }, [client, setIsAuthentificated])

  return {
    isAuthentificated,
    auth,
    exit,
  }
}
