'use client'

import { deleteImage } from '@/app/(private)/internal-gallery/actions'
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
import { useRouter } from 'next/navigation'
import * as React from 'react'

export function DeleteImageDialog({ imageId }: { imageId: string }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteImage(imageId as Id<'images'>)
      if (result.success) {
        setOpen(false)
        router.refresh()
      } else {
        alert(`Failed to delete image: ${result.error}`)
        setIsDeleting(false)
      }
    } catch (error) {
      alert('An error occurred while deleting the image')
      console.error(error)
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Delete image">
          <Trash2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete image?</DialogTitle>
          <DialogDescription>
            This will permanently delete the image from both storage and the database. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
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
