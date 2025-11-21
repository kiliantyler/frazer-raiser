'use client'

import { addWorkLogAction } from '@/app/(private)/work-log/actions'
import { TagInput } from '@/components/shared/tag-input'
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
import { Input } from '@/components/ui/input'
import { useDialogState } from '@/hooks/use-dialog-state'
import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { ClientUploadedFileData } from 'uploadthing/types'

import type { FrazerFileRouter } from '@/app/api/uploadthing/core'
import type { WorkLogItem } from '@/types/work-log'
import { UploadButton } from '@uploadthing/react'
import { ContributorSelect } from './contributor-select'

interface WorkLogDialogProps {
  initialData?: Partial<WorkLogItem>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function WorkLogDialog({ initialData, trigger, open: controlledOpen, onOpenChange }: WorkLogDialogProps) {
  const { open, setOpen } = useDialogState({ controlledOpen, onOpenChange })

  const [imageIds, setImageIds] = useState<string[]>(initialData?.imageIds || [])
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [selectedContributors, setSelectedContributors] = useState<Id<'contributors'>[]>(
    initialData?.contributorIds || [],
  )

  const updateWorkLog = useMutation(api.worklog.updateEntry)

  const contributors = useQuery(api.contributors.list) || []
  const users = useQuery(api.users.list) || []
  const createContributor = useMutation(api.contributors.create)
  const deleteContributor = useMutation(api.contributors.remove)
  const me = useQuery(api.users.me)

  // Handle dialog open/close
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)

    // When dialog closes, reset state for new entries
    if (!newOpen && !initialData) {
      setSelectedContributors([])
    }
  }

  const handleUploadComplete = (res: ClientUploadedFileData<{ url: string; imageId?: string }>[]) => {
    const newIds = res.map(r => r.serverData?.imageId).filter(Boolean) as string[]
    setImageIds(prev => [...prev, ...newIds])
  }

  const toggleContributor = async (id: Id<'contributors'>) => {
    if (selectedContributors.includes(id)) {
      setSelectedContributors(prev => prev.filter(c => c !== id))
    } else {
      setSelectedContributors(prev => [...prev, id])
    }
  }

  const toggleUser = async (userId: Id<'users'>, name: string) => {
    // Check if this user already has a contributor record
    const existing = contributors.find(c => c.userId === userId)
    if (existing) {
      toggleContributor(existing._id)
    } else {
      // Create new contributor for this user
      const newId = await createContributor({ name, userId })
      setSelectedContributors(prev => [...prev, newId])
    }
  }

  const handleCreateContributor = async (name: string) => {
    const id = await createContributor({ name })
    setSelectedContributors(prev => [...prev, id])
  }

  const handleDeleteContributor = async (id: Id<'contributors'>) => {
    await deleteContributor({ id })
    setSelectedContributors(prev => prev.filter(c => c !== id))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger !== null && (
        <DialogTrigger asChild>
          {trigger === undefined ? (
            <Button>
              <Plus className="mr-2 size-4" />
              Add Entry
            </Button>
          ) : (
            trigger
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData && initialData._id ? 'Edit Work Log Entry' : 'Add Work Log Entry'}</DialogTitle>
          <DialogDescription>Log your work on the car. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <form
          action={async formData => {
            if (initialData && initialData._id) {
              // Handle update
              const title = formData.get('title') as string
              const hours = Number.parseFloat(formData.get('hours') as string)
              const description = formData.get('description') as string
              const costDeltaCents = formData.get('costDeltaCents')
                ? Number.parseInt(formData.get('costDeltaCents') as string)
                : undefined

              await updateWorkLog({
                id: initialData._id,
                title,
                hours,
                description,
                costDeltaCents,
                tags,
                imageIds: imageIds as Id<'images'>[],
                contributorIds: selectedContributors,
              })
            } else {
              await addWorkLogAction(formData)
            }
            setOpen(false)
            if (!initialData || !initialData._id) {
              setImageIds([])
              setTags([])
              // Reset contributors to just me
              if (me) {
                const myContributor = contributors.find(c => c.userId === me._id)
                if (myContributor) {
                  setSelectedContributors([myContributor._id])
                }
              }
            }
          }}
          className="space-y-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="title" placeholder="Title" aria-label="Title" required defaultValue={initialData?.title} />
            <Input
              name="hours"
              type="number"
              step="0.25"
              placeholder="Hours"
              aria-label="Hours"
              required
              defaultValue={initialData?.hours}
            />
          </div>

          <Input
            name="description"
            placeholder="Description (Optional)"
            aria-label="Description"
            defaultValue={initialData?.description}
          />

          <ContributorSelect
            contributors={contributors}
            users={users}
            selectedContributors={selectedContributors}
            onToggleContributor={toggleContributor}
            onToggleUser={toggleUser}
            onCreateContributor={handleCreateContributor}
            onDeleteContributor={handleDeleteContributor}
          />

          <TagInput tags={tags} onTagsChange={setTags} />

          <Input
            name="costDeltaCents"
            type="number"
            placeholder="Cost delta (cents)"
            aria-label="Cost change in cents"
            defaultValue={initialData?.costDeltaCents}
          />

          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <UploadButton<FrazerFileRouter, 'imageUploader'>
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`)
              }}
              appearance={{
                button: 'bg-primary text-primary-foreground',
                allowedContent: 'text-muted-foreground',
              }}
            />
            {imageIds.length > 0 && (
              <div className="mt-2 text-sm text-muted-foreground">{imageIds.length} image(s) attached</div>
            )}
          </div>

          <input type="hidden" name="tags" value={tags.join(',')} />
          <input type="hidden" name="imageIds" value={imageIds.join(',')} />
          <input type="hidden" name="contributorIds" value={selectedContributors.join(',')} />
          {initialData?.taskId && <input type="hidden" name="taskId" value={initialData.taskId} />}

          <DialogFooter>
            <Button type="submit">Save Entry</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
