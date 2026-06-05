import { VerifyAccountForm } from '@/features/auth/components/forms'
import { redirect } from 'next/navigation'

interface VerifyPageProps {
  searchParams: Promise<{ token: string }>
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { token } = await searchParams
  if (!token) return redirect('/account/create')

  return <VerifyAccountForm />
}
