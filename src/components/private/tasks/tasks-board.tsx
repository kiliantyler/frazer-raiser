'use client'

import { updateTaskStatusAction } from '@/app/(private)/tasks/actions'
import { TaskCard } from '@/components/private/tasks/task-item-card'
import { TasksByStatusList } from '@/components/private/tasks/tasks-by-status-list'
import type { TaskListItem } from '@/types/tasks'
import type { Id } from '@convex/_generated/dataModel'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface TasksBoardProps {
  initialTasks: TaskListItem[]
}

export function TasksBoard({ initialTasks }: TasksBoardProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [activeId, setActiveId] = useState<Id<'tasks'> | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTasks(initialTasks)
    setMounted(true)
  }, [initialTasks])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as Id<'tasks'>)
  }, [])

  const handleDragOver = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over) return

      const taskId = active.id as Id<'tasks'>
      const activeTask = tasks.find(t => t._id === taskId)
      if (!activeTask) return

      const overId = over.id
      // If over a container (status string)
      if (['todo', 'in_progress', 'blocked', 'done'].includes(overId as string)) {
        const newStatus = overId as TaskListItem['status']
        if (activeTask.status !== newStatus) {
          setTasks(prev =>
            prev.map(t => {
              if (t._id === taskId) {
                return { ...t, status: newStatus }
              }
              return t
            }),
          )
        }
      } else {
        // If over another task
        const overTask = tasks.find(t => t._id === overId)
        if (overTask && activeTask.status !== overTask.status) {
          setTasks(prev =>
            prev.map(t => {
              if (t._id === taskId) {
                return { ...t, status: overTask.status }
              }
              return t
            }),
          )
        }
      }
    },
    [tasks],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active } = event
      const taskId = active.id as Id<'tasks'>
      const task = tasks.find(t => t._id === taskId)

      setActiveId(null)

      if (!task) return

      // We only need to persist the status change if it's different from initial
      // But since we're optimistic, we just check if the *current* state status matches the *server* status?
      // Actually, we should just fire the update. The optimistic state is already set in DragOver.

      // Wait, if we drop, we want to make sure we persist the final status.
      // The `tasks` state has the *new* status because of DragOver.

      // Let's just send the update.
      const formData = new FormData()
      formData.append('taskId', taskId)
      formData.append('status', task.status)
      updateTaskStatusAction(formData)
    },
    [tasks],
  )

  const todoTasks = tasks.filter(t => t.status === 'todo')
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress')
  const blockedTasks = tasks.filter(t => t.status === 'blocked')
  const doneTasks = tasks.filter(t => t.status === 'done')

  const activeTask = activeId ? tasks.find(t => t._id === activeId) : null

  return (
    <DndContext
      id="tasks-board"
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      <div className="flex h-full min-w-max gap-6 pb-4">
        <div className="w-80 shrink-0">
          <TasksByStatusList title="To do" status="todo" tasks={todoTasks} />
        </div>
        <div className="w-80 shrink-0">
          <TasksByStatusList title="In progress" status="in_progress" tasks={inProgressTasks} />
        </div>
        <div className="w-80 shrink-0">
          <TasksByStatusList title="Blocked" status="blocked" tasks={blockedTasks} />
        </div>
        <div className="w-80 shrink-0">
          <TasksByStatusList title="Done" status="done" tasks={doneTasks} />
        </div>
      </div>
      {mounted &&
        createPortal(
          <DragOverlay>{activeTask ? <TaskCard task={activeTask} isOverlay /> : null}</DragOverlay>,
          document.body,
        )}
    </DndContext>
  )
}
