'use client'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/common'
import {
  ChannelAvatar,
  ChannelVerified,
  DataTable,
  type DataTableColumn,
  DataTableSkeleton,
  Heading,
} from '@/components/ui/elements'
import {
  type GetMyFollowersQuery,
  useGetMyFollowersQuery,
} from '@/graphql/generated'
import { useFormatDate } from '@/hooks'
import { MoreHorizontalIcon, UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function FollowersTable() {
  const t = useTranslations('dashboard.followers')
  const formatDate = useFormatDate()

  const { data, loading: isLoadingFollowers } = useGetMyFollowersQuery()
  const followers = data?.getMyFollowers ?? []
  const followersColumns: DataTableColumn<
    GetMyFollowersQuery['getMyFollowers'][0]
  >[] = [
    {
      accessorKey: 'follower',
      header: t('columns.user'),
      cell: ({ row }) => (
        <div className='flex items-center gap-x-2'>
          <ChannelAvatar channel={row.original.follower} size='sm' />
          <h2>{row.original.follower.username}</h2>
          {row.original.follower.isVerified && <ChannelVerified size='sm' />}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: t('columns.date'),
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: 'actions',
      header: t('columns.actions'),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant='ghost' className='size-8 p-0'>
                <MoreHorizontalIcon />
              </Button>
            }
          />
          <DropdownMenuContent className='w-auto' side='right'>
            <DropdownMenuItem
              render={
                <Link
                  href={`/${row.original.follower.username}`}
                  target='_blank'
                />
              }
            >
              <UserIcon className='mr-2 size-4' />
              {t('columns.viewChannel')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className='lg:px-10'>
      <Heading
        title={t('header.heading')}
        description={t('header.description')}
        size='lg'
      />
      <div className='mt-5'>
        {isLoadingFollowers ? (
          <DataTableSkeleton />
        ) : (
          <DataTable columns={followersColumns} data={followers} />
        )}
      </div>
    </div>
  )
}
