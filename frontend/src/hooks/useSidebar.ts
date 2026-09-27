import { useSidebarStore } from '@/store/sidebar/sidebar.store'

export function useSidebar() {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)
  const setIsCollapsed = useSidebarStore((state) => state.setIsCollapsed)

  const open = () => setIsCollapsed(false)
  const close = () => setIsCollapsed(true)

  return {
    isCollapsed,
    open,
    close,
  }
}
