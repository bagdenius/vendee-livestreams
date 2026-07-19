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
  Textarea,
} from '@/components/ui/common'
import { FormWrapper } from '@/components/ui/elements/FormWrapper'
import {
  useChangeEmailMutation,
  useChangeProfileInfoMutation,
} from '@/graphql/generated'
import { useCurrentUser } from '@/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  changeEmailSchema,
  ChangeEmailSchema,
} from './schemas/change-email.schema'

export function ChangeEmailForm() {
  const t = useTranslations('dashboard.settings.account.email')

  const { user, isLoadingUser, refetch } = useCurrentUser()

  const {
    handleSubmit,
    control,
    formState: { isValid, isDirty },
  } = useForm<ChangeEmailSchema>({
    resolver: zodResolver(changeEmailSchema),
    values: { email: user?.email ?? '' },
  })

  const [changeEmail, { loading: isChangingEmail }] = useChangeEmailMutation({
    onCompleted() {
      refetch()
      toast.success(t('successMessage'))
    },
    onError() {
      toast.error(t('errorMessage'))
    },
  })

  function onSubmit(data: ChangeEmailSchema) {
    changeEmail({ variables: { data } })
  }

  return isLoadingUser ? (
    <ChangeEmailFormSkeleton />
  ) : (
    <FormWrapper heading={t('heading')}>
      <form onSubmit={handleSubmit(onSubmit)} className='grid gap-y-3'>
        <FieldGroup>
          <Controller
            name='email'
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid && fieldState.isTouched}
                className='px-5'
              >
                <FieldLabel htmlFor='email'>{t('emailLabel')}</FieldLabel>
                <Input
                  {...field}
                  id='email'
                  type='text'
                  aria-invalid={fieldState.invalid && fieldState.isTouched}
                  autoComplete='email'
                  disabled={isChangingEmail}
                />
                <FieldDescription>{t('emailDescription')}</FieldDescription>
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
              disabled={!isValid || !isDirty || isChangingEmail}
            >
              {isChangingEmail ? <Spinner /> : t('submitButton')}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </FormWrapper>
  )
}

export function ChangeEmailFormSkeleton() {
  return <Skeleton className='h-64 w-full' />
}
