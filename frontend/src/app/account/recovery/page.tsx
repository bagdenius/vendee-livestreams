import { ResetPasswordForm } from '@/features/auth/components/forms'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.resetPassword')
  return { title: t('heading') }
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
