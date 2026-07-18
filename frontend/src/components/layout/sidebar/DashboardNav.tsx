import {
  BanknoteIcon,
  DollarSignIcon,
  KeyRoundIcon,
  MedalIcon,
  MessageSquareIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Route } from './route.interface'
import { SidebarItem } from './SidebarItem'

export function DashboardNav() {
  const t = useTranslations('layout.sidebar.dashboardNav')

  const routes: Route[] = [
    {
      label: t('settings'),
      href: '/dashboard/settings',
      icon: SettingsIcon,
    },
    {
      label: t('keys'),
      href: '/dashboard/keys',
      icon: KeyRoundIcon,
    },
    {
      label: t('chatSettings'),
      href: '/dashboard/chat',
      icon: MessageSquareIcon,
    },
    {
      label: t('followers'),
      href: '/dashboard/followers',
      icon: UsersIcon,
    },
    {
      label: t('sponsors'),
      href: '/dashboard/sponsors',
      icon: MedalIcon,
    },
    {
      label: t('premium'),
      href: '/dashboard/plans',
      icon: DollarSignIcon,
    },
    {
      label: t('transactions'),
      href: '/dashboard/transactions',
      icon: BanknoteIcon,
    },
  ]

  return (
    <div className='space-y-2 px-2 pt-4 lg:pt-0'>
      {routes.map((route, index) => (
        <SidebarItem key={index} route={route} />
      ))}
    </div>
  )
}
