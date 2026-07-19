'use client'

import { useAuth } from '@/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

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

import { useDeactivateAccountMutation } from '@/graphql/generated'

import { type DeactivationInput, deactivationSchema } from '../../schemas'
import { AuthWrapper } from '../AuthWrapper'

export function DeactivationForm() {
  const t = useTranslations('auth.deactivation')
  const [isShowConfirmation, setIsShowConfirmation] = useState(false)
  const router = useRouter()
  const { exit } = useAuth()

  const {
    formState: { isValid },
    control,
    handleSubmit,
  } = useForm<DeactivationInput>({
    resolver: zodResolver(deactivationSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  })

  const [deactivate, { loading: isDeactivating }] =
    useDeactivateAccountMutation({
      onCompleted(data) {
        if (data.deactivateAccount.message) {
          setIsShowConfirmation(true)
        } else {
          exit()
          toast.success(t('successMessage'))
          router.push('/')
        }
      },
      onError() {
        toast.error(t('errorMessage'))
      },
    })

  function onSubmit(data: DeactivationInput) {
    deactivate({ variables: { data } })
  }

  return (
    <AuthWrapper
      heading={t('heading')}
      backButtonLabel={t('backButtonLabel')}
      backButtonHref='/auth/signup'
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          {isShowConfirmation ? (
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
                    disabled={isDeactivating}
                  >
                    <InputOTPGroup className='w-full *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:text-2xl'>
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
                name='email'
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid && fieldState.isTouched}
                  >
                    <FieldLabel htmlFor='email'>{t('emailLabel')}</FieldLabel>
                    <Input
                      {...field}
                      id='email'
                      type='text'
                      aria-invalid={fieldState.invalid && fieldState.isTouched}
                      placeholder='johndoe'
                      disabled={isDeactivating}
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
                    </FieldLabel>
                    <Input
                      {...field}
                      id='password'
                      type='password'
                      aria-invalid={fieldState.invalid && fieldState.isTouched}
                      placeholder='********'
                      disabled={isDeactivating}
                    />
                    {/* {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )} */}
                  </Field>
                )}
              />
            </>
          )}
          <Button type='submit' disabled={!isValid || isDeactivating}>
            {isDeactivating ? <Spinner /> : t('submitButton')}
          </Button>
        </FieldGroup>
      </form>
    </AuthWrapper>
  )
}
