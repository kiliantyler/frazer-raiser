'use client'

import type { FrazerFileRouter } from '@/app/api/uploadthing/core'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { UploadButton } from '@uploadthing/react'
import { useQuery } from 'convex/react'
import { Pencil, Plus } from 'lucide-react'
import Image from 'next/image'
import * as React from 'react'
import { createUpdateAction, updateUpdateAction } from './actions'

type Update = {
  _id: string
  title: string
  slug: string
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

export function UpdateDialog({ mode, update }: { mode: 'create' | 'edit'; update?: Update }) {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState(update?.title ?? '')
  const [slug, setSlug] = React.useState(update?.slug ?? '')
  const [content, setContent] = React.useState('')
  const [imageId, setImageId] = React.useState<string | null>(update?.imageIds[0] ?? null)
  const [imageUrl, setImageUrl] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)

  const fullUpdate = useQuery(
    api.updates.getById,
    update && open ? { updateId: update._id as unknown as Id<'updates'> } : 'skip',
  )

  const heroImage = useQuery(api.images.getById, imageId ? { imageId: imageId as unknown as Id<'images'> } : 'skip')

  React.useEffect(() => {
    if (fullUpdate) {
      setTitle(fullUpdate.title)
      setSlug(fullUpdate.slug)
      setContent(fullUpdate.content)
      setImageId(fullUpdate.imageIds[0] ?? null)
    }
  }, [fullUpdate])

  React.useEffect(() => {
    if (!open && !update) {
      // Reset form when dialog closes (only for create mode)
      setTitle('')
      setSlug('')
      setContent('')
      setImageId(null)
      setImageUrl(null)
    }
  }, [open, update])

  React.useEffect(() => {
    if (heroImage) {
      setImageUrl(heroImage.url)
    }
  }, [heroImage])

  React.useEffect(() => {
    if (!update && title && !slug) {
      setSlug(slugify(title))
    }
  }, [title, slug, update])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (!update) {
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

  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon" aria-label="Edit update">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button aria-label="New Journal Entry" onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 size-4" />
            New Journal Entry
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">{isEdit ? 'Edit Journal Entry' : 'New Journal Entry'}</DialogTitle>
        </DialogHeader>
        <form
          action={async formData => {
            if (isEdit) {
              await updateUpdateAction(formData)
            } else {
              await createUpdateAction(formData)
            }
            setOpen(false)
          }}
          className="space-y-4">
          {isEdit ? <input type="hidden" name="updateId" value={update?._id ?? ''} /> : null}
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
            <Label htmlFor="content">Content (Markdown)</Label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              rows={12}
              className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Write your journal entry in Markdown..."
            />
            <p className="text-xs text-muted-foreground">Supports Markdown formatting</p>
          </div>

          <div className="grid gap-2">
            <Label>Hero Image (optional)</Label>
            {imageUrl ? (
              <div className="space-y-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
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

          <DialogFooter>
            <Button type="submit" disabled={isUploading}>
              {isEdit ? 'Save changes' : 'Create draft'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
