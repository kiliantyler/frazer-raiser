'use client'

import { HeroImageTrigger } from '@/components/private/hero-image-trigger'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { createPortal } from 'react-dom'

type UpdateEditorHeaderProps = {
  title: string
  eventDate: Date | undefined
  mode: 'create' | 'edit'
  isUploading: boolean
  isDeleting?: boolean
  imageUrl: string | null
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEventDateChange: (date: Date | undefined) => void
  onUploadComplete: (res: unknown) => void
  onUploadError: () => void
  onUploadBegin: () => void
  onRemove: () => void
}

export function UpdateEditorHeader({
  title,
  eventDate,
  mode,
  isUploading,
  isDeleting = false,
  imageUrl,
  onTitleChange,
  onEventDateChange,
  onUploadComplete,
  onUploadError,
  onUploadBegin,
  onRemove,
}: UpdateEditorHeaderProps) {
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const headerContainer = mounted ? document.getElementById('journal-editor-header-content') : null

  const headerContent = headerContainer ? (
    <div className="flex flex-1 items-center justify-between gap-4 px-4 w-full">
      <HeroImageTrigger
        imageUrl={imageUrl}
        isUploading={isUploading}
        isDeleting={isDeleting}
        onUploadComplete={onUploadComplete}
        onUploadError={onUploadError}
        onUploadBegin={onUploadBegin}
        onRemove={onRemove}
      />
      <div className="flex-1 min-w-0">
        <Input
          id="title"
          name="title"
          value={title}
          onChange={onTitleChange}
          required
          placeholder="Page title..."
          className="text-xl font-bold border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-1 h-auto w-full text-foreground placeholder:text-muted-foreground/50"
        />
      </div>
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md border border-border/50">
          <Label htmlFor="eventDate" className="text-xs font-medium text-muted-foreground">
            Date:
          </Label>
          <DatePicker value={eventDate} onChange={onEventDateChange} name="eventDate" placeholder="Select date" />
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit" form="editor-form" disabled={isUploading} size="sm">
            {mode === 'edit' ? 'Save' : 'Create'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/journal')}
            disabled={isUploading}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  ) : null

  return <>{mounted && headerContainer && createPortal(headerContent, headerContainer)}</>
}
