'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { api } from '@convex/_generated/api'
import { type Id } from '@convex/_generated/dataModel'
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMutation, useQuery } from 'convex/react'
import { GripVertical } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { EmptyState } from '../empty-state'
import { DeleteImageDialog } from './delete-image-dialog'
import { DeleteMassImagesDialog } from './delete-mass-images-dialog'

interface ImageRowProps {
  image: {
    _id: Id<'images'>
    url: string
    dateTaken?: number | null
    isPublished?: boolean
    order?: number
  }
  isSelected: boolean
  onSelect: (checked: boolean) => void
  onUpdate: (id: Id<'images'>, updates: { dateTaken?: number | null; isPublished?: boolean }) => void
}

function SortableRow({ image, isSelected, onSelect, onUpdate }: ImageRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: isDragging ? 'relative' : undefined,
  } as React.CSSProperties

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`group border-b bg-background ${isDragging ? 'opacity-50' : ''} ${image.isPublished ? '' : 'opacity-60 grayscale'}`}>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
            <GripVertical className="h-4 w-4" />
          </button>
          <Checkbox checked={isSelected} onCheckedChange={checked => onSelect(checked === true)} />
        </div>
      </td>
      <td className="p-3">
        <Dialog>
          <DialogTrigger asChild>
            <button className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md bg-muted hover:opacity-80 border-0 p-0">
              <Image src={image.url} alt="Project photo" fill className="object-cover" sizes="64px" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
            <div className="relative h-[80vh] w-full overflow-hidden rounded-lg">
              <Image src={image.url} alt="Project photo" fill className="object-contain" />
            </div>
          </DialogContent>
        </Dialog>
      </td>
      <td className="p-3">
        <DatePicker
          value={image.dateTaken && image.dateTaken !== null ? new Date(image.dateTaken) : undefined}
          onChange={date => {
            const updates: { dateTaken?: number | null } = {}
            if (date === undefined) {
              // Explicitly clear the date
              updates.dateTaken = null
            } else {
              // Set the date
              updates.dateTaken = date.getTime()
            }
            onUpdate(image._id, updates)
          }}
        />
      </td>
      <td className="p-3">
        <Switch
          checked={image.isPublished ?? false}
          onCheckedChange={checked => onUpdate(image._id, { isPublished: checked })}
        />
      </td>
      <td className="p-3 text-right">
        <DeleteImageDialog imageId={image._id} />
      </td>
    </tr>
  )
}

