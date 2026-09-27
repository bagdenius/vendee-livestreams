import { Input } from '@/components/ui/common'
import { CardContainer, CopyButton } from '@/components/ui/elements'
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
