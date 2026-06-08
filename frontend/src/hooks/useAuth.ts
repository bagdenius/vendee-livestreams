import { authStore } from '@/store/auth'

export function useAuth() {
  const isAuthentificated = authStore((state) => state.isAuthentificated)
  const setIsAuthentificated = authStore((state) => state.setIsAuthentificated)

  const auth = () => setIsAuthentificated(true)
  const exit = () => setIsAuthentificated(false)

  return {
    isAuthentificated,
    auth,
    exit,
  }
}
