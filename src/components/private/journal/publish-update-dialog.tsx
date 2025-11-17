'use client'

import { publishUpdateAction, unpublishUpdateAction } from '@/app/(private)/journal/actions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Update } from '@/types/updates'
import * as React from 'react'

export function PublishUpdateDialog({ update }: { update: Update }) {
  const [open, setOpen] = React.useState(false)
  const isPublished = update.publishStatus === 'published'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isPublished ? 'outline' : 'default'} size="sm">
          {isPublished ? 'Unpublish' : 'Publish'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif">
            {isPublished ? 'Unpublish Journal Entry' : 'Publish Journal Entry'}
          </DialogTitle>
          <DialogDescription>
            {isPublished
              ? 'This entry will be removed from the public timeline and updates pages. You can publish it again later.'
              : 'This entry will be visible on the public timeline and updates pages.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <form
            action={async formData => {
              if (isPublished) {
                await unpublishUpdateAction(formData)
              } else {
                await publishUpdateAction(formData)
              }
              setOpen(false)
            }}>
            <input type="hidden" name="updateId" value={update._id} />
            <Button type="submit" variant={isPublished ? 'destructive' : 'default'}>
              {isPublished ? 'Unpublish' : 'Publish'}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
