import { Button, Field, FieldGroup, Input } from '@/components/ui/common'
import {
  useGetSocialLinksQuery,
  useRemoveSocialLinkMutation,
  useUpdateSocialLinkMutation,
  type GetSocialLinksQuery,
} from '@/graphql/generated'
import type { DraggableProvided } from '@hello-pangea/dnd'
import { zodResolver } from '@hookform/resolvers/zod'
import { GripVertical, PencilIcon, Trash2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  socialLinkSchema,
  type SocialLinkSchema,
} from '../schemas/social-link.schema'
import { toast } from 'sonner'

interface SocialLinkItemProps {
  socialLink: GetSocialLinksQuery['getSocialLinks'][0]
  provided: DraggableProvided
}

export function SocialLinkItem({ socialLink, provided }: SocialLinkItemProps) {
  const t = useTranslations('dashboard.settings.profile.socialLinks.editForm')

  const [editingId, setEditingId] = useState<string | null>(null)

  const { refetch } = useGetSocialLinksQuery()

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid, isDirty },
  } = useForm<SocialLinkSchema>({
    resolver: zodResolver(socialLinkSchema),
    values: {
      title: socialLink.title ?? '',
      url: socialLink.url ?? '',
    },
  })

  const [updateLink, { loading: isUpdatingLink }] = useUpdateSocialLinkMutation(
    {
      onCompleted() {
        refetch()
        toggleEditing(null)
        toast.success(t('successUpdateMessage'))
      },
      onError() {
        toast.error(t('errorUpdateMessage'))
      },
    },
  )

  const [removeLink, { loading: isRemovingLink }] = useRemoveSocialLinkMutation(
    {
      onCompleted() {
        refetch()
        toast.success(t('successRemoveMessage'))
      },
      onError() {
        toast.error(t('errorRemoveMessage'))
      },
    },
  )

  function toggleEditing(id: string | null) {
    setEditingId(id)
  }

  function onSubmit(data: SocialLinkSchema) {
    updateLink({ variables: { id: socialLink.id, data } })
  }

  return (
    <div
      className='border-border bg-background mb-4 flex items-center gap-x-2 rounded-md text-sm'
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div
        className='border-r-border text-foreground rounded-l-md border-r px-2 py-9 transition'
        {...provided.dragHandleProps}
      >
        <GripVertical className='size-5' />
      </div>
      <div className='space-y-1 px-2'>
        {editingId === socialLink.id ? (
          <form onSubmit={handleSubmit(onSubmit)} className='flex gap-x-6'>
            <FieldGroup className='w-96 gap-y-2'>
              <Controller
                name='title'
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid && fieldState.isTouched}
                  >
                    {/* <FieldLabel htmlFor='title'>{t('titleLabel')}</FieldLabel> */}
                    <Input
                      {...field}
                      id='title'
                      type='text'
                      aria-invalid={fieldState.invalid && fieldState.isTouched}
                      placeholder='GitHub'
                      disabled={isUpdatingLink || isRemovingLink}
                      className='h-8'
                    />
                    {/* {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )} */}
                  </Field>
                )}
              />
              <Controller
                name='url'
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid && fieldState.isTouched}
                  >
                    {/* <FieldLabel htmlFor='url'>{t('urlLabel')}</FieldLabel> */}
                    <Input
                      {...field}
                      id='url'
                      type='text'
                      aria-invalid={fieldState.invalid && fieldState.isTouched}
                      placeholder='https://github.com/bagdenius'
                      disabled={isUpdatingLink || isRemovingLink}
                      className='h-8'
                    />
                    {/* {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )} */}
                  </Field>
                )}
              />
            </FieldGroup>
            <div className='flex items-center gap-x-4'>
              <Button variant='secondary' onClick={() => toggleEditing(null)}>
                {t('cancelButton')}
              </Button>
              <Button
                type='submit'
                disabled={
                  !isValid || !isValid || isUpdatingLink || isRemovingLink
                }
              >
                {t('submitButton')}
              </Button>
            </div>
          </form>
        ) : (
          <>
            <h2 className='text-foreground text-[17px] font-semibold'>
              {socialLink.title}
            </h2>
            <p className='text-muted-foreground'>{socialLink.url}</p>
          </>
        )}
      </div>
      <div className='ml-auto flex items-center gap-x-2 pr-4'>
        {editingId !== socialLink.id && (
          <Button
            variant='ghost'
            size='icon-lg'
            onClick={() => toggleEditing(socialLink.id)}
          >
            <PencilIcon className='text-muted-foreground size-4' />
          </Button>
        )}
        <Button
          variant='ghost'
          size='icon-lg'
          onClick={() => removeLink({ variables: { id: socialLink.id } })}
        >
          <Trash2Icon className='text-muted-foreground size-4' />
        </Button>
      </div>
    </div>
  )
}
