import { Button, Input } from '@/components/ui/common'
import { CardContainer } from '@/components/ui/elements/CardContainer'
import CopyButton from '@/components/ui/elements/CopyButton'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface StreamKeyProps {
  value: string | null
}

export function StreamKey({ value }: StreamKeyProps) {
  const t = useTranslations('dashboard.keys.key')
  const [isShow, setIsShow] = useState(false)
  const Icon = isShow ? EyeIcon : EyeOffIcon

  return (
    <CardContainer
      heading={t('heading')}
      isFullRightContent
      rightContent={
        <div className='flex w-full items-center gap-x-4'>
          <Input
            placeholder={t('heading')}
            value={value ?? ''}
            type={isShow ? 'text' : 'password'}
            disabled
          />
          <CopyButton value={value} />
          <Button
            variant='ghost'
            size='icon-lg'
            onClick={() => setIsShow(!isShow)}
          >
            <Icon className='size-5' />
          </Button>
        </div>
      }
    />
  )
}
