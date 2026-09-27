'use client'

import { Field, FieldGroup } from '@/components/ui/common'
import ToggleCard from '@/components/ui/elements/ToggleCard'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  changeThemeSchema,
  ChangeThemeInput,
} from './schemas/change-theme.schema'

export default function ChangeThemeForm() {
  const t = useTranslations('dashboard.settings.appearance.theme')
  const { theme, setTheme } = useTheme()
  const { setValue, control } = useForm<ChangeThemeInput>({
    resolver: zodResolver(changeThemeSchema),
    values: {
      theme: theme === 'dark' ? 'dark' : 'light',
    },
  })

  function onChange(value: boolean) {
    const newTheme = value ? 'dark' : 'light'
    setTheme(newTheme)
    setValue('theme', newTheme)
    toast.success(t('successMessage'))
  }

  return (
    <form className='grid gap-y-3'>
      <FieldGroup>
        <Controller
          name='theme'
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid && fieldState.isTouched}>
              <ToggleCard
                heading={t('heading')}
                description={t('description')}
                value={field.value === 'dark'}
                onChange={onChange}
              />
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )
}
