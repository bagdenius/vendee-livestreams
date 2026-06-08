'use client'

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Spinner,
} from '@/components/ui/common'
import { useResetPasswordMutation } from '@/graphql/generated'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleCheckIcon, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { type ResetPasswordInput, resetPasswordSchema } from '../../schemas'
import { AuthWrapper } from '../AuthWrapper'

export function ResetPasswordForm() {
  const t = useTranslations('auth.resetPassword')

  const [isSuccess, setIsSuccess] = useState(false)

  const {
    formState: { isValid },
    control,
    handleSubmit,
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onChange',
  })

  const [resetPassword, { loading: isLoading }] = useResetPasswordMutation({
    onCompleted() {
      setIsSuccess(true)
    },
    onError({ message }) {
      toast.error(t('errorMessage'), {
        description: message,
        cancel: { label: <XIcon />, onClick() {} },
      })
    },
  })

  function onSubmit(data: ResetPasswordInput) {
    resetPassword({ variables: { data } })
  }

  return (
    <AuthWrapper
      heading={t('heading')}
      backButtonLabel={t('backButtonLabel')}
      backButtonHref='/auth/login'
    >
      {isSuccess ? (
        <Alert>
          <CircleCheckIcon className='size-4' />
          <AlertTitle>{t('successAlertTitle')}</AlertTitle>
          <AlertDescription>{t('successAlertDescription')}</AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name='email'
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid && fieldState.isTouched}
                >
                  <FieldLabel htmlFor='email'> {t('emailLabel')}</FieldLabel>
                  <Input
                    {...field}
                    id='email'
                    type='email'
                    aria-invalid={fieldState.invalid && fieldState.isTouched}
                    placeholder='johndoe@example.com'
                    autoComplete='email'
                    disabled={isLoading}
                  />
                  <FieldDescription>{t('emailDescription')}</FieldDescription>
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
      )}
    </AuthWrapper>
  )
}
