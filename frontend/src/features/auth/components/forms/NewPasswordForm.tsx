'use client'

import {
  Button,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
  Spinner,
} from '@/components/ui/common'
import { useSetNewPasswordMutation } from '@/graphql/generated'
import { zodResolver } from '@hookform/resolvers/zod'
import { XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { type NewPasswordInput, newPasswordSchema } from '../../schemas'
import { AuthWrapper } from '../AuthWrapper'

export function NewPasswordForm() {
  const t = useTranslations('auth.newPassword')
  const [isShowTwoFactor, setIsShowTwoFactor] = useState(false)
  const router = useRouter()
  const { token } = useParams<{ token: string }>()

  const {
    formState: { isValid },
    control,
    handleSubmit,
  } = useForm<NewPasswordInput>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: '', passwordConfirm: '' },
    mode: 'onChange',
  })

  const [setNewPassword, { loading: isLoading }] = useSetNewPasswordMutation({
    onCompleted(data) {
      toast.success(t('successMessage'), {
        description: t('successDescription'),
        cancel: { label: <XIcon />, onClick() {} },
      })
      router.push('/account/login')
    },
    onError({ message }) {
      toast.error(t('errorMessage'), {
        description: message,
        cancel: { label: <XIcon />, onClick() {} },
      })
    },
  })

  function onSubmit(data: NewPasswordInput) {
    setNewPassword({ variables: { data: { ...data, token } } })
  }

  return (
    <AuthWrapper
      heading={t('heading')}
      backButtonLabel={t('backButtonLabel')}
      backButtonHref='/account/login'
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name='password'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid && fieldState.isTouched}>
                <FieldLabel htmlFor='password'>{t('passwordLabel')}</FieldLabel>
                <Input
                  {...field}
                  id='password'
                  type='password'
                  aria-invalid={fieldState.invalid && fieldState.isTouched}
                  placeholder='********'
                  autoComplete='new-password'
                  disabled={isLoading}
                />
                {/* {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )} */}
              </Field>
            )}
          />
          <Controller
            name='passwordConfirm'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid && fieldState.isTouched}>
                <FieldLabel htmlFor='passwordConfirm'>
                  {t('passwordConfirmLabel')}
                </FieldLabel>
                <Input
                  {...field}
                  id='passwordConfirm'
                  type='password'
                  aria-invalid={fieldState.invalid && fieldState.isTouched}
                  placeholder='********'
                  autoComplete='new-password'
                  disabled={isLoading}
                />
                {/* {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )} */}
              </Field>
            )}
          />
          <Button type='submit' disabled={!isValid || isLoading}>
            {isLoading ? <Spinner /> : t('submitButton')}
          </Button>
        </FieldGroup>
      </form>
    </AuthWrapper>
  )
}
