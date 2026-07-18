'use client'

import { useSidebar } from '@/hooks'
import { cn } from '@/utils'
import { usePathname } from 'next/navigation'

import { DashboardNav } from './DashboardNav'
import { SidebarHeader } from './SidebarHeader'
import { UserNav } from './UserNav'

export function Sidebar() {
  const { isCollapsed } = useSidebar()
  const pathname = usePathname()

  const isDashboardPage = pathname.includes('/dashboard')

  return (
    <aside
      className={cn(
        'border-border bg-card fixed left-0 z-50 mt-15 flex h-full flex-col border-r transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64',
      )}
    >
      <SidebarHeader />
      {isDashboardPage ? <DashboardNav /> : <UserNav />}
    </aside>
  )
}
