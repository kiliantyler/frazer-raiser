'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as React from 'react'

interface RichTextEditorImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImageAltSubmit: (altText: string) => void
  onImageAltCancel: () => void
}

export function RichTextEditorImageDialog({
  open,
  onOpenChange,
  onImageAltSubmit,
  onImageAltCancel,
}: RichTextEditorImageDialogProps) {
  const [imageAltText, setImageAltText] = React.useState('')

  const handleSubmit = () => {
    onImageAltSubmit(imageAltText)
    setImageAltText('')
  }

  const handleCancel = () => {
    onImageAltCancel()
    setImageAltText('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
          <DialogDescription>Describe the image for accessibility (alt text).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="image-alt">Alt Text</Label>
            <Input
              id="image-alt"
              type="text"
              placeholder="A description of the image"
              value={imageAltText}
              onChange={e => setImageAltText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSubmit()
                }
                if (e.key === 'Escape') {
                  e.preventDefault()
                  handleCancel()
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Add Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
