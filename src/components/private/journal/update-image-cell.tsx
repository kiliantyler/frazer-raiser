'use client'

import { HeroImageTrigger } from '@/components/private/hero-image-trigger'
import { useImageUpload } from '@/hooks/use-image-upload'
import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
import * as React from 'react'

type UpdateImageCellProps = {
  updateId: Id<'updates'>
  initialImageIds: Id<'images'>[]
}

export function UpdateImageCell({ updateId, initialImageIds }: UpdateImageCellProps) {
  const router = useRouter()
  const imageUpload = useImageUpload()
  const updateMutation = useMutation(api.updates.updateDraft)
  const linkImageMutation = useMutation(api.images.linkToEntity)
  const initialImageId = initialImageIds[0] ? (initialImageIds[0] as string) : null

  // Initialize imageId from props
  React.useEffect(() => {
    if (initialImageId) {
      imageUpload.setImageId(initialImageId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialImageId])

  // Query for the image URL
  const heroImage = useQuery(
    api.images.getById,
    imageUpload.imageId ? { imageId: imageUpload.imageId as unknown as Id<'images'> } : 'skip',
  )

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

  const handleUploadComplete = async (res: unknown) => {
    // Let the hook handle state updates and extracting ID
    await imageUpload.handleUploadComplete(res)

    // Get the NEW ID from the hook's ref
    const newImageId = imageUpload.imageIdRef.current

    if (newImageId) {
      const imageId = newImageId as unknown as Id<'images'>

      // Update the update record
      await updateMutation({
        updateId,
        imageIds: [imageId],
      })

      // Link the image to the update entity
      await linkImageMutation({
        imageId,
        refType: 'update',
        refId: updateId,
      })

      router.refresh()
    }
  }

  const handleRemove = async () => {
    // Call removeImage which will delete the image from server if it has an ID
    await imageUpload.removeImage()

    // Update the update record to remove reference
    await updateMutation({
      updateId,
      imageIds: [],
    })

    router.refresh()
  }

  return (
    <div className="flex items-center justify-center">
      <HeroImageTrigger
        imageUrl={imageUpload.imageUrl}
        isUploading={imageUpload.isUploading}
        isDeleting={imageUpload.isDeleting}
        onUploadComplete={handleUploadComplete}
        onUploadError={imageUpload.handleUploadError}
        onUploadBegin={imageUpload.handleUploadBegin}
        onRemove={handleRemove}
      />
    </div>
  )
}
