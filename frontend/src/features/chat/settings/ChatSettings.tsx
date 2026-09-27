'use client'

import { useCurrentUser } from '@/hooks'
import { useTranslations } from 'next-intl'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  type ChangeChatSettingsInput,
  changeChatSettingsSchema,
} from './schema/change-chat-settings.schema'
import { Controller, useForm } from 'react-hook-form'
import { useChangeChatSettingsMutation } from '@/graphql/generated'
import ToggleCard, {
  ToggleCardSkeleton,
} from '@/components/ui/elements/ToggleCard'
import { Field, FieldGroup } from '@/components/ui/common'
import { Heading } from '@/components/ui/elements'

export function ChatSettings() {
  const t = useTranslations('dashboard.chat')
  const { user, isLoadingUser, refetch } = useCurrentUser()

  const { getValues, setValue, control, handleSubmit } =
    useForm<ChangeChatSettingsInput>({
      resolver: zodResolver(changeChatSettingsSchema),
      values: {
        isChatEnabled: user?.stream.isChatEnabled ?? false,
        isChatFollowersOnly: user?.stream.isChatFollowersOnly ?? false,
        isChatSponsorsOnly: user?.stream.isChatSponsorsOnly ?? false,
      },
    })

  const [update, { loading: isChanging }] = useChangeChatSettingsMutation({
    onCompleted(data) {
      refetch()
      toast.success(t('successMessage'))
    },
    onError() {
      toast.error(t('errorMessage'))
    },
  })

  function onChange(field: keyof ChangeChatSettingsInput, value: boolean) {
    setValue(field, value)
    update({
      variables: {
        data: { ...getValues(), [field]: value },
      },
    })
  }

  return (
    <div className='lg:px-10'>
      <Heading
        title={t('header.heading')}
        description={t('header.description')}
        size='lg'
      />
      <div className='mt-5 space-y-6'>
        {isLoadingUser ? (
          Array.from({ length: 3 }).map((_, index) => (
            <ToggleCardSkeleton key={index} />
          ))
        ) : (
          <form className='grid gap-y-3'>
            <FieldGroup>
              <Controller
                name='isChatEnabled'
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid && fieldState.isTouched}
                  >
                    <ToggleCard
                      heading={t('isChatEnabled.heading')}
                      description={t('isChatEnabled.description')}
                      isDisabled={isChanging}
                      value={field.value}
                      onChange={(value) => onChange('isChatEnabled', value)}
                    />
                  </Field>
                )}
              />
              <Controller
                name='isChatFollowersOnly'
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid && fieldState.isTouched}
                  >
                    <ToggleCard
                      heading={t('isChatFollowersOnly.heading')}
                      description={t('isChatFollowersOnly.description')}
                      isDisabled={isChanging}
                      value={field.value}
                      onChange={(value) =>
                        onChange('isChatFollowersOnly', value)
                      }
                    />
                  </Field>
                )}
              />
              <Controller
                name='isChatSponsorsOnly'
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid && fieldState.isTouched}
                  >
                    <ToggleCard
                      heading={t('isChatSponsorsOnly.heading')}
                      description={t('isChatSponsorsOnly.description')}
                      isDisabled={isChanging}
                      value={field.value}
                      onChange={(value) =>
                        onChange('isChatSponsorsOnly', value)
                      }
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        )}
      </div>
    </div>
  )
}
