import { EmptyState } from '@/components/private/empty-state'
import { TaskDialog } from '@/components/private/tasks/task-dialog'
import { TaskItemCard } from '@/components/private/tasks/task-item-card'
import { WorkLogDialog } from '@/components/private/work-log/work-log-dialog'
import type { TaskListItem } from '@/types/tasks'
import type { WorkLogItem } from '@/types/work-log'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'

interface TasksByStatusListProps {
  title: string
  status: string
  tasks: TaskListItem[]
}

export function TasksByStatusList({ title, status, tasks }: TasksByStatusListProps) {
  const [workLogDraft, setWorkLogDraft] = useState<Partial<WorkLogItem> | null>(null)
  const [editingTask, setEditingTask] = useState<TaskListItem | null>(null)
  const { setNodeRef } = useDroppable({
    id: status,
  })

  return (
    <div ref={setNodeRef} className="flex h-full flex-col space-y-3 rounded-lg bg-muted/50 p-4">
      <h3 className="font-serif text-lg">{title}</h3>
      <div className="flex-1 space-y-3">
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <EmptyState message="No tasks" />
          ) : (
            tasks.map((t: TaskListItem) => (
              <TaskItemCard
                key={t._id}
                task={t}
                onEdit={() => setEditingTask(t)}
                onLogWork={() => {
                  setWorkLogDraft({
                    title: t.title,
                    description: t.description,
                    taskId: t._id,
                    tags: t.tags,
                  })
                }}
              />
            ))
          )}
        </SortableContext>
      </div>

      {workLogDraft && (
        <WorkLogDialog
          initialData={workLogDraft}
          open={!!workLogDraft}
          onOpenChange={open => !open && setWorkLogDraft(null)}
          trigger={null}
        />
      )}

      {editingTask && (
        <TaskDialog
          initialData={editingTask}
          open={!!editingTask}
          onOpenChange={open => !open && setEditingTask(null)}
          trigger={null}
        />
      )}
    </div>
  )
}
