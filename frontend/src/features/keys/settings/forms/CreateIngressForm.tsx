'use client'

import { useCurrentUser } from '@/hooks'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'
import {
  type createIngressInput,
  createIngressSchema,
  IngressType,
} from '../schemas/create-ingress.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateIngressMutation } from '@/graphql/generated'
import { toast } from 'sonner'
import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldDescription,
  FieldLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/common'

export function CreateIngressForm() {
  const t = useTranslations('dashboard.keys.createModal')

  const [isOpen, setIsOpen] = useState(false)

  const { refetch } = useCurrentUser()

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<createIngressInput>({
    resolver: zodResolver(createIngressSchema),
    defaultValues: { ingressType: IngressType.RTMP },
  })

  const [create, { loading: isCreating }] = useCreateIngressMutation({
    onCompleted() {
      setIsOpen(false)
      refetch()
      toast.success(t('successMessage'))
    },
    onError() {
      toast.error(t('errorMessage'))
    },
  })

  function onSubmit(data: createIngressInput) {
    create({ variables: { ingressType: data.ingressType } })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button>{t('trigger')}</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('heading')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <Controller
            name='ingressType'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid && fieldState.isTouched}>
                <FieldLabel>{t('ingressTypeLabel')}</FieldLabel>
                <FieldDescription>
                  {t('ingressTypeDescription')}
                </FieldDescription>
                <Select
                  value={field.value.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue
                      className='w-30'
                      placeholder={t('ingressTypePlaceholder')}
                    >
                      {IngressType[field.value]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value={IngressType.RTMP.toString()}
                      disabled={isCreating}
                    >
                      RTMP
                    </SelectItem>
                    <SelectItem
                      value={IngressType.WHIP.toString()}
                      disabled={isCreating}
                    >
                      WHIP
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
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
