import type { Id } from '@convex/_generated/dataModel'

export type TaskListItem = {
  _id: Id<'tasks'>
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'blocked' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignedTo?: string
  assignedToName?: string
  assignedToAvatarUrl?: string
  dueDate?: number
  tags?: string[]
  progressPct?: number
}
