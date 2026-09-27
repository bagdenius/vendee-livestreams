'use client'

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Textarea,
} from '@/components/ui/common'
import {
  useCreateSponsorshipPlanMutation,
  useGetMySponsorshipPlansQuery,
} from '@/graphql/generated'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  type CreatePlanInput,
  createPlanSchema,
} from '../schemas/create-plan.schema'

export function CreatePlanForm() {
  const t = useTranslations('dashboard.plans.createForm')
  const [isOpen, setIsOpen] = useState(false)
  const { refetch } = useGetMySponsorshipPlansQuery()
  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid },
  } = useForm<CreatePlanInput>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const [create, { loading: isCreating }] = useCreateSponsorshipPlanMutation({
    onCompleted() {
      setIsOpen(false)
      reset()
      refetch()
      toast.success(t('successMessage'))
    },
    onError() {
      toast.error(t('errorMessage'))
    },
  })

  function onSubmit(data: CreatePlanInput) {
    create({ variables: { data } })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button>{t('trigger')}</Button>} />
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t('heading')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <FieldGroup>
            <Controller
              name='title'
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid && fieldState.isTouched}
                >
                  <FieldLabel htmlFor='title'>{t('titleLabel')}</FieldLabel>
                  <Input
                    {...field}
                    id='title'
                    type='text'
                    placeholder={t('titlePlaceholder')}
                    aria-invalid={fieldState.invalid && fieldState.isTouched}
                    autoComplete='title'
                    disabled={isCreating}
                  />
                  <FieldDescription>{t('titleDescription')}</FieldDescription>
                  {/* {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                    )} */}
                </Field>
              )}
            />
            <Controller
              name='description'
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid && fieldState.isTouched}
                >
                  <FieldLabel htmlFor='description'>
                    {t('descriptionLabel')}
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id='description'
                    placeholder={t('descriptionPlaceholder')}
                    aria-invalid={fieldState.invalid && fieldState.isTouched}
                    autoComplete='description'
                    disabled={isCreating}
                  />
                  <FieldDescription>
                    {t('descriptionDescription')}
                  </FieldDescription>
                  {/* {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                    )} */}
                </Field>
              )}
            />
            <Controller
              name='price'
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid && fieldState.isTouched}
                >
                  <FieldLabel htmlFor='price'>{t('priceLabel')}</FieldLabel>
                  <Input
                    {...field}
                    value={Number.isFinite(field.value) ? field.value : ''}
                    onChange={(event) =>
                      field.onChange(event.target.valueAsNumber)
                    }
                    id='price'
                    type='number'
                    placeholder={t('pricePlaceholder')}
                    aria-invalid={fieldState.invalid && fieldState.isTouched}
                    autoComplete='price'
                    disabled={isCreating}
                  />
                  <FieldDescription>{t('priceDescription')}</FieldDescription>
                  {/* {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                    )} */}
                </Field>
              )}
            />
          </FieldGroup>
          <div className='flex justify-end'>
            <Button type='submit' disabled={!isValid || isCreating}>
              {t('submitButton')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
