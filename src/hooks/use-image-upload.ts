'use client'

import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { useConvex } from 'convex/react'
import * as React from 'react'

// We'll use a server action for the actual deletion which has the permissions/UTApi access
import { deleteImage } from '@/app/(private)/internal-gallery/actions'

type FileResponse = {
  url?: string
  ufsUrl?: string
  appUrl?: string
  key?: string
  name?: string
  imageId?: string
  id?: string
  fileId?: string
}

type UseImageUploadOptions = {
  onImageIdChange?: (imageId: string | null) => void
  onImageUrlChange?: (imageUrl: string | null) => void
}

export function useImageUpload({ onImageIdChange, onImageUrlChange }: UseImageUploadOptions = {}) {
  const convex = useConvex()
  const [isUploading, setIsUploading] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState<string | null>(null)
  const [imageId, setImageId] = React.useState<string | null>(null)
  const imageIdRef = React.useRef<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // Keep ref in sync with state
  React.useEffect(() => {
    imageIdRef.current = imageId
  }, [imageId])

  // Notify parent of changes
  React.useEffect(() => {
    if (onImageIdChange) {
      onImageIdChange(imageId)
    }
  }, [imageId, onImageIdChange])

  React.useEffect(() => {
    if (onImageUrlChange) {
      onImageUrlChange(imageUrl)
    }
  }, [imageUrl, onImageUrlChange])

  const extractFileData = (res: unknown): { url: string | null; key: string | null; imageId: string | null } => {
    const files = Array.isArray(res) ? res : [res]
    const file = files[0]

    if (!file || typeof file !== 'object') {
      console.error('[useImageUpload] No file in response!')
      return { url: null, key: null, imageId: null }
    }

    const fileObj = file as FileResponse

    const urlToUse =
      typeof fileObj.url === 'string' && fileObj.url.startsWith('http')
        ? fileObj.url
        : typeof fileObj.ufsUrl === 'string' && fileObj.ufsUrl.startsWith('http')
          ? fileObj.ufsUrl
          : typeof fileObj.appUrl === 'string' && fileObj.appUrl.startsWith('http')
            ? fileObj.appUrl
            : null

    const utKey = fileObj.key || fileObj.name || null
    const imageIdFromResponse = fileObj.imageId || fileObj.id || fileObj.fileId || null

    return { url: urlToUse, key: utKey, imageId: imageIdFromResponse }
  }

  const tryFetchImageId = async (
    url: string | null,
    key: string | null,
    attempt = 1,
    maxAttempts = 5,
  ): Promise<string | null> => {
    try {
      let imageFromDb = null

      // Try by URL first
      if (url) {
        imageFromDb = await convex.query(api.images.getByUrl, { url })
      }

      // If not found and we have a key, try by key
      if (!imageFromDb && key) {
        console.log('[useImageUpload] Trying to find image by utKey:', key)
        imageFromDb = await convex.query(api.images.getByUtKey, { utKey: key })
      }

      if (imageFromDb) {
        const foundId = imageFromDb._id
        console.log(`[useImageUpload] Found imageId from database (attempt ${attempt}):`, foundId)
        return foundId
      } else if (attempt < maxAttempts) {
        console.log(`[useImageUpload] Image not found, retrying in ${attempt * 200}ms...`)
        await new Promise(resolve => setTimeout(resolve, attempt * 200))
        return tryFetchImageId(url, key, attempt + 1, maxAttempts)
      } else {
        console.error('[useImageUpload] Image not found in database after all attempts. URL:', url, 'Key:', key)
        return null
      }
    } catch (error) {
      console.error(`[useImageUpload] Error fetching image (attempt ${attempt}):`, error)
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, attempt * 200))
        return tryFetchImageId(url, key, attempt + 1, maxAttempts)
      }
      return null
    }
  }

  const updateImageId = (newImageId: string | null) => {
    imageIdRef.current = newImageId
    setImageId(newImageId)

    // Update the hidden input directly
    const hiddenInput = document.querySelector<HTMLInputElement>('input[name="imageId"]')
    if (hiddenInput) {
      hiddenInput.value = newImageId || ''
    }
  }

  const handleUploadComplete = async (res: unknown) => {
    setIsUploading(false)
    console.log('[useImageUpload] handleUploadComplete FULL response:', res)

    const { url, key, imageId: imageIdFromResponse } = extractFileData(res)

    if (!url && !key) {
      console.error('[useImageUpload] No URL or key found in file object!')
      return
    }

    if (url) {
      setImageUrl(url)
    }

    // Try to get imageId from response first
    let imageIdToUse = imageIdFromResponse

    // If no imageId in response, fetch from database using URL or key
    if (!imageIdToUse) {
      console.log('[useImageUpload] No imageId in response, fetching from database...')
      imageIdToUse = await tryFetchImageId(url, key)
    }

    if (imageIdToUse) {
      console.log('[useImageUpload] Final imageId:', imageIdToUse)
      updateImageId(imageIdToUse)
    } else {
      console.error('[useImageUpload] ERROR: Could not find imageId! URL was:', url)
    }
  }

  const handleUploadError = () => {
    setIsUploading(false)
  }

  const handleUploadBegin = () => {
    setIsUploading(true)
  }

  const removeImage = async () => {
    // If we have an image ID, we should delete it from the server
    if (imageId) {
      setIsDeleting(true)
      try {
        console.log('[useImageUpload] Deleting image:', imageId)
        const result = await deleteImage(imageId as Id<'images'>)

        if (result.success) {
          console.log('[useImageUpload] Image deleted successfully')
        } else {
          console.error('[useImageUpload] Failed to delete image:', result.error)
          // Even if server deletion fails, we clear local state to keep UI responsive
          // But in a robust app we might want to show an error
        }
      } catch (error) {
        console.error('[useImageUpload] Error deleting image:', error)
      } finally {
        setIsDeleting(false)
      }
    }

    setImageId(null)
    setImageUrl(null)
    updateImageId(null)
  }

  const getImageIdForForm = (): string => {
    // Get imageId from multiple sources (ref is most reliable, then input, then state)
    const hiddenInput = document.querySelector<HTMLInputElement>('input[name="imageId"]')
    const imageIdFromInput = hiddenInput?.value?.trim() || ''
    const imageIdFromRef = imageIdRef.current || ''
    const imageIdFromState = imageId || ''

    // Use ref first (most reliable), then input, then state
    return imageIdFromRef || imageIdFromInput || imageIdFromState || ''
  }

  const tryLastChanceFetch = async (url: string | null): Promise<string | null> => {
    if (!url) return null

    console.log('[useImageUpload] No imageId found, trying to fetch from database one last time...')
    try {
      const lastChanceImage = await convex.query(api.images.getByUrl, { url })
      if (lastChanceImage) {
        const foundId = lastChanceImage._id
        console.log('[useImageUpload] Found imageId on last chance fetch:', foundId)
        updateImageId(foundId)
        return foundId
      }
    } catch (error) {
      console.error('[useImageUpload] Error on last chance fetch:', error)
    }
    return null
  }

  return {
    imageId,
    imageUrl,
    isUploading,
    isDeleting,
    imageIdRef,
    handleUploadComplete,
    handleUploadError,
    handleUploadBegin,
    removeImage,
    getImageIdForForm,
    tryLastChanceFetch,
    setImageId,
    setImageUrl,
  }
}
