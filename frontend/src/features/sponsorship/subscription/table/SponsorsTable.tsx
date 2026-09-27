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
  type GetMySponsorsQuery,
  useGetMySponsorsQuery,
} from '@/graphql/generated'
import { useFormatDate } from '@/hooks'
import { MoreHorizontalIcon, UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function SponsorsTable() {
  const t = useTranslations('dashboard.sponsors')
  const formatDate = useFormatDate()

  const { data, loading: isLoadingSponsors } = useGetMySponsorsQuery()
  const sponsors = data?.getMySponsors ?? []
  const sponsorsColumns: DataTableColumn<
    GetMySponsorsQuery['getMySponsors'][0]
  >[] = [
    {
      accessorKey: 'user',
      header: t('columns.user'),
      cell: ({ row }) => (
        <div className='flex items-center gap-x-2'>
          <ChannelAvatar channel={row.original.user} size='sm' />
          <h2>{row.original.user.username}</h2>
          {row.original.user.isVerified && <ChannelVerified size='sm' />}
        </div>
      ),
    },
    {
      accessorKey: 'plan',
      header: t('columns.plan'),
      cell: ({ row }) => row.original.plan.title,
    },
    {
      accessorKey: 'expiresAt',
      header: t('columns.date'),
      cell: ({ row }) => formatDate(row.original.expiresAt),
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
                <Link href={`/${row.original.user.username}`} target='_blank' />
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
        {isLoadingSponsors ? (
          <DataTableSkeleton />
        ) : (
          <DataTable columns={sponsorsColumns} data={sponsors} />
        )}
      </div>
    </div>
  )
}
