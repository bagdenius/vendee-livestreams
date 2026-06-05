import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/common'

export default function Home() {
  const t = useTranslations('home')

  return (
    <div>
      <div className='text-4xl font-bold'>{t('title')}</div>
      <div>
        <Button>Default</Button>
        <Button variant='destructive'>Destructive</Button>
        <Button variant='ghost'>Ghost</Button>
        <Button variant='link'>Link</Button>
        <Button variant='outline'>Outline</Button>
        <Button variant='secondary'>Secondary</Button>
      </div>
    </div>
  )
}
