'use client'

import { Button, FieldGroup, Input, Skeleton } from '@/components/ui/common'
import { ChannelAvatar } from '@/components/ui/elements'
import { ConfirmModal } from '@/components/ui/elements/ConfirmModal'
import { FormWrapper } from '@/components/ui/elements/FormWrapper'
import {
  useChangeProfileAvatarMutation,
  useRemoveProfileAvatarMutation,
} from '@/graphql/generated'
import { useCurrentUser } from '@/hooks'
import {
  UploadFileInput,
  uploadFileSchema,
} from '@/shared/schemas/upload-file.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { TrashIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ChangeEvent, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function ChangeAvatarForm() {
  const t = useTranslations('dashboard.settings.profile.avatar')

  const { user, isLoadingUser, refetch } = useCurrentUser()

  const [updateAvatar, { loading: isUpdatingAvatar }] =
    useChangeProfileAvatarMutation({
      onCompleted() {
        refetch()
        toast.success(t('successUpdateMessage'))
      },
      onError() {
        toast.error(t('errorUpdateMessage'))
      },
    })

  const [removeAvatar, { loading: isRemovingAvatar }] =
    useRemoveProfileAvatarMutation({
      onCompleted() {
        refetch()
        toast.success(t('successRemoveMessage'))
      },
      onError() {
        toast.error(t('errorRemoveMessage'))
      },
    })

  const inputRef = useRef<HTMLInputElement>(null)

  const form = useForm<UploadFileInput>({
    resolver: zodResolver(uploadFileSchema),
    values: { file: user?.avatar! },
  })

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    console.log(file)

    if (file) {
      form.setValue('file', file)
      updateAvatar({ variables: { avatar: file } })
    }
  }

  return isLoadingUser || !user ? (
    <ChangeAvatarFormSkeleton />
  ) : (
    <FormWrapper heading={t('heading')}>
      <form>
        <FieldGroup>
          <Controller
            name='file'
            control={form.control}
            render={({ field }) => (
              <div className='px-5 pb-5'>
                <div className='w-full items-center space-x-6 lg:flex'>
                  <ChannelAvatar
                    size='xl'
                    channel={{
                      username: user.username,
                      avatar:
                        field.value instanceof File
                          ? URL.createObjectURL(field.value)
                          : (field.value ?? null),
                    }}
                  />
                  <div className='space-y-3'>
                    <div className='flex items-center gap-x-3'>
                      <Input
                        className='hidden'
                        type='file'
                        ref={inputRef}
                        onChange={handleImageChange}
                      />
                      <Button
                        variant='secondary'
                        onClick={() => inputRef.current?.click()}
                        disabled={isUpdatingAvatar || isRemovingAvatar}
                      >
                        {t('updateButton')}
                      </Button>
                      {user.avatar && (
                        <ConfirmModal
                          heading={t('confirmModal.heading')}
                          message={t('confirmModal.message')}
                          onConfirm={() => removeAvatar()}
                        >
                          <Button
                            variant='ghost'
                            size='icon-lg'
                            disabled={isUpdatingAvatar || isRemovingAvatar}
                          >
                            <TrashIcon />
                          </Button>
                        </ConfirmModal>
                      )}
                    </div>
                    <p className='text-muted-foreground text-sm'>{t('info')}</p>
                  </div>
                </div>
              </div>
            )}
          />
        </FieldGroup>
      </form>
    </FormWrapper>
  )
}

export function ChangeAvatarFormSkeleton() {
  return <Skeleton className='h-52 w-full' />
}
