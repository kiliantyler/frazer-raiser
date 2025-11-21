'use client'

import { createTaskAction, updateTaskAction } from '@/app/(private)/tasks/actions'
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
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useDialogState } from '@/hooks/use-dialog-state'
import type { TaskListItem } from '@/types/tasks'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { useState } from 'react'

interface TaskDialogProps {
  initialData?: TaskListItem
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TaskDialog({ initialData, trigger, open: controlledOpen, onOpenChange }: TaskDialogProps) {
  const { open, setOpen } = useDialogState({ controlledOpen, onOpenChange })
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger !== null && (
        <DialogTrigger asChild>
          {trigger === undefined ? (
            <Button>
              <Plus className="mr-2 size-4" />
              Add Task
            </Button>
          ) : (
            trigger
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Task' : 'Add Task'}</DialogTitle>
          <DialogDescription>Manage your task details.</DialogDescription>
        </DialogHeader>
        <form
          action={async formData => {
            if (initialData) {
              await updateTaskAction(formData)
            } else {
              await createTaskAction(formData)
            }
            setOpen(false)
            if (!initialData) {
              setTags([])
            }
          }}
          className="space-y-4 py-4">
          {initialData && <input type="hidden" name="taskId" value={initialData._id} />}

          <Input name="title" placeholder="Task title" required defaultValue={initialData?.title} />

          <Textarea name="description" placeholder="Description" defaultValue={initialData?.description} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="task-priority">Priority</Label>
              <Select name="priority" defaultValue={initialData?.priority || 'medium'}>
                <SelectTrigger id="task-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-due-date">Due Date</Label>
              <Input
                id="task-due-date"
                name="dueDate"
                type="date"
                defaultValue={initialData?.dueDate ? format(initialData.dueDate, 'yyyy-MM-dd') : undefined}
              />
            </div>
          </div>

          <TagInput tags={tags} onTagsChange={setTags} />
          <input type="hidden" name="tags" value={tags.join(',')} />

          <DialogFooter>
            <Button type="submit">Save Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
