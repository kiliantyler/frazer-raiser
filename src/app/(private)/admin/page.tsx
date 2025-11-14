import { EmptyState } from '@/components/private/empty-state'
import { PageHeader } from '@/components/private/page-header'
import { SectionCard } from '@/components/private/section-card'
import { StatCard } from '@/components/private/stat-card'
import { Button } from '@/components/ui/button'
import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchQuery } from 'convex/nextjs'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type Role = 'ADMIN' | 'COLLABORATOR' | 'VIEWER'

type AppUser = {
  _id: string
  email: string
  name: string
  avatarUrl?: string
  role: Role
}

export default async function AdminPage() {
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) {
    redirect('/')
  }

  const me = (await fetchQuery(api.users.getByWorkosUserId, {
    workosUserId: user.id,
  })) as AppUser | null

  if (!me || me.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [users, tasksTodo, tasksInProgress, tasksBlocked, tasksDone, publishedUpdates] = await Promise.all([
    fetchQuery(api.users.list, {}),
    fetchQuery(api.tasks.listByStatus, { status: 'todo' }),
    fetchQuery(api.tasks.listByStatus, { status: 'in_progress' }),
    fetchQuery(api.tasks.listByStatus, { status: 'blocked' }),
    fetchQuery(api.tasks.listByStatus, { status: 'done' }),
    fetchQuery(api.updates.listPublic, {}),
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
      <PageHeader
        title="Admin"
        description="Administer collaborators, content, and key project data from a single place."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Collaborators" value={totalUsers} />
        <StatCard title="Admins" value={totalAdmins} valueClassName="text-emerald-500" />
        <StatCard title="Tasks" value={totalTasks} />
        <StatCard title="Published Updates" value={totalPublishedUpdates} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SectionCard title="People & Access" viewAllHref="/collaborators">
          <p className="text-sm text-muted-foreground">
            Manage who can access the private dashboard and adjust collaborator roles across the project.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline" aria-label="Manage collaborators and roles">
              <Link href="/collaborators">Manage collaborators</Link>
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Project Data">
          <p className="text-sm text-muted-foreground">
            Quickly jump to the core data powering the project: tasks, parts, suppliers, and work logs.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline" aria-label="Go to tasks management">
              <Link href="/tasks">Tasks</Link>
            </Button>
            <Button asChild size="sm" variant="outline" aria-label="Go to parts and costs management">
              <Link href="/parts-costs">Parts &amp; costs</Link>
            </Button>
            <Button asChild size="sm" variant="outline" aria-label="Go to suppliers management">
              <Link href="/suppliers">Suppliers</Link>
            </Button>
            <Button asChild size="sm" variant="outline" aria-label="Go to work log">
              <Link href="/work-log">Work log</Link>
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Media & Story" viewAllHref="/internal-gallery" className="md:col-span-2">
          <p className="text-sm text-muted-foreground">
            Curate the project story and visuals that appear on the public site and internal dashboards.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline" aria-label="Go to internal gallery">
              <Link href="/internal-gallery">Internal gallery</Link>
            </Button>
            <Button asChild size="sm" variant="outline" aria-label="View public updates">
              <Link href="/updates">Public updates</Link>
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Site Settings" viewAllHref="/settings" className="md:col-span-2">
          <p className="text-sm text-muted-foreground">
            Configure high-level settings for the private dashboard and integrations.
          </p>
          <div className="mt-4">
            <EmptyState message="Most configuration lives in code today. Use settings for runtime tweaks." />
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
