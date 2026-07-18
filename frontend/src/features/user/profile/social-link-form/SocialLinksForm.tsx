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
import {
  useCreateSocialLinkMutation,
  useGetSocialLinksQuery,
} from '@/graphql/generated'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  socialLinkSchema,
  SocialLinkSchema,
} from '../schemas/social-link.schema'
import { SocialLinksList } from './SocialLinksList'

export function SocialLinksForm() {
  const t = useTranslations('dashboard.settings.profile.socialLinks.addForm')

  const { loading: isLoadingLinks, refetch } = useGetSocialLinksQuery()

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid },
  } = useForm<SocialLinkSchema>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      title: '',
      url: '',
    },
  })

  const [addLink, { loading: isAdding }] = useCreateSocialLinkMutation({
    onCompleted() {
      reset()
      refetch()
      toast.success(t('successMessage'))
    },
    onError() {
      toast.error(t('errorMessage'))
    },
  })

  function onSubmit(data: SocialLinkSchema) {
    addLink({ variables: { data } })
  }

  return isLoadingLinks ? (
    <SocialLinksFormSkeleton />
  ) : (
    <FormWrapper heading={t('heading')}>
      <form onSubmit={handleSubmit(onSubmit)} className='grid gap-y-3'>
        <FieldGroup>
          <Controller
            name='title'
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid && fieldState.isTouched}
                className='px-5'
              >
                <FieldLabel htmlFor='title'>{t('titleLabel')}</FieldLabel>
                <Input
                  {...field}
                  id='title'
                  type='text'
                  aria-invalid={fieldState.invalid && fieldState.isTouched}
                  placeholder={t('titlePlaceholder')}
                  disabled={isAdding}
                />
                <FieldDescription>{t('titleDescription')}</FieldDescription>
                {/* {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )} */}
              </Field>
            )}
          />
          <Separator />
          <Controller
            name='url'
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid && fieldState.isTouched}
                className='px-5'
              >
                <FieldLabel htmlFor='url'>{t('urlLabel')}</FieldLabel>
                <Input
                  {...field}
                  id='url'
                  type='text'
                  aria-invalid={fieldState.invalid && fieldState.isTouched}
                  placeholder={t('urlPlaceholder')}
                  autoComplete='url'
                  disabled={isAdding}
                />
                <FieldDescription>{t('urlDescription')}</FieldDescription>
                {/* {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )} */}
              </Field>
            )}
          />
          <Separator />
          <div className='flex justify-end px-5'>
            <Button type='submit' disabled={!isValid || isAdding}>
              {isAdding ? <Spinner /> : t('submitButton')}
            </Button>
          </div>
        </FieldGroup>
      </form>
      <SocialLinksList />
    </FormWrapper>
  )
}

export function SocialLinksFormSkeleton() {
  return <Skeleton className='h-100 w-full' />
}
