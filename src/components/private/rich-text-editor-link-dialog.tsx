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

interface RichTextEditorLinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialUrl: string
  onLinkSubmit: (url: string) => void
  onLinkCancel: () => void
}

export function RichTextEditorLinkDialog({
  open,
  onOpenChange,
  initialUrl,
  onLinkSubmit,
  onLinkCancel,
}: RichTextEditorLinkDialogProps) {
  const [linkUrl, setLinkUrl] = React.useState(initialUrl)

  React.useEffect(() => {
    setLinkUrl(initialUrl)
  }, [initialUrl])

  const handleSubmit = () => {
    onLinkSubmit(linkUrl)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Link</DialogTitle>
          <DialogDescription>Enter the URL for the link. Leave blank to remove an existing link.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSubmit()
                }
                if (e.key === 'Escape') {
                  e.preventDefault()
                  onLinkCancel()
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onLinkCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
