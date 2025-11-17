'use client'

import type { FrazerFileRouter } from '@/app/api/uploadthing/core'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { UploadButton } from '@uploadthing/react'
import Image from 'next/image'

type HeroImageUploadProps = {
  imageUrl: string | null
  isUploading: boolean
  onUploadComplete: (res: unknown) => void
  onUploadError: () => void
  onUploadBegin: () => void
  onRemove: () => void
}

export function HeroImageUpload({
  imageUrl,
  isUploading,
  onUploadComplete,
  onUploadError,
  onUploadBegin,
  onRemove,
}: HeroImageUploadProps) {
  return (
    <div className="flex-shrink-0 border-t border-border bg-background px-6 py-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Hero Image (optional)</Label>
        {imageUrl ? (
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-24 overflow-hidden rounded-md border">
              <Image src={imageUrl} alt="Hero image" fill className="object-cover" />
            </div>
            <Button type="button" variant="outline" size="sm" onClick={onRemove}>
              Remove
            </Button>
          </div>
        ) : (
          <UploadButton<FrazerFileRouter, 'imageUploader'>
            endpoint="imageUploader"
            onClientUploadComplete={onUploadComplete}
            onUploadError={onUploadError}
            onUploadBegin={onUploadBegin}
            appearance={{
              button: isUploading
                ? 'bg-muted text-muted-foreground cursor-not-allowed h-8 px-3 py-1.5 rounded-md text-sm font-medium'
                : 'bg-primary text-primary-foreground h-8 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90',
              allowedContent: 'text-muted-foreground text-xs',
            }}
          />
        )}
      </div>
    </div>
  )
}
