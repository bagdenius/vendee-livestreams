import {
  useGetSocialLinksQuery,
  useReorderSocialLinksMutation,
} from '@/graphql/generated'
import { Separator } from '@base-ui/react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from '@hello-pangea/dnd'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { SocialLinkItem } from './SocialLinkItem'
import { toast } from 'sonner'

export function SocialLinksList() {
  const t = useTranslations('dashboard.settings.profile.socialLinks')

  const { data, loading: isLoading, refetch } = useGetSocialLinksQuery()
  const items = data?.getSocialLinks ?? []

  const [socialLinks, setSocialLinks] = useState(items)

  useEffect(() => {
    setSocialLinks(items)
  }, [items])

  const [reorderLinks, { loading: isReordering }] =
    useReorderSocialLinksMutation({
      onCompleted() {
        refetch()
        toast.success(t('successReorderMessage'))
      },
      onError() {
        toast.error(t('errorReorderMessage'))
      },
    })

  function onDragEnd(result: DropResult) {
    if (!result.destination) return

    const items = Array.from(socialLinks)
    const [reorderItem] = items.splice(result.source.index, 1)

    items.splice(result.destination.index, 0, reorderItem)
    const bulkUpdateData = items.map((socialLink, index) => ({
      id: socialLink.id,
      position: index,
    }))

    setSocialLinks(items)

    reorderLinks({ variables: { list: bulkUpdateData } })
  }

  return (
    socialLinks.length && (
      <>
        <Separator />
        <div className='mt-5 px-5'>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='socialLinks'>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {socialLinks.map((socialLink, index) => (
                    <Draggable
                      key={socialLink.id}
                      draggableId={socialLink.id}
                      index={index}
                      isDragDisabled={isReordering}
                    >
                      {(provided) => (
                        <SocialLinkItem
                          key={socialLink.id}
                          socialLink={socialLink}
                          provided={provided}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </>
    )
  )
}
