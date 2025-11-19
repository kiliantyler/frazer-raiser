import { TasksByStatus } from '@/components/private/tasks/tasks-by-status'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { withAuth } from '@workos-inc/authkit-nextjs'

export default async function TasksPage() {
  // Read request data before any non-deterministic libs (Convex) to satisfy Next RSC constraint
  await withAuth({ ensureSignedIn: true })
  return (
    <section className="space-y-6">
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
