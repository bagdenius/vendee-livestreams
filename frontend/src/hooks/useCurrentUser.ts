import { useEffect } from 'react'

import {
  useClearSessionCookieMutation,
  useGetMeQuery,
} from '@/graphql/generated'

import { useAuth } from './useAuth'

export function useCurrentUser() {
  const { isAuthentificated, exit } = useAuth()

  const { data, loading, refetch, error } = useGetMeQuery({
    skip: !isAuthentificated,
  })

  const [clearCookie] = useClearSessionCookieMutation()

  useEffect(() => {
    if (error) {
      if (isAuthentificated) clearCookie()
      exit()
    }
  }, [isAuthentificated, exit, clearCookie])

  return {
    user: data?.getMe,
    isLoading: loading,
    refetch,
  }
}
