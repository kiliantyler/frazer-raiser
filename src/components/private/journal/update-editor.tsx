'use client'

import { createUpdateAction, updateUpdateAction } from '@/app/(private)/journal/actions'
import { HeroImageUpload } from '@/components/private/hero-image-upload'
import { RichTextEditor } from '@/components/private/rich-text-editor'
import { UpdateEditorHeader } from '@/components/private/update-editor-header'
import { useImageUpload } from '@/hooks/use-image-upload'
import { slugify } from '@/lib/utils/format'
import type { Update } from '@/types/updates'
import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import * as React from 'react'

type UpdateEditorProps =
  | {
      mode: 'create'
      updateId?: never
      initialUpdate?: never
    }
  | {
      mode: 'edit'
      updateId: Id<'updates'>
      initialUpdate: Update
    }

export function UpdateEditor({ mode, updateId, initialUpdate }: UpdateEditorProps) {
  const [title, setTitle] = React.useState(initialUpdate?.title ?? '')
  const [slug] = React.useState(initialUpdate?.slug ?? '')
  const [eventDate, setEventDate] = React.useState<Date | undefined>(
    initialUpdate?.eventDate ? new Date(initialUpdate.eventDate) : undefined,
  )

  const imageUpload = useImageUpload()

  // Initialize imageId from initialUpdate
  React.useEffect(() => {
    if (initialUpdate?.imageIds[0]) {
      imageUpload.setImageId(initialUpdate.imageIds[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUpdate])

  const fullUpdate = useQuery(api.updates.getById, mode === 'edit' && updateId ? { updateId } : 'skip')

  const heroImage = useQuery(
    api.images.getById,
    imageUpload.imageId ? { imageId: imageUpload.imageId as unknown as Id<'images'> } : 'skip',
  )

  // Sync state from fullUpdate when editing
  React.useEffect(() => {
    if (fullUpdate) {
      setTitle(fullUpdate.title)
      imageUpload.setImageId(fullUpdate.imageIds[0] ?? null)
      setEventDate(fullUpdate.eventDate ? new Date(fullUpdate.eventDate) : undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullUpdate])

  // Sync imageUrl from heroImage query
  React.useEffect(() => {
    if (heroImage) {
      imageUpload.setImageUrl(heroImage.url)
    } else if (heroImage === null && imageUpload.imageId) {
      // If heroImage query returned null but we have an imageId, clear the imageUrl
      // This handles the case where the image was deleted
      imageUpload.setImageUrl(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroImage, imageUpload.imageId])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const currentContentHtml = fullUpdate?.contentHtml ?? initialUpdate?.contentHtml

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    // Get imageId from hook
    let imageIdToUse = imageUpload.getImageIdForForm()

    // If still no imageId but we have a URL, try to fetch it one more time
    if (!imageIdToUse && imageUpload.imageUrl) {
      const lastChanceId = await imageUpload.tryLastChanceFetch(imageUpload.imageUrl)
      if (lastChanceId) {
        imageIdToUse = lastChanceId
      }
    }

    // Always set imageId in form data (even if empty)
    formData.set('imageId', imageIdToUse)

    // Set slug - auto-generated from title if creating, or use existing if editing
    const slugToUse = mode === 'create' ? slugify(title) : slug
    formData.set('slug', slugToUse)

    if (imageIdToUse) {
      console.log('[UpdateEditor] Submitting form with imageId:', imageIdToUse)
    } else {
      console.error('[UpdateEditor] WARNING: No imageId found from any source!')
      console.error('[UpdateEditor] imageUrl was:', imageUpload.imageUrl)
    }

    // Get the action function
    const action = mode === 'edit' ? updateUpdateAction : createUpdateAction

    // Call the server action with the form data
    await action(formData)
  }

  return (
    <>
      <UpdateEditorHeader
        title={title}
        eventDate={eventDate}
        mode={mode}
        isUploading={imageUpload.isUploading}
        onTitleChange={handleTitleChange}
        onEventDateChange={setEventDate}
      />
      <div className="absolute inset-0 top-16 bottom-0 left-0 right-0 flex flex-col">
        <form id="editor-form" onSubmit={handleFormSubmit} className="flex flex-col h-full">
          {mode === 'edit' && updateId ? <input type="hidden" name="updateId" value={updateId} /> : null}
          {/* Always render imageId input, even if empty, to ensure it's included in form data */}
          <input type="hidden" name="imageId" value={imageUpload.imageId || ''} />
          <input type="hidden" name="title" value={title} />
          <input type="hidden" name="eventDate" value={eventDate ? eventDate.toISOString().split('T')[0] : ''} />

          {/* Full-page editor area - no box, just the editor */}
          <div className="flex-1 overflow-auto min-h-0">
            <RichTextEditor id="contentHtml" name="contentHtml" initialContentHtml={currentContentHtml} />
          </div>

          {/* Hero Image section - fixed at bottom */}
          <HeroImageUpload
            imageUrl={imageUpload.imageUrl}
            isUploading={imageUpload.isUploading}
            onUploadComplete={imageUpload.handleUploadComplete}
            onUploadError={imageUpload.handleUploadError}
            onUploadBegin={imageUpload.handleUploadBegin}
            onRemove={imageUpload.removeImage}
          />
        </form>
      </div>
    </>
  )
}
