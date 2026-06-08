'use client'

import { useVerifyAccountMutation } from '@/graphql/generated'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { AuthWrapper } from '../AuthWrapper'
import { Spinner } from '@/components/ui/common'

export function VerifyAccountForm() {
  const t = useTranslations('auth.verify')

  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token') ?? ''

  const [verify] = useVerifyAccountMutation({
    onCompleted() {
      toast.success(t('successMessage'), {
        cancel: { label: 'Got it!', onClick() {} },
      })
      router.push('/dashboard/settings')
    },
    onError() {
      toast.error(t('errorMessage'), {
        description: t('errorDescription'),
        cancel: { label: 'Got it!', onClick() {} },
      })
    },
  })

  useEffect(() => {
    verify({ variables: { data: { token } } })
  }, [token])

  return (
    <AuthWrapper heading={t('heading')}>
      <div className='flex justify-center'>
        <Spinner className='size-10' />
      </div>
    </AuthWrapper>
  )
}
