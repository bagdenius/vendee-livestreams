import { useEffect } from 'react'

import {
  useClearSessionCookieMutation,
  useGetMeQuery,
} from '@/graphql/generated'
import { useAuthStore } from '@/store/auth/auth.store'

import { useAuth } from './useAuth'

export function useCurrentUser() {
  const { isAuthentificated, auth, exit } = useAuth()

  // The session cookie is the source of truth: always ask the server who we are
  // instead of trusting the persisted flag, so the flag can recover after it
  // got out of sync (e.g. a request failed while the backend was restarting).
  const { data, loading, refetch, error } = useGetMeQuery()

  const [clearCookie] = useClearSessionCookieMutation()

  const user = data?.getMe
  const isUnauthenticated = !!error?.graphQLErrors.some(
    (graphQLError) => graphQLError.extensions?.code === 'UNAUTHENTICATED',
  )

  // Restore the flag only when a user arrives from the server. Reacting to the
  // flag itself would re-login right after exit(), while the old user is still
  // in the query result.
  useEffect(() => {
    if (user && !useAuthStore.getState().isAuthentificated) auth()
  }, [user, auth])

  // Log out only when the server says the session is invalid, not on network
  // errors or other failures.
  useEffect(() => {
    if (!isUnauthenticated || !isAuthentificated) return
    clearCookie()
    exit()
  }, [isUnauthenticated, isAuthentificated, clearCookie, exit])

  return {
    user,
    isLoadingUser: loading,
    refetch,
  }
}
