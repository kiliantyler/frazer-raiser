'use client'

import type { FrazerFileRouter } from '@/app/api/uploadthing/core'
import { RichTextEditor } from '@/components/private/rich-text-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { UploadButton } from '@uploadthing/react'
import { useQuery } from 'convex/react'
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
  const [title, setTitle] = React.useState(initialUpdate?.title ?? '')
  const [slug, setSlug] = React.useState(initialUpdate?.slug ?? '')
  const [imageId, setImageId] = React.useState<string | null>(initialUpdate?.imageIds[0] ?? null)
  const [imageUrl, setImageUrl] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)

  const fullUpdate = useQuery(api.updates.getById, mode === 'edit' && updateId ? { updateId } : 'skip')

  const heroImage = useQuery(api.images.getById, imageId ? { imageId: imageId as unknown as Id<'images'> } : 'skip')

  React.useEffect(() => {
    if (fullUpdate) {
      setTitle(fullUpdate.title)
      setSlug(fullUpdate.slug)
      setImageId(fullUpdate.imageIds[0] ?? null)
    }
  }, [fullUpdate])

  React.useEffect(() => {
    if (heroImage) {
      setImageUrl(heroImage.url)
    }
  }, [heroImage])

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

  const handleUploadComplete = (res: Array<{ imageId?: string; url?: string }>) => {
    setIsUploading(false)
    if (res?.[0]) {
      if (res[0].imageId) {
        setImageId(res[0].imageId)
      }
      if (res[0].url) {
        setImageUrl(res[0].url)
      }
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

  return (
    <div className="space-y-6">
      <form action={mode === 'edit' ? updateUpdateAction : createUpdateAction} className="space-y-6">
        {mode === 'edit' && updateId ? <input type="hidden" name="updateId" value={updateId} /> : null}
        {imageId ? <input type="hidden" name="imageId" value={imageId} /> : null}

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
