export type TaskListItem = {
  _id: string
  title: string
  status: 'todo' | 'in_progress' | 'blocked' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignedTo?: string
  assignedToName?: string
  assignedToAvatarUrl?: string
  dueDate?: number
  progressPct?: number
}
