import { TasksBoard } from '@/components/private/tasks/tasks-board'
import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchQuery } from 'convex/nextjs'

export default async function TasksPage() {
  // Read request data before any non-deterministic libs (Convex) to satisfy Next RSC constraint
  await withAuth({ ensureSignedIn: true })

  const tasks = await fetchQuery(api.tasks.list, {})

  return (
    <section className="h-[calc(100vh-8rem)] overflow-x-auto">
      <TasksBoard initialTasks={tasks} />
    </section>
  )
}
