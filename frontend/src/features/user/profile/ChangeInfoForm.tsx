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
import { useChangeProfileInfoMutation } from '@/graphql/generated'
import { useCurrentUser } from '@/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'
import {
  changeProfileInfoSchema,
  ChangeProfileInfoSchema,
} from './schemas/change-profile-info.schema'
import { toast } from 'sonner'

export function ChangeInfoForm() {
  const t = useTranslations('dashboard.settings.profile.info')

  const { user, isLoadingUser, refetch } = useCurrentUser()

  const {
    handleSubmit,
    control,
    formState: { isValid, isDirty },
  } = useForm<ChangeProfileInfoSchema>({
    resolver: zodResolver(changeProfileInfoSchema),
    values: {
      username: user?.username ?? '',
      displayName: user?.displayName ?? '',
      bio: user?.bio ?? '',
    },
  })

  const [changeProfile, { loading: isChangingProfile }] =
    useChangeProfileInfoMutation({
      onCompleted() {
        refetch()
        toast.success(t('successMessage'))
      },
      onError() {
        toast.error(t('errorMessage'))
      },
    })

  function onSubmit(data: ChangeProfileInfoSchema) {
    changeProfile({ variables: { data } })
  }

  return isLoadingUser ? (
    <ChangeInfoFormSkeleton />
  ) : (
    <FormWrapper heading={t('heading')}>
      <form onSubmit={handleSubmit(onSubmit)} className='grid gap-y-3'>
        <FieldGroup>
          <Controller
            name='username'
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid && fieldState.isTouched}
                className='px-5'
              >
                <FieldLabel htmlFor='username'>{t('usernameLabel')}</FieldLabel>
                <Input
                  {...field}
                  id='username'
                  type='text'
                  aria-invalid={fieldState.invalid && fieldState.isTouched}
                  placeholder={t('usernamePlaceholder')}
                  autoComplete='username'
                  disabled={isChangingProfile}
                />
                <FieldDescription>{t('usernameDescription')}</FieldDescription>
                {/* {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )} */}
              </Field>
            )}
          />
          <Separator />
          <Controller
            name='displayName'
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid && fieldState.isTouched}
                className='px-5'
              >
                <FieldLabel htmlFor='displayName'>
                  {t('displayNameLabel')}
                </FieldLabel>
                <Input
                  {...field}
                  id='displayName'
                  type='text'
                  aria-invalid={fieldState.invalid && fieldState.isTouched}
                  placeholder={t('displayNamePlaceholder')}
                  autoComplete='displayName'
                  disabled={isChangingProfile}
                />
                <FieldDescription>
                  {t('displayNameDescription')}
                </FieldDescription>
                {/* {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )} */}
              </Field>
            )}
          />
          <Separator />
          <Controller
            name='bio'
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid && fieldState.isTouched}
                className='px-5'
              >
                <FieldLabel htmlFor='bio'>{t('bioLabel')}</FieldLabel>
                <Textarea
                  {...field}
                  id='bio'
                  aria-invalid={fieldState.invalid && fieldState.isTouched}
                  placeholder={t('bioPlaceholder')}
                  autoComplete='bio'
                  disabled={isChangingProfile}
                />
                <FieldDescription>{t('bioDescription')}</FieldDescription>
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
              disabled={!isValid || !isDirty || isChangingProfile}
            >
              {isChangingProfile ? <Spinner /> : t('submitButton')}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </FormWrapper>
  )
}

export function ChangeInfoFormSkeleton() {
  return <Skeleton className='h-140 w-full' />
}
