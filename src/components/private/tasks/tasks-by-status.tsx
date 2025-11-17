import { assignToMeAction, updateTaskStatusAction } from '@/app/(private)/tasks/actions'
import { EmptyState } from '@/components/private/empty-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TaskListItem } from '@/types/tasks'
import { api } from '@convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'

async function getTasksByStatus(status: 'todo' | 'in_progress' | 'blocked' | 'done') {
  'use cache'
  return await fetchQuery(api.tasks.listByStatus, { status })
}

export async function TasksByStatus({
  status,
  title,
}: {
  status: 'todo' | 'in_progress' | 'blocked' | 'done'
  title: string
}) {
  const tasks = (await getTasksByStatus(status)) as TaskListItem[]
  return (
    <div className="space-y-3">
      <h3 className="font-serif text-lg">{title}</h3>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <EmptyState message="No tasks" />
        ) : (
          tasks.map((t: TaskListItem) => (
            <Card key={t._id} className="border-border/40">
              <CardHeader>
                <CardTitle className="text-base">{t.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>
                    {t.status} • {t.priority}
                  </span>
                  <div className="flex items-center gap-2">
                    <form action={assignToMeAction}>
                      <input type="hidden" name="taskId" value={String(t._id)} />
                      <Button type="submit" variant="ghost" className="px-2 text-xs">
                        Assign to me
                      </Button>
                    </form>
                    <form action={updateTaskStatusAction} className="flex items-center gap-1">
                      <input type="hidden" name="taskId" value={String(t._id)} />
                      <select
                        name="status"
                        defaultValue={t.status}
                        className="bg-background border border-border/40 rounded px-2 py-1">
                        <option value="todo">To do</option>
                        <option value="in_progress">In progress</option>
                        <option value="blocked">Blocked</option>
                        <option value="done">Done</option>
                      </select>
                      <Button type="submit" variant="secondary" className="px-2 text-xs">
                        Update
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
