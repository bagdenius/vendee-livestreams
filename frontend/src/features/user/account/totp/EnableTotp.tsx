'use client'

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Spinner,
} from '@/components/ui/common'
import {
  useEnableTotpMutation,
  useGenerateTotpSecretQuery,
} from '@/graphql/generated'
import { useCurrentUser } from '@/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'
import {
  enableTotpSchema,
  EnableTotpSchema,
} from '../schemas/enable-totp.schema'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { toast } from 'sonner'
import { useState } from 'react'

export function EnableTotp() {
  const t = useTranslations('dashboard.settings.account.twofactor.enable')

  const [isOpen, setIsOpen] = useState(false)

  const { refetch } = useCurrentUser()

  const { data, loading: isGenerating } = useGenerateTotpSecretQuery()
  const twoFactorAuth = data?.generateTotpSecret

  const [enableTotp, { loading: isEnablingTotp }] = useEnableTotpMutation({
    onCompleted() {
      refetch()
      setIsOpen(false)
      toast.success(t('successMessage'))
    },
    onError() {
      toast.error(t('errorMessage'))
    },
  })

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<EnableTotpSchema>({
    resolver: zodResolver(enableTotpSchema),
    defaultValues: { pin: '' },
  })

  function onSubmit({ pin }: EnableTotpSchema) {
    enableTotp({
      variables: {
        data: {
          pin,
          secret: twoFactorAuth?.secret ?? '',
        },
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button>{t('trigger')}</Button>} />
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('heading')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <FieldGroup>
            <div className='flex flex-col items-center justify-center gap-4'>
              <span className='text-muted-foreground text-sm'>
                {twoFactorAuth?.qrCodeUrl && t('qrInstructions')}
              </span>
              <img
                src={twoFactorAuth?.qrCodeUrl}
                alt='TOTP QR code'
                className='rounded-lg'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <span className='text-muted-foreground text-center text-sm'>
                {twoFactorAuth?.secret &&
                  `${t('secretCodeLabel')}${twoFactorAuth.secret}`}
              </span>
            </div>
            <Controller
              name='pin'
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid && fieldState.isTouched}
                  className='flex flex-col justify-center max-sm:items-center'
                >
                  <FieldLabel htmlFor='pin'>{t('pinLabel')}</FieldLabel>
                  <InputOTP
                    {...field}
                    maxLength={6}
                    id='pin'
                    aria-invalid={fieldState.invalid && fieldState.isTouched}
                    disabled={isGenerating || isEnablingTotp}
                    pattern={REGEXP_ONLY_DIGITS}
                  >
                    <InputOTPGroup
                      // className='*:data-[slot=input-otp-slot]:mr-2 *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-15.5 *:data-[slot=input-otp-slot]:text-xl'
                      className='w-full justify-center *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-1/6 *:data-[slot=input-otp-slot]:text-lg'
                    >
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
            <DialogFooter>
              <Button
                type='submit'
                disabled={!isValid || isGenerating || isEnablingTotp}
              >
                {isGenerating ? <Spinner /> : t('submitButton')}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