export function ImageTable({
  images: initialImages,
  emptyMessage = 'No images uploaded yet',
}: {
  images: Array<{
    _id: Id<'images'>
    url: string
    dateTaken?: number | null
    isPublished?: boolean
    order?: number
    createdAt: number
  }>
  emptyMessage?: string
}) {
  // Use Convex query to reactively fetch images, falling back to initialImages for SSR
  const queriedImages = useQuery(api.images.listInternal, { limit: 100 })
  const serverImages = queriedImages ?? initialImages
  // Maintain local state for optimistic updates during drag operations
  const [localImages, setLocalImages] = useState<typeof serverImages | null>(null)
  const images = localImages ?? serverImages
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const updateImage = useMutation(api.images.updateImage)
  const reorderImages = useMutation(api.images.reorderImages)
  const deleteImages = useMutation(api.images.deleteImages)

  // Sync local state when server data changes (but not during drag)
  useEffect(() => {
    if (localImages === null) {
      // Already using server data, no need to update
      return
    }
    // If server data has changed significantly (different items), sync it
    // This handles cases where data changes from other sources
    const serverIds = new Set(serverImages.map((img: { _id: Id<'images'> }) => img._id))
    const localIds = new Set(localImages.map((img: { _id: Id<'images'> }) => img._id))
    const idsMatch = serverIds.size === localIds.size && [...serverIds].every(id => localIds.has(id))

    // Only sync if items are different (not just reordered)
    // This prevents clearing local state during the drag animation
    if (!idsMatch) {
      setLocalImages(null)
    }
  }, [serverImages, localImages])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const currentImages = localImages ?? serverImages
      const oldIndex = currentImages.findIndex((i: { _id: Id<'images'> }) => i._id === active.id)
      const newIndex = currentImages.findIndex((i: { _id: Id<'images'> }) => i._id === over.id)
      const newItems = arrayMove(currentImages, oldIndex, newIndex)

      // Optimistic update - maintain local state until query refetches
      setLocalImages(newItems)

      // Update server
      const updates = newItems.map((item: { _id: Id<'images'> }, index: number) => ({
        id: item._id,
        order: index,
      }))
      await reorderImages({ updates })

      // Clear local state after a short delay to allow animation to complete
      // The query will refetch and update automatically
      setTimeout(() => {
        setLocalImages(null)
      }, 300)
    } else {
      // If drag was cancelled, clear local state
      setLocalImages(null)
    }
  }

  const handleUpdate = async (id: Id<'images'>, updates: { dateTaken?: number | null; isPublished?: boolean }) => {
    // The query will automatically refetch after the mutation
    await updateImage({ imageId: id, ...updates })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(images.map((i: { _id: Id<'images'> }) => i._id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleMassDelete = async (imageIds: Id<'images'>[]) => {
    await deleteImages({ imageIds })
    setSelectedIds(new Set())
  }

  const handleMassPublish = async (publish: boolean) => {
    for (const id of selectedIds) {
      await updateImage({ imageId: id as Id<'images'>, isPublished: publish })
    }
    setSelectedIds(new Set())
  }

  const handleSortByDate = async () => {
    if (
      !confirm(
        'This will reorder all images by their "Date Taken" (or creation date), overriding any manual ordering. Continue?',
      )
    )
      return
    const sorted = [...images].toSorted((a, b) => (a.dateTaken ?? 0) - (b.dateTaken ?? 0))
    const updates = sorted.map((item, index) => ({
      id: item._id,
      order: index,
    }))
    await reorderImages({ updates })
    // The query will automatically refetch after the mutation
  }

  if (images.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 rounded-md border bg-muted/40 p-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedIds.size === images.length && images.length > 0}
            onCheckedChange={checked => handleSelectAll(checked === true)}
          />
          <span className="text-sm text-muted-foreground">{selectedIds.size} selected</span>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 ? (
            <>
              <Button variant="outline" size="sm" onClick={() => handleMassPublish(true)}>
                Publish
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleMassPublish(false)}>
                Unpublish
              </Button>
              <DeleteMassImagesDialog
                imageIds={Array.from(selectedIds)}
                onDelete={handleMassDelete}
                onSuccess={() => {
                  // Selection is cleared in handleMassDelete
                }}
              />
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={handleSortByDate}>
              Sort by Date Taken
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <DndContext
          id="image-table-dnd-context"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}>
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="w-12 p-3"></th>
                <th className="p-3 text-left text-sm font-medium">Preview</th>
                <th className="p-3 text-left text-sm font-medium">Date Taken</th>
                <th className="p-3 text-left text-sm font-medium">Published</th>
                <th className="p-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <SortableContext
                items={images.map((i: { _id: Id<'images'> }) => i._id)}
                strategy={verticalListSortingStrategy}>
                {images.map(
                  (image: {
                    _id: Id<'images'>
                    url: string
                    dateTaken?: number | null
                    isPublished?: boolean
                    order?: number
                    createdAt: number
                  }) => (
                    <SortableRow
                      key={image._id}
                      image={image}
                      isSelected={selectedIds.has(image._id)}
                      onSelect={checked => handleSelect(image._id, checked)}
                      onUpdate={handleUpdate}
                    />
                  ),
                )}
              </SortableContext>
            </tbody>
          </table>
        </DndContext>
      </div>
    </div>
  )
}
