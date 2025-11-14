'use client'

import type { FrazerFileRouter } from '@/app/api/uploadthing/core'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UploadButton } from '@uploadthing/react'
import { useEffect, useState } from 'react'

type AvatarUploadProps = {
  currentAvatarUrl?: string
  currentName: string
  onUploadComplete: (url: string) => void
}

export function AvatarUpload({ currentAvatarUrl, currentName, onUploadComplete }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(currentAvatarUrl)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    setAvatarUrl(currentAvatarUrl)
  }, [currentAvatarUrl])

  const userInitial = currentName?.[0]?.toUpperCase() ?? 'U'

  const handleUploadComplete = (res: Array<{ url: string }>) => {
    if (res?.[0]?.url) {
      const newUrl = res[0].url
      setAvatarUrl(newUrl)
      onUploadComplete(newUrl)
      setIsUploading(false)
    }
  }

  const handleUploadError = () => {
    setIsUploading(false)
  }

  const handleUploadBegin = () => {
    setIsUploading(true)
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl} alt={currentName} />
        <AvatarFallback className="bg-primary/20 text-primary text-2xl">{userInitial}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <UploadButton<FrazerFileRouter, 'avatarUploader'>
          endpoint="avatarUploader"
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
        <p className="text-sm text-muted-foreground">JPG, PNG up to 4MB</p>
      </div>
    </div>
  )
}
