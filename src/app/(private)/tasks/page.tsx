import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchQuery } from 'convex/nextjs'
import { assignToMeAction, createTaskAction, updateTaskStatusAction } from './actions'

type TaskListItem = {
  _id: string
  title: string
  status: 'todo' | 'in_progress' | 'blocked' | 'done'
  priority: 'low' | 'medium' | 'high'
}

async function TasksByStatus({
  status,
  title,
}: {
  status: 'todo' | 'in_progress' | 'blocked' | 'done'
  title: string
}) {
  const tasks = (await fetchQuery(api.tasks.listByStatus, { status })) as TaskListItem[]
  return (
    <div className="space-y-3">
      <h3 className="font-serif text-lg">{title}</h3>
      <div className="space-y-3">
        {tasks.length === 0 ? <p className="text-sm text-muted-foreground">No tasks</p> : null}
        {tasks.map((t: TaskListItem) => (
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
        ))}
      </div>
    </div>
  )
}

export default async function TasksPage() {
  // Read request data before any non-deterministic libs (Convex) to satisfy Next RSC constraint
  await withAuth({ ensureSignedIn: true })
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-serif text-2xl">Tasks</h1>
        <form action={createTaskAction} className="flex gap-2">
          <Input name="title" placeholder="New task title" aria-label="New task title" />
          <Button type="submit">Add Task</Button>
        </form>
      </div>
      <Tabs defaultValue="todo">
        <TabsList>
          <TabsTrigger value="todo">To do</TabsTrigger>
          <TabsTrigger value="in_progress">In progress</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
        </TabsList>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <TabsContent value="todo">
            <TasksByStatus status="todo" title="To do" />
          </TabsContent>
          <TabsContent value="in_progress">
            <TasksByStatus status="in_progress" title="In progress" />
          </TabsContent>
          <TabsContent value="blocked">
            <TasksByStatus status="blocked" title="Blocked" />
          </TabsContent>
          <TabsContent value="done">
            <TasksByStatus status="done" title="Done" />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  )
}
