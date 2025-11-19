'use client'

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
import type { Id } from '@convex/_generated/dataModel'
import { Loader2, Trash2 } from 'lucide-react'
import * as React from 'react'

interface DeleteMassImagesDialogProps {
  imageIds: string[]
  onDelete: (imageIds: Id<'images'>[]) => Promise<void>
  onSuccess: () => void
}

export function DeleteMassImagesDialog({ imageIds, onDelete, onSuccess }: DeleteMassImagesDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(imageIds as Id<'images'>[])
      setOpen(false)
      onSuccess()
    } catch (error) {
      alert('An error occurred while deleting the images')
      console.error(error)
      setIsDeleting(false)
    }
  }

  const count = imageIds.length

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={count === 0}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Delete {count} image{count === 1 ? '' : 's'}?
          </DialogTitle>
          <DialogDescription>
            This will permanently delete {count === 1 ? 'this image' : `these ${count} images`} from both storage and
            the database. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
