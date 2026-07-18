'use client'

import { useAuth, useCurrentUser } from '@/hooks'
import { LayoutDashboardIcon, LogOutIcon, UserIcon, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Spinner,
} from '@/components/ui/common'
import { ChannelAvatar } from '@/components/ui/elements'

import { useLogoutUserMutation } from '@/graphql/generated'

import { Notifications } from './notifications'

export function ProfileMenu() {
  const t = useTranslations('layout.header.menu.profile')
  const router = useRouter()
  const { exit } = useAuth()
  const { user, isLoadingUser: isLoading } = useCurrentUser()
  const [logout] = useLogoutUserMutation({
    onCompleted() {
      exit()
      toast.success(t('successLogoutMessage'), {
        description: t('successLogoutDescription'),
        cancel: { label: <XIcon />, onClick() {} },
      })
      router.push('/auth/login')
    },
    onError(error) {
      toast.error(t('logoutErrorMessage'), {
        description: error.message,
        cancel: { label: <XIcon />, onClick() {} },
      })
    },
  })

  return isLoading || !user ? (
    <Spinner className='text-muted-foreground size-6' />
  ) : (
    <>
      <Notifications />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <ChannelAvatar channel={user} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-50'>
          <div className='flex items-center gap-x-3 p-2'>
            <ChannelAvatar channel={user} />
            <h2 className='text-foreground font-medium'>{user.username}</h2>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href={`/${user.username}`}>
              <DropdownMenuItem>
                <UserIcon className='mr-2' /> {t('channel')}
              </DropdownMenuItem>
            </Link>
            <Link href='/dashboard/settings'>
              <DropdownMenuItem>
                <LayoutDashboardIcon className='mr-2' /> {t('dashboard')}
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() => logout()}>
              <LogOutIcon className='mr-2' /> {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
