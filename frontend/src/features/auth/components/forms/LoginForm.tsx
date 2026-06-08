'use client'

import {
  Button,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Spinner,
} from '@/components/ui/common'
import { useLoginMutation } from '@/graphql/generated'
import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { type LoginInput, loginSchema } from '../../schemas'
import { AuthWrapper } from '../AuthWrapper'
import { useAuth } from '@/hooks'

export function LoginForm() {
  const t = useTranslations('auth.login')
  const [isShowTwoFactor, setIsShowTwoFactor] = useState(false)
  const router = useRouter()
  const { auth } = useAuth()

  const {
    formState: { isValid },
    control,
    handleSubmit,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: '', password: '' },
    mode: 'onChange',
  })

  const [login, { loading: isLoading }] = useLoginMutation({
    onCompleted(data) {
      if (data.loginUser.message) {
        setIsShowTwoFactor(true)
      } else {
        auth()
        toast.success(t('successMessage'), {
          description: t('successDescription'),
          cancel: { label: <XIcon />, onClick() {} },
        })
        router.push('/dashboard/settings')
      }
    },
    onError({ message }) {
      toast.error(t('errorMessage'), {
        description: message,
        cancel: { label: <XIcon />, onClick() {} },
      })
    },
  })

  function onSubmit(data: LoginInput) {
    login({ variables: { data } })
  }

  return (
    <AuthWrapper
      heading={t('heading')}
      backButtonLabel={t('backButtonLabel')}
      backButtonHref='/auth/signup'
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          {isShowTwoFactor ? (
            <Controller
              name='pin'
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid && fieldState.isTouched}
                >
                  <FieldLabel htmlFor='pin'>{t('pinLabel')}</FieldLabel>
                  <InputOTP
                    {...field}
                    id='pin'
                    type='text'
                    className='w-full'
                    pattern={REGEXP_ONLY_DIGITS}
                    aria-invalid={fieldState.invalid && fieldState.isTouched}
                    maxLength={6}
                    autoComplete='pin'
                    disabled={isLoading}
                  >
                    <InputOTPGroup className='w-full gap-2 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:text-2xl'>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <FieldDescription>{t('pinDescription')}</FieldDescription>
                  {/* {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                    )} */}
                </Field>
              )}
            />
          ) : (
            <>
              <Controller
                name='login'
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid && fieldState.isTouched}
                  >
                    <FieldLabel htmlFor='login'>{t('loginLabel')}</FieldLabel>
                    <Input
                      {...field}
                      id='login'
                      type='text'
                      aria-invalid={fieldState.invalid && fieldState.isTouched}
                      placeholder='johndoe'
                      autoComplete='login'
                      disabled={isLoading}
                    />
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
                      {t('passwordLabel')}
                      <Link
                        href='/auth/recovery'
                        className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                      >
                        {t('forgotPassword')}
                      </Link>
                    </FieldLabel>
                    <Input
                      {...field}
                      id='password'
                      type='password'
                      aria-invalid={fieldState.invalid && fieldState.isTouched}
                      placeholder='********'
                      autoComplete='current-password'
                      disabled={isLoading}
                    />
                    {/* {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )} */}
                  </Field>
                )}
              />
            </>
          )}
          <Button type='submit' disabled={!isValid || isLoading}>
            {isLoading ? <Spinner /> : t('submitButton')}
          </Button>
        </FieldGroup>
      </form>
    </AuthWrapper>
  )
}
