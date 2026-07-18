import { FolderIcon, HomeIcon, RadioIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Route } from './route.interface'
import SidebarItem from './SidebarItem'
import RecommendedChannels from './RecommendedChannels'

export default function UserNav() {
  const t = useTranslations('layout.sidebar.userNav')

  const routes: Route[] = [
    {
      label: t('home'),
      href: '/',
      icon: HomeIcon,
    },
    {
      label: t('categories'),
      href: '/categories',
      icon: FolderIcon,
    },
    {
      label: t('streams'),
      href: '/streams',
      icon: RadioIcon,
    },
  ]

  return (
    <div className='space-y-2 px-2 pt-4 lg:pt-0'>
      {routes.map((route, index) => (
        <SidebarItem key={index} route={route} />
      ))}
      <RecommendedChannels />
    </div>
  )
}
