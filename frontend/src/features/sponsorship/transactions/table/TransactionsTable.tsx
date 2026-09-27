'use client'

import {
  DataTable,
  DataTableSkeleton,
  Heading,
  type DataTableColumn,
} from '@/components/ui/elements'
import {
  type GetMyTransactionsQuery,
  TransactionStatus,
  useGetMyTransactionsQuery,
} from '@/graphql/generated'
import { useFormatDate } from '@/hooks'
import { convertPrice } from '@/shared/utils'
import { useTranslations } from 'next-intl'

export default function TransactionsTable() {
  const t = useTranslations('dashboard.transactions')
  const formatDate = useFormatDate()
  const { data, loading: isLoadingTransactions } = useGetMyTransactionsQuery()
  const transactions = data?.getMyTransactions ?? []

  const transactionColumns: DataTableColumn<
    GetMyTransactionsQuery['getMyTransactions'][0]
  >[] = [
    {
      accessorKey: 'amount',
      header: t('columns.amount'),
      cell: ({ row }) => convertPrice(row.original.amount),
    },
    {
      accessorKey: 'status',
      header: t('columns.status'),
      cell: ({ row }) => {
        const status = row.original.status
        let statusColor = ''

        switch (status) {
          case TransactionStatus.Success:
            statusColor = 'text-green-500'
            return <div className={`py-1.5 ${statusColor}`}>{status}</div>
          case TransactionStatus.Pending:
            statusColor = 'text-yellow-500'
            return <div className={`py-1.5 ${statusColor}`}>{status}</div>
          case TransactionStatus.Failed:
            statusColor = 'text-red-500'
            return <div className={`py-1.5 ${statusColor}`}>{status}</div>
          case TransactionStatus.Expired:
            statusColor = 'text-purple-500'
            return <div className={`py-1.5 ${statusColor}`}>{status}</div>
          default:
            statusColor = 'text-foreground'
            return <div className={`py-1.5 ${statusColor}`}>{status}</div>
        }
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('columns.date'),
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
  ]

  return (
    <div className='lg:px-10'>
      <Heading
        title={t('header.heading')}
        description={t('header.description')}
      />
      <div className='mt-5'>
        {isLoadingTransactions ? (
          <DataTableSkeleton />
        ) : (
          <DataTable columns={transactionColumns} data={transactions} />
        )}
      </div>
    </div>
  )
}
