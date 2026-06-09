import { HeaderMenu } from './HeaderMenu'
import { Logo } from './Logo'
import { Search } from './Search'

export function Header() {
  return (
    <div className='fixed inset-y-0 z-50 h-15 w-full'>
      <header className='border-border bg-card flex h-full items-center gap-x-4 border-b p-4'>
        <Logo />
        <Search />
        <HeaderMenu />
      </header>
    </div>
  )
}
