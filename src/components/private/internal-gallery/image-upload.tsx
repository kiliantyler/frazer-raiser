'use client'

import type { FrazerFileRouter } from '@/app/api/uploadthing/core'
import { UploadButton } from '@uploadthing/react'
import { useState } from 'react'

export function ImageUpload() {
  const [uploaded, setUploaded] = useState(0)
  return (
    <>
      <div>
        <UploadButton<FrazerFileRouter, 'imageUploader'>
          endpoint="imageUploader"
          onClientUploadComplete={() => setUploaded(x => x + 1)}
          onUploadError={() => {}}
          appearance={{
            button: 'bg-primary text-primary-foreground',
            allowedContent: 'text-muted-foreground',
          }}
        />
      </div>
      <div className="text-sm text-muted-foreground">Uploaded in session: {uploaded}</div>
    </>
  )
}
