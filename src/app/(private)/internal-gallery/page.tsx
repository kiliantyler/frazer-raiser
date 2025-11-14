'use client'

import type { FrazerFileRouter } from '@/app/api/uploadthing/core'
import { PageHeader } from '@/components/private/page-header'
import { UploadButton } from '@uploadthing/react'
import { useState } from 'react'

export default function InternalGalleryPage() {
  const [uploaded, setUploaded] = useState(0)
  return (
    <section className="space-y-6">
      <PageHeader title="Internal Gallery" />
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
    </section>
  )
}
