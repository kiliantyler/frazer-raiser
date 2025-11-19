import { AdminSections } from '@/components/private/admin/admin-sections'
import { AdminStats } from '@/components/private/admin/admin-stats'
import { getPublishedUpdates, getTasksByStatus, getUserByWorkosUserId, getUsers } from '@/lib/data/admin'
import type { AppUser } from '@/types/users'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) {
    redirect('/')
  }

  const me = (await getUserByWorkosUserId(user.id)) as AppUser | null

  if (!me || me.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [users, tasksTodo, tasksInProgress, tasksBlocked, tasksDone, publishedUpdates] = await Promise.all([
    getUsers(),
    getTasksByStatus('todo'),
    getTasksByStatus('in_progress'),
    getTasksByStatus('blocked'),
    getTasksByStatus('done'),
    getPublishedUpdates(),
  ])

  const totalTasks =
    (tasksTodo as Array<unknown>).length +
    (tasksInProgress as Array<unknown>).length +
    (tasksBlocked as Array<unknown>).length +
    (tasksDone as Array<unknown>).length

  const totalUsers = (users as AppUser[]).length
  const totalAdmins = (users as AppUser[]).filter(u => u.role === 'ADMIN').length

  const totalPublishedUpdates = (publishedUpdates as Array<unknown>).length

  return (
    <div className="space-y-6">
      <AdminStats
        totalUsers={totalUsers}
        totalAdmins={totalAdmins}
        totalTasks={totalTasks}
        totalPublishedUpdates={totalPublishedUpdates}
      />

      <AdminSections />
    </div>
  )
}
