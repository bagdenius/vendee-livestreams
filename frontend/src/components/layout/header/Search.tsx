'use client'

import { Button, Input } from '@/components/ui/common'
import { SearchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { SubmitEvent, useState } from 'react'

export function Search() {
  const t = useTranslations('layout.search')
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (searchTerm.trim()) router.push(`/streams?searchTerm=${searchTerm}`)
    else router.push('/streams')
  }

  return (
    <div className='ml-auto hidden lg:block'>
      <form className='relative flex items-center' onSubmit={handleSubmit}>
        <Input
          placeholder={t('placeholder')}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className='w-full rounded-full pr-10 pl-4 lg:w-100'
        />
        <Button className='absolute right-0 w-12 rounded-full' type='submit'>
          <SearchIcon className='absolute size-5' />
        </Button>
      </form>
    </div>
  )
}
