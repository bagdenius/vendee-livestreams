import { PlansTable } from '@/features/sponsorship/plan/table/PlansTable'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('dashboard.plans.header')
  return {
    title: t('heading'),
    description: t('description'),
    robots: { index: false, follow: false },
  }
}

export default function PlansPage() {
  return <PlansTable />
}
