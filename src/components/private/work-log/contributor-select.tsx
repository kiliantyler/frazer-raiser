'use client'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { Id } from '@convex/_generated/dataModel'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useMemo, useState } from 'react'

interface Contributor {
  _id: Id<'contributors'>
  name: string
  userId?: Id<'users'>
}

interface User {
  _id: Id<'users'>
  name: string
}

interface ContributorSelectProps {
  contributors: Contributor[]
  users: User[]
  selectedContributors: Id<'contributors'>[]
  onToggleContributor: (id: Id<'contributors'>) => void
  onToggleUser: (userId: Id<'users'>, name: string) => Promise<void>
  onCreateContributor: (name: string) => Promise<void>
  onDeleteContributor: (id: Id<'contributors'>) => void
}

export function ContributorSelect({
  contributors,
  users,
  selectedContributors,
  onToggleContributor,
  onToggleUser,
  onCreateContributor,
  onDeleteContributor,
}: ContributorSelectProps) {
  const [contributorOpen, setContributorOpen] = useState(false)
  const [isEditingContributors, setIsEditingContributors] = useState(false)
  const [contributorToDelete, setContributorToDelete] = useState<Id<'contributors'> | null>(null)

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

  const handleDeleteContributor = (id: Id<'contributors'>) => {
    setContributorToDelete(id)
  }

  const confirmDeleteContributor = () => {
    if (contributorToDelete) {
      onDeleteContributor(contributorToDelete)
      setContributorToDelete(null)
    }
  }

  return (
    <>
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
              {selectedContributors.length > 0 ? `${selectedContributors.length} selected` : 'Select contributors...'}
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
                            onToggleUser(option.userId as Id<'users'>, option.name)
                          } else {
                            onToggleContributor(option._id as Id<'contributors'>)
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
                      onCreateContributor(e.currentTarget.value)
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
                  onClick={() => onToggleContributor(c._id)}
                  className="hover:text-destructive ml-1">
                  ×
                </button>
              </span>
            ) : null
          })}
        </div>
      </div>

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
    </>
  )
}
