import { ActivityItem } from '@/components/private/activity-item'
import { EmptyState } from '@/components/private/empty-state'
import { ImageGrid } from '@/components/private/image-grid'
import { PageHeader } from '@/components/private/page-header'
import { SectionCard } from '@/components/private/section-card'
import { SpendingSummary } from '@/components/private/spending-summary'
import { TaskItem } from '@/components/private/task-item'
import { getActivityIcon } from '@/lib/utils/activity-icon'
import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchQuery } from 'convex/nextjs'

export default async function DashboardPage() {
  // Access request data first to ensure deterministic rendering
  await withAuth({ ensureSignedIn: true })

  const [upcomingTasks, parts, recentActivity, latestImages] = await Promise.all([
    fetchQuery(api.tasks.listUpcoming, { limit: 4 }),
    fetchQuery(api.parts.list, {}),
    fetchQuery(api.worklog.listRecent, { limit: 3 }),
    fetchQuery(api.images.listLatest, { limit: 4, visibility: 'private' }),
  ])

  const totalSpentCents = parts.reduce((sum, p) => sum + p.priceCents, 0)
  const totalSpent = totalSpentCents / 100
  const budgetCents = 2500000 // $25,000 budget
  const budget = budgetCents / 100

  return (
    <div className="space-y-6">
      <PageHeader
        title="1948 Frazer Restoration Dashboard"
        description="An overview of project status, spending, and recent activity."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <SpendingSummary
          totalSpent={totalSpent}
          budget={budget}
          totalSpentCents={totalSpentCents}
          budgetCents={budgetCents}
        />

        <SectionCard title="Upcoming Tasks" viewAllHref="/tasks">
          <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <EmptyState message="No upcoming tasks" />
            ) : (
              upcomingTasks.map((task, index) => (
                <TaskItem key={task._id} title={task.title} dueDate={task.dueDate} highlighted={index === 0} />
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard title="Recent Activity" viewAllHref="/work-log">
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <EmptyState message="No recent activity" />
            ) : (
              recentActivity.map(activity => {
                const Icon = getActivityIcon(activity.description)
                return (
                  <ActivityItem
                    key={activity._id}
                    description={activity.description}
                    timestamp={activity.date}
                    icon={Icon}
                  />
                )
              })
            )}
          </div>
        </SectionCard>

        <SectionCard title="Latest Photos" viewAllHref="/internal-gallery">
          <ImageGrid images={latestImages} />
        </SectionCard>
      </div>
    </div>
  )
}
