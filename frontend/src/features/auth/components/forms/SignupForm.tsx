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
import { useSignupMutation } from '@/graphql/generated'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleCheckIcon, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { SignupInput, signupSchema } from '../../schemas'
import { AuthWrapper } from '../AuthWrapper'

export function SignupForm() {
  const t = useTranslations('auth.signup')

  const [isSuccess, setIsSuccess] = useState(false)

  const {
    formState: { isValid },
    control,
    handleSubmit,
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '' },
    mode: 'onChange',
  })

  const [signup, { loading: isLoading }] = useSignupMutation({
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

  function onSubmit(data: SignupInput) {
    signup({ variables: { data } })
  }

  return (
    <AuthWrapper
      heading={t('heading')}
      backButtonLabel={t('backButtonLabel')}
      backButtonHref='/account/login'
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
              name='username'
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid && fieldState.isTouched}
                >
                  <FieldLabel htmlFor='username'>
                    {t('usernameLabel')}
                  </FieldLabel>
                  <Input
                    {...field}
                    id='username'
                    type='text'
                    aria-invalid={fieldState.invalid && fieldState.isTouched}
                    placeholder='johndoe'
                    autoComplete='username'
                    disabled={isLoading}
                  />
                  <FieldDescription>
                    {t('usernameDescription')}
                  </FieldDescription>
                  {/* {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )} */}
                </Field>
              )}
            />
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
            <Controller
              name='password'
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid && fieldState.isTouched}
                >
                  <FieldLabel htmlFor='password'>
                    {' '}
                    {t('passwordLabel')}
                  </FieldLabel>
                  <Input
                    {...field}
                    id='password'
                    type='password'
                    aria-invalid={fieldState.invalid && fieldState.isTouched}
                    placeholder='********'
                    autoComplete='new-password'
                    disabled={isLoading}
                  />
                  <FieldDescription>
                    {t('passwordDescription')}
                  </FieldDescription>
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
