import { Header } from '@/components/layout/header'
import type { PropsWithChildren } from 'react'

export default function SiteLayout({ children }: PropsWithChildren) {
  return (
    <div className='flex h-full flex-col'>
      <div className='flex-1'>
        <Header />
        <main className='mt-15'>{children}</main>
      </div>
    </div>
  )
}
