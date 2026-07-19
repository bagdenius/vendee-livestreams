'use client'

import {
  Button,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Separator,
  Skeleton,
  Spinner,
} from '@/components/ui/common'
import { FormWrapper } from '@/components/ui/elements/FormWrapper'
import { useChangePasswordMutation } from '@/graphql/generated'
import { useCurrentUser } from '@/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  changePasswordSchema,
  ChangePasswordSchema,
} from './schemas/change-password.schema'

export function ChangePasswordForm() {
  const t = useTranslations('dashboard.settings.account.password')

  const { isLoadingUser, refetch } = useCurrentUser()

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid, isDirty },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: '', newPassword: '' },
  })

  const [changePassword, { loading: isChangingPassword }] =
    useChangePasswordMutation({
      onCompleted() {
        refetch()
        reset()
        toast.success(t('successMessage'))
      },
      onError() {
        toast.error(t('errorMessage'))
      },
    })

  function onSubmit(data: ChangePasswordSchema) {
    changePassword({ variables: { data } })
  }

  return isLoadingUser ? (
    <ChangePasswordFormSkeleton />
  ) : (
    <FormWrapper heading={t('heading')}>
      <form onSubmit={handleSubmit(onSubmit)} className='grid gap-y-3'>
        <FieldGroup>
          <Controller
            name='oldPassword'
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid && fieldState.isTouched}
                className='px-5'
              >
                <FieldLabel htmlFor='current-password'>
                  {t('currentPasswordLabel')}
                </FieldLabel>
                <Input
                  {...field}
                  id='current-password'
                  type='password'
                  aria-invalid={fieldState.invalid && fieldState.isTouched}
                  autoComplete='current-password'
                  disabled={isChangingPassword}
                />
                <FieldDescription>
                  {t('currentPasswordDescription')}
                </FieldDescription>
                {/* {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )} */}
              </Field>
            )}
          />
          <Separator />
          <Controller
            name='newPassword'
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid && fieldState.isTouched}
                className='px-5'
              >
                <FieldLabel htmlFor='new-password'>
                  {t('newPasswordLabel')}
                </FieldLabel>
                <Input
                  {...field}
                  id='new-password'
                  type='password'
                  aria-invalid={fieldState.invalid && fieldState.isTouched}
                  autoComplete='new-password'
                  disabled={isChangingPassword}
                />
                <FieldDescription>
                  {t('newPasswordDescription')}
                </FieldDescription>
                {/* {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )} */}
              </Field>
            )}
          />
          <Separator />
          <div className='flex justify-end px-5'>
            <Button
              type='submit'
              disabled={!isValid || !isDirty || isChangingPassword}
            >
              {isChangingPassword ? <Spinner /> : t('submitButton')}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </FormWrapper>
  )
}

export function ChangePasswordFormSkeleton() {
  return <Skeleton className='h-96 w-full' />
}
