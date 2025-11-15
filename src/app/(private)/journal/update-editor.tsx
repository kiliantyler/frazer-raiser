'use client'

import type { FrazerFileRouter } from '@/app/api/uploadthing/core'
import { RichTextEditor } from '@/components/private/rich-text-editor'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { UploadButton } from '@uploadthing/react'
import { useConvex, useQuery } from 'convex/react'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { createUpdateAction, updateUpdateAction } from './actions'

type Update = {
  _id: string
  title: string
  slug: string
  contentHtml?: string
  publishStatus: 'draft' | 'published'
  createdAt: number
  publishedAt?: number
  eventDate?: number
  imageIds: string[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replaceAll(/[^\w\s-]/g, '')
    .replaceAll(/[\s_-]+/g, '-')
    .replaceAll(/^-+|-+$/g, '')
}

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
  const router = useRouter()
  const convex = useConvex()
  const [title, setTitle] = React.useState(initialUpdate?.title ?? '')
  const [slug, setSlug] = React.useState(initialUpdate?.slug ?? '')
  const [imageId, setImageId] = React.useState<string | null>(initialUpdate?.imageIds[0] ?? null)
  const [imageUrl, setImageUrl] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)

  // Convert timestamp to Date object for DatePicker
  const timestampToDate = (timestamp?: number): Date | undefined => {
    return timestamp ? new Date(timestamp) : undefined
  }

  const [eventDate, setEventDate] = React.useState<Date | undefined>(timestampToDate(initialUpdate?.eventDate))

  // Use a ref to store imageId so it's always current when form submits
  const imageIdRef = React.useRef<string | null>(initialUpdate?.imageIds[0] ?? null)

  // Keep ref in sync with state
  React.useEffect(() => {
    imageIdRef.current = imageId
  }, [imageId])

  const fullUpdate = useQuery(api.updates.getById, mode === 'edit' && updateId ? { updateId } : 'skip')

  const heroImage = useQuery(api.images.getById, imageId ? { imageId: imageId as unknown as Id<'images'> } : 'skip')

  React.useEffect(() => {
    if (fullUpdate) {
      setTitle(fullUpdate.title)
      setSlug(fullUpdate.slug)
      // Sync imageId from fullUpdate - use the first imageId if available
      // This ensures we're using the latest data from the database
      setImageId(fullUpdate.imageIds[0] ?? null)
      setEventDate(timestampToDate(fullUpdate.eventDate))
    }
  }, [fullUpdate])

  React.useEffect(() => {
    if (heroImage) {
      setImageUrl(heroImage.url)
    } else if (heroImage === null && imageId) {
      // If heroImage query returned null but we have an imageId, clear the imageUrl
      // This handles the case where the image was deleted
      setImageUrl(null)
    }
  }, [heroImage, imageId])

  React.useEffect(() => {
    if (mode === 'create' && title && !slug) {
      setSlug(slugify(title))
    }
  }, [title, slug, mode])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (mode === 'create') {
      setSlug(slugify(newTitle))
    }
  }

  const handleUploadComplete = async (res: unknown) => {
    setIsUploading(false)
    console.log('[UpdateEditor] handleUploadComplete FULL response:', res)

    // UploadThing returns an array of file objects
    const files = Array.isArray(res) ? res : [res]
    const file = files[0]

    if (!file || typeof file !== 'object') {
      console.error('[UpdateEditor] No file in response!')
      return
    }

    // Extract URL and key - try multiple possible properties
    // The error shows all properties have the same value, so extract the actual URL properly
    const fileObj = file as {
      url?: string
      ufsUrl?: string
      appUrl?: string
      key?: string
      name?: string
      imageId?: string
      id?: string
      fileId?: string
    }
    const urlToUse =
      typeof fileObj.url === 'string' && fileObj.url.startsWith('http')
        ? fileObj.url
        : typeof fileObj.ufsUrl === 'string' && fileObj.ufsUrl.startsWith('http')
          ? fileObj.ufsUrl
          : typeof fileObj.appUrl === 'string' && fileObj.appUrl.startsWith('http')
            ? fileObj.appUrl
            : null

    const utKey = fileObj.key || fileObj.name || null

    console.log('[UpdateEditor] File object keys:', Object.keys(fileObj))
    console.log('[UpdateEditor] File URL:', urlToUse)
    console.log('[UpdateEditor] File key:', utKey)

    if (!urlToUse && !utKey) {
      console.error('[UpdateEditor] No URL or key found in file object!', fileObj)
      return
    }

    if (urlToUse) {
      setImageUrl(urlToUse)
    }

    // Try to get imageId from response first
    let imageIdToUse = fileObj.imageId || fileObj.id || fileObj.fileId || null

    // If no imageId in response, fetch from database using URL or key
    if (!imageIdToUse) {
      console.log('[UpdateEditor] No imageId in response, fetching from database...')

      // Try multiple times with delays - the image might still be saving
      const tryFetchImageId = async (attempt = 1, maxAttempts = 5) => {
        try {
          let imageFromDb = null

          // Try by URL first
          if (urlToUse) {
            imageFromDb = await convex.query(api.images.getByUrl, { url: urlToUse })
          }

          // If not found and we have a key, try by key
          if (!imageFromDb && utKey) {
            console.log('[UpdateEditor] Trying to find image by utKey:', utKey)
            imageFromDb = await convex.query(api.images.getByUtKey, { utKey })
          }

          if (imageFromDb) {
            imageIdToUse = imageFromDb._id
            console.log(`[UpdateEditor] Found imageId from database (attempt ${attempt}):`, imageIdToUse)

            // Update everything
            imageIdRef.current = imageIdToUse
            setImageId(imageIdToUse)
            const hiddenInput = document.querySelector<HTMLInputElement>('input[name="imageId"]')
            if (hiddenInput) {
              hiddenInput.value = imageIdToUse
            }
            return imageIdToUse
          } else if (attempt < maxAttempts) {
            console.log(`[UpdateEditor] Image not found, retrying in ${attempt * 200}ms...`)
            await new Promise(resolve => setTimeout(resolve, attempt * 200))
            return tryFetchImageId(attempt + 1, maxAttempts)
          } else {
            console.error(
              '[UpdateEditor] Image not found in database after all attempts. URL:',
              urlToUse,
              'Key:',
              utKey,
            )
            return null
          }
        } catch (error) {
          console.error(`[UpdateEditor] Error fetching image (attempt ${attempt}):`, error)
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, attempt * 200))
            return tryFetchImageId(attempt + 1, maxAttempts)
          }
          return null
        }
      }

      imageIdToUse = await tryFetchImageId()
    }

    if (imageIdToUse) {
      console.log('[UpdateEditor] Final imageId:', imageIdToUse)
      // Update ref immediately (synchronous)
      imageIdRef.current = imageIdToUse
      // Update state (asynchronous)
      setImageId(imageIdToUse)

      // Update the hidden input directly IMMEDIATELY
      const hiddenInput = document.querySelector<HTMLInputElement>('input[name="imageId"]')
      if (hiddenInput) {
        hiddenInput.value = imageIdToUse
        console.log('[UpdateEditor] Updated hidden input value to:', hiddenInput.value)
      }
    } else {
      console.error('[UpdateEditor] ERROR: Could not find imageId! URL was:', urlToUse)
    }
  }

  const handleUploadError = () => {
    setIsUploading(false)
  }

  const handleUploadBegin = () => {
    setIsUploading(true)
  }

  // Form will submit directly to server action, which handles redirect

  const currentContentHtml = fullUpdate?.contentHtml ?? initialUpdate?.contentHtml

  // Debug: Log imageId before form submission
  React.useEffect(() => {
    console.log('[UpdateEditor] Current imageId state:', imageId)
  }, [imageId])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    // Get imageId from multiple sources (ref is most reliable, then input, then state)
    const hiddenInput = form.querySelector<HTMLInputElement>('input[name="imageId"]')
    const imageIdFromInput = hiddenInput?.value?.trim() || ''
    const imageIdFromRef = imageIdRef.current || ''
    const imageIdFromState = imageId || ''

    // Use ref first (most reliable), then input, then state
    let imageIdToUse = imageIdFromRef || imageIdFromInput || imageIdFromState || ''

    console.log('[UpdateEditor] Form submit - imageId from ref:', imageIdFromRef)
    console.log('[UpdateEditor] Form submit - imageId from input:', imageIdFromInput)
    console.log('[UpdateEditor] Form submit - imageId from state:', imageIdFromState)
    console.log('[UpdateEditor] Form submit - Using imageId:', imageIdToUse)

    // If still no imageId but we have a URL, try to fetch it one more time
    if (!imageIdToUse && imageUrl) {
      console.log('[UpdateEditor] No imageId found, trying to fetch from database one last time...')
      try {
        const lastChanceImage = await convex.query(api.images.getByUrl, { url: imageUrl })
        if (lastChanceImage) {
          imageIdToUse = lastChanceImage._id
          console.log('[UpdateEditor] Found imageId on last chance fetch:', imageIdToUse)
          // Update everything
          imageIdRef.current = imageIdToUse
          setImageId(imageIdToUse)
          if (hiddenInput) {
            hiddenInput.value = imageIdToUse
          }
        }
      } catch (error) {
        console.error('[UpdateEditor] Error on last chance fetch:', error)
      }
    }

    // Always set imageId in form data (even if empty)
    formData.set('imageId', imageIdToUse)

    if (imageIdToUse) {
      console.log('[UpdateEditor] Submitting form with imageId:', imageIdToUse)
    } else {
      console.error('[UpdateEditor] WARNING: No imageId found from any source!')
      console.error('[UpdateEditor] imageUrl was:', imageUrl)
    }

    // Get the action function
    const action = mode === 'edit' ? updateUpdateAction : createUpdateAction

    // Call the server action with the form data
    await action(formData)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {mode === 'edit' && updateId ? <input type="hidden" name="updateId" value={updateId} /> : null}
        {/* Always render imageId input, even if empty, to ensure it's included in form data */}
        <input type="hidden" name="imageId" value={imageId || ''} />

        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
            required
            placeholder="The Engine Roars to Life"
            className="text-lg"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            required
            placeholder="the-engine-roars-to-life"
          />
          <p className="text-xs text-muted-foreground">URL-friendly identifier for this entry</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="eventDate">Date This Happened (optional)</Label>
          <DatePicker value={eventDate} onChange={setEventDate} name="eventDate" placeholder="Select date" />
          <p className="text-xs text-muted-foreground">
            The date when this event occurred. If not set, the publication date will be used.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contentHtml">Content</Label>
          <RichTextEditor id="contentHtml" name="contentHtml" initialContentHtml={currentContentHtml} />
        </div>

        <div className="grid gap-2">
          <Label>Hero Image (optional)</Label>
          {imageUrl ? (
            <div className="space-y-2">
              <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-md border">
                <Image src={imageUrl} alt="Hero image" fill className="object-cover" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setImageId(null)
                  setImageUrl(null)
                }}>
                Remove image
              </Button>
            </div>
          ) : (
            <div>
              <UploadButton<FrazerFileRouter, 'imageUploader'>
                endpoint="imageUploader"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                onUploadBegin={handleUploadBegin}
                appearance={{
                  button: isUploading
                    ? 'bg-muted text-muted-foreground cursor-not-allowed h-9 px-4 py-2 rounded-md text-sm font-medium'
                    : 'bg-primary text-primary-foreground h-9 px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90',
                  allowedContent: 'text-muted-foreground text-xs',
                }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isUploading} size="lg">
            {mode === 'edit' ? 'Save changes' : 'Create draft'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push('/journal')} disabled={isUploading}>
            <ArrowLeft className="mr-2 size-4" />
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
