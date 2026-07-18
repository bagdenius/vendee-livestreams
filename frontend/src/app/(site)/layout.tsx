import type { PropsWithChildren } from 'react'

import { Header } from '@/components/layout/header'
import { LayoutContainer } from '@/components/layout/LayoutContainer'
import { Sidebar } from '@/components/layout/sidebar/Sidebar'

export default function SiteLayout({ children }: PropsWithChildren) {
  return (
    <div className='flex h-full flex-col'>
      <div className='flex-1'>
        <Header />
        <Sidebar />
        <LayoutContainer>{children}</LayoutContainer>
      </div>
    </div>
  )
}
