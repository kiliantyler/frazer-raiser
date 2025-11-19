'use client'

import type { FrazerFileRouter } from '@/app/api/uploadthing/core'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { UploadButton } from '@uploadthing/react'
import { ImageIcon, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import * as React from 'react'

type HeroImageTriggerProps = {
  imageUrl: string | null
  isUploading: boolean
  isDeleting?: boolean
  onUploadComplete: (res: unknown) => void
  onUploadError: () => void
  onUploadBegin: () => void
  onRemove: () => void
}

export function HeroImageTrigger({
  imageUrl,
  isUploading,
  isDeleting = false,
  onUploadComplete,
  onUploadError,
  onUploadBegin,
  onRemove,
}: HeroImageTriggerProps) {
  const [open, setOpen] = React.useState(false)

  const handleUploadComplete = (res: unknown) => {
    onUploadComplete(res)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="relative h-10 w-16 flex-shrink-0 overflow-hidden rounded-md border border-border bg-muted hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          disabled={isUploading || isDeleting}>
          {isUploading || isDeleting ? (
            <div className="flex h-full w-full items-center justify-center bg-background/50">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : imageUrl ? (
            <Image src={imageUrl} alt="Hero image" fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageIcon className="h-5 w-5" />
            </div>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hero Image</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          {imageUrl ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
              <Image src={imageUrl} alt="Hero image" fill className="object-cover" />
              {(isUploading || isDeleting) && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed bg-muted/50 relative">
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <span className="text-sm">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-10 w-10" />
                  <span className="text-sm">No hero image selected</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {!isDeleting && (
              <div className="flex justify-center">
                <UploadButton<FrazerFileRouter, 'imageUploader'>
                  endpoint="imageUploader"
                  onClientUploadComplete={handleUploadComplete}
                  onUploadError={onUploadError}
                  onUploadBegin={onUploadBegin}
                  appearance={{
                    button:
                      'bg-primary text-primary-foreground h-9 px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 ut-uploading:cursor-not-allowed',
                    allowedContent: 'text-muted-foreground text-xs mt-1',
                  }}
                  content={{
                    button({ ready, isUploading: isBtnUploading }) {
                      if (isBtnUploading) return 'Uploading...'
                      if (ready) return imageUrl ? 'Change Image' : 'Upload Image'
                      return 'Loading...'
                    },
                  }}
                />
              </div>
            )}

            {imageUrl && !isUploading && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="w-full"
                disabled={isDeleting}
                onClick={() => {
                  onRemove()
                  setOpen(false)
                }}>
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Remove Image
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
