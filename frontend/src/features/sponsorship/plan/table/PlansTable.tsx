'use client'

import { useCurrentUser, useFormatDate } from '@/hooks'
import { useTranslations } from 'next-intl'
import { VerifiedChannelAlert } from './VerifiedChannelAlert'
import {
  DataTable,
  DataTableColumn,
  DataTableSkeleton,
  Heading,
} from '@/components/ui/elements'
import { CreatePlanForm } from '../forms/CreatePlanForm'
import {
  GetMySponsorshipPlansQuery,
  useGetMySponsorshipPlansQuery,
  useRemoveSponsorshipPlanMutation,
} from '@/graphql/generated'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/common'
import { MoreHorizontalIcon, TrashIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { convertPrice } from '@/shared/utils'
import { toast } from 'sonner'

export function PlansTable() {
  const t = useTranslations('dashboard.plans')
  const formatDate = useFormatDate()
  const { user } = useCurrentUser()
  const {
    data,
    loading: isLoadingPlans,
    refetch,
  } = useGetMySponsorshipPlansQuery()
  const plans = data?.getMySponsorshipPlans ?? []

  const plansColumns: DataTableColumn<
    GetMySponsorshipPlansQuery['getMySponsorshipPlans'][0]
  >[] = [
    {
      accessorKey: 'title',
      header: t('columns.title'),
      cell: ({ row }) => row.original.title,
    },
    {
      accessorKey: 'price',
      header: t('columns.price'),
      cell: ({ row }) => convertPrice(row.original.price),
    },
    {
      accessorKey: 'createdAt',
      header: t('columns.date'),
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: 'actions',
      header: t('columns.actions'),
      cell: ({ row }) => {
        const [remove, { loading: isRemoving }] =
          useRemoveSponsorshipPlanMutation({
            onCompleted() {
              refetch()
              toast.success(t('columns.successMessage'))
            },
            onError() {
              toast.error(t('columns.errorMessage'))
            },
          })

        return (
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
                onClick={() =>
                  remove({
                    variables: { id: row.original.id },
                  })
                }
                className='text-red-500 focus:text-red-500'
                disabled={isRemoving}
              >
                <TrashIcon />
                {t('columns.remove')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return user?.isVerified ? (
    <div className='lg:px-10'>
      <div className='block items-center justify-between space-y-3 lg:flex lg:space-y-0'>
        <Heading
          title={t('header.heading')}
          description={t('header.description')}
        />
        <CreatePlanForm />
      </div>
      <div className='mt-5'>
        {isLoadingPlans ? (
          <DataTableSkeleton />
        ) : (
          <DataTable columns={plansColumns} data={plans} />
        )}
      </div>
    </div>
  ) : (
    <VerifiedChannelAlert />
  )
}
