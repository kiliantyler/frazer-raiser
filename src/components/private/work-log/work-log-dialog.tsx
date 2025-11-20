'use client'

import { addWorkLogAction } from '@/app/(private)/work-log/actions'
import type { FrazerFileRouter } from '@/app/api/uploadthing/core'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { UploadButton } from '@uploadthing/react'
import { useMutation, useQuery } from 'convex/react'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ClientUploadedFileData } from 'uploadthing/types'

import type { WorkLogItem } from '@/types/work-log'

interface WorkLogDialogProps {
  initialData?: WorkLogItem
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function WorkLogDialog({ initialData, trigger, open: controlledOpen, onOpenChange }: WorkLogDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange!(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }

  const [imageIds, setImageIds] = useState<string[]>(initialData?.imageIds || [])
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [selectedContributors, setSelectedContributors] = useState<Id<'contributors'>[]>(
    initialData?.contributorIds || [],
  )
  const [contributorOpen, setContributorOpen] = useState(false)
  const [contributorToDelete, setContributorToDelete] = useState<Id<'contributors'> | null>(null)
  const [isEditingContributors, setIsEditingContributors] = useState(false)

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

  const addTag = () => {
    if (tagInput.trim()) {
      setTags(prev => [...prev, tagInput.trim()])
      setTagInput('')
    }
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
    setContributorOpen(false)
  }

  const handleDeleteContributor = async (id: Id<'contributors'>) => {
    setContributorToDelete(id)
  }

  const confirmDeleteContributor = async () => {
    if (contributorToDelete) {
      await deleteContributor({ id: contributorToDelete })
      setSelectedContributors(prev => prev.filter(c => c !== contributorToDelete))
      setContributorToDelete(null)
    }
  }

  // Combine contributors and users for the list
  // We want to show all existing contributors, AND all users who aren't yet contributors
  const allOptions = useMemo(
    () =>
      [
        ...contributors,
        ...users
          .filter(u => !contributors.some(c => c.userId === u._id))
          .map(u => ({ _id: u._id as string, name: u.name, userId: u._id, isUser: true })),
      ].toSorted((a, b) => a.name.localeCompare(b.name)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contributors, users],
  )

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
          <DialogTitle>{initialData ? 'Edit Work Log Entry' : 'Add Work Log Entry'}</DialogTitle>
          <DialogDescription>Log your work on the car. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <form
          action={async formData => {
            if (initialData) {
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
            if (!initialData) {
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

          <div className="flex flex-col gap-2">
            <label htmlFor="contributors-select" className="text-sm font-medium">
              Contributors
            </label>
            <Popover open={contributorOpen} onOpenChange={setContributorOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="contributors-select"
                  variant="outline"
                  role="combobox"
                  aria-expanded={contributorOpen}
                  aria-controls="contributors-options"
                  className="justify-between">
                  {selectedContributors.length > 0
                    ? `${selectedContributors.length} selected`
                    : 'Select contributors...'}
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command id="contributors-options">
                  <div className="flex items-center border-b px-3">
                    <CommandInput placeholder="Search contributors..." className="border-none focus:ring-0" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setIsEditingContributors(!isEditingContributors)}>
                      {isEditingContributors ? 'Done' : 'Edit'}
                    </Button>
                  </div>
                  <CommandList>
                    <CommandEmpty>
                      <div className="p-2">
                        <p className="text-sm text-muted-foreground mb-2">No contributor found.</p>
                      </div>
                    </CommandEmpty>
                    <CommandGroup>
                      {allOptions.map(option => {
                        const isSelected =
                          'isUser' in option
                            ? false // Users are selected via their contributor ID, handled in logic
                            : selectedContributors.includes(option._id as Id<'contributors'>)

                        return (
                          <CommandItem
                            key={option._id}
                            value={option.name}
                            onSelect={() => {
                              if (isEditingContributors) {
                                if (!('isUser' in option) && !option.userId) {
                                  handleDeleteContributor(option._id as Id<'contributors'>)
                                }
                                return
                              }

                              if ('isUser' in option) {
                                toggleUser(option.userId as Id<'users'>, option.name)
                              } else {
                                toggleContributor(option._id as Id<'contributors'>)
                              }
                            }}>
                            {isEditingContributors ? (
                              <div className="flex items-center justify-center w-4 mr-2">
                                {!('isUser' in option) && !option.userId && (
                                  <span className="text-destructive hover:text-destructive/80 cursor-pointer">
                                    <span className="sr-only">Delete</span>×
                                  </span>
                                )}
                              </div>
                            ) : (
                              <Check className={cn('mr-2 size-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                            )}
                            <span className={cn(isEditingContributors && !('isUser' in option) && 'text-destructive')}>
                              {option.name}
                            </span>
                            {'isUser' in option && (
                              <span className="ml-2 text-xs text-muted-foreground">(Collaborator)</span>
                            )}
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
                <div className="p-2 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new person..."
                      className="h-8 text-sm"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleCreateContributor(e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex flex-wrap gap-1">
              {selectedContributors.map(id => {
                const c = contributors.find(con => con._id === id)
                return c ? (
                  <span
                    key={c._id}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1">
                    {c.name}
                    <button
                      type="button"
                      onClick={() => toggleContributor(c._id)}
                      className="hover:text-destructive ml-1">
                      ×
                    </button>
                  </span>
                ) : null
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag()
                }
              }}
              placeholder="Add tag (press Enter)"
              aria-label="Add tag"
            />
            <Button type="button" onClick={addTag} variant="secondary">
              Add
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                    className="hover:text-destructive">
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

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

          <DialogFooter>
            <Button type="submit">Save Entry</Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <Dialog open={!!contributorToDelete} onOpenChange={open => !open && setContributorToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete this contributor. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContributorToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteContributor}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
