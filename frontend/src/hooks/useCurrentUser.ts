import { useEffect } from 'react'

import {
  useClearSessionCookieMutation,
  useGetMeQuery,
} from '@/graphql/generated'

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

  useEffect(() => {
    if (user && !isAuthentificated) auth()
  }, [user, isAuthentificated, auth])

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
