'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'
import {
  changeLanguageSchema,
  ChangeLanguageInput,
} from './schemas/change-language.schema'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CardContainer } from '@/components/ui/elements/CardContainer'
import {
  Field,
  FieldGroup,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/common'
import { setLanguage } from '@/libs/i18n/language'
import { toast } from 'sonner'

const languages = {
  uk: 'Українська',
  en: 'English',
}

export default function ChangeLanguageForm() {
  const t = useTranslations('dashboard.settings.appearance.language')
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()
  const { setValue, control, handleSubmit } = useForm<ChangeLanguageInput>({
    resolver: zodResolver(changeLanguageSchema),
    values: {
      language:
        (locale as ChangeLanguageInput['language']) === 'en' ? 'en' : 'uk',
    },
  })

  function onSubmit(data: ChangeLanguageInput) {
    startTransition(async () => {
      await setLanguage(data.language)
      toast.success(t('successMessage'))
    })
  }

  return (
    <CardContainer
      heading={t('heading')}
      description={t('description')}
      rightContent={
        <Controller
          name='language'
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid && fieldState.isTouched}>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value)
                  handleSubmit(onSubmit)()
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    className='w-30'
                    placeholder={t('selectPlaceholder')}
                  >
                    {languages[field.value]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languages).map(([code, name]) => (
                    <SelectItem key={code} value={code} disabled={isPending}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
      }
    />
  )
}
