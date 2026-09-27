import { Input } from '@/components/ui/common'
import { CardContainer } from '@/components/ui/elements/CardContainer'
import CopyButton from '@/components/ui/elements/CopyButton'
import { useTranslations } from 'next-intl'

interface StreamUrlProps {
  value: string | null
}

export function StreamUrl({ value }: StreamUrlProps) {
  const t = useTranslations('dashboard.keys.url')

  return (
    <CardContainer
      heading={t('heading')}
      isFullRightContent
      rightContent={
        <div className='flex w-full items-center gap-x-4'>
          <Input placeholder={t('heading')} value={value ?? ''} disabled />
          <CopyButton value={value} />
        </div>
      }
    />
  )
}
