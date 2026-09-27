'use client'

import { useCurrentUser } from '@/hooks'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'
import {
  changeNotificationSettingsSchema,
  type ChangeNotificationSettingsInput,
} from './schemas/change-notifications-settings.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ToggleCard, ToggleCardSkeleton } from '@/components/ui/elements'
import { Field, FieldGroup } from '@/components/ui/common'
import { useChangeNotificationSettingsMutation } from '@/graphql/generated'
import { toast } from 'sonner'

export function ChangeNotificationsSettingsForm() {
  const t = useTranslations('dashboard.settings.notifications')
  const { user, isLoadingUser, refetch } = useCurrentUser()

  const { getValues, setValue, control, handleSubmit } =
    useForm<ChangeNotificationSettingsInput>({
      resolver: zodResolver(changeNotificationSettingsSchema),
      values: {
        siteNotifications:
          user?.notificationSettings.siteNotifications ?? false,
        telegramNotifications:
          user?.notificationSettings.telegramNotifications ?? false,
      },
    })

  const [update, { loading: isUpdating }] =
    useChangeNotificationSettingsMutation({
      onCompleted(data) {
        refetch()
        toast.success(t('successMessage'))
        if (data.changeNotificationsSettings.telegramAuthToken) {
          window.open(
            `https://t.me/vendee_livestream_bot?start=${data.changeNotificationsSettings.telegramAuthToken}`,
            '_blank',
          )
        }
      },
      onError() {
        toast.error(t('errorMessage'))
      },
    })

  function onChange(
    field: keyof ChangeNotificationSettingsInput,
    value: boolean,
  ) {
    setValue(field, value)
    update({
      variables: {
        data: { ...getValues(), [field]: value },
      },
    })
  }

  return isLoadingUser ? (
    Array.from({ length: 2 }).map((_, index) => (
      <ToggleCardSkeleton key={index} />
    ))
  ) : (
    <form className='grid gap-y-3'>
      <FieldGroup>
        <Controller
          name='siteNotifications'
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid && fieldState.isTouched}>
              <ToggleCard
                heading={t('siteNotifications.heading')}
                description={t('siteNotifications.description')}
                isDisabled={isUpdating}
                value={field.value}
                onChange={(value) => onChange('siteNotifications', value)}
              />
            </Field>
          )}
        />
        <Controller
          name='telegramNotifications'
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid && fieldState.isTouched}>
              <ToggleCard
                heading={t('telegramNotifications.heading')}
                description={t('telegramNotifications.description')}
                isDisabled={isUpdating}
                value={field.value}
                onChange={(value) => onChange('telegramNotifications', value)}
              />
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )
}
