import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDueDate } from '@/lib/utils/format'
import type { TaskListItem } from '@/types/tasks'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Clock, Pencil } from 'lucide-react'
import { forwardRef } from 'react'

interface TaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
  task: TaskListItem
  onEdit?: () => void
  onLogWork?: () => void
  isOverlay?: boolean
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, onEdit, onLogWork, isOverlay, style, className, ...props }, ref) => {
    const isOverdue = task.dueDate && task.dueDate < Date.now() && task.status !== 'done'

    return (
      <div
        ref={ref}
        style={style}
        className={`group relative flex flex-col gap-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-all hover:bg-accent/50 ${
          isOverlay ? 'cursor-grabbing shadow-xl rotate-2 scale-105' : ''
        } ${className}`}
        {...props}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{task.title}</span>
              {task.dueDate && (
                <span className={`text-sm ${isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                  Due {formatDueDate(task.dueDate)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-full px-2 py-0 text-xs font-normal capitalize">
                {task.priority}
              </Badge>
              <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs font-normal capitalize">
                {task.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {/* Placeholder for assignee if available in the future */}
          </div>

          <div
            className={`flex gap-1 transition-opacity ${isOverlay ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit} title="Log Work">
              <Clock className="size-4" />
              <span className="sr-only">Log Work</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onLogWork} title="Edit">
              <Pencil className="size-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </div>
        </div>
      </div>
    )
  },
)
TaskCard.displayName = 'TaskCard'

interface TaskItemCardProps {
  task: TaskListItem
  onEdit: () => void
  onLogWork: () => void
}

export function TaskItemCard({ task, onEdit, onLogWork }: TaskItemCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
    data: {
      type: 'Task',
      task,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <TaskCard
      ref={setNodeRef}
      style={style}
      task={task}
      onEdit={onEdit}
      onLogWork={onLogWork}
      {...listeners}
      {...attributes}
    />
  )
}
