import { ActivityItem } from '@/components/private/activity-item'
import { EmptyState } from '@/components/private/empty-state'
import { ImageGrid } from '@/components/private/image-grid'
import { JournalUpdatesPreview } from '@/components/private/journal-updates-preview'
import { SectionCard } from '@/components/private/section-card'
import { SpendingSummary } from '@/components/private/spending-summary'
import { TaskItem } from '@/components/private/task-item'
import {
  getLatestImages,
  getParts,
  getRecentActivity,
  getRecentUpdates,
  getSettings,
  getUpcomingTasks,
} from '@/lib/data/dashboard'
import { getActivityIcon } from '@/lib/utils/activity-icon'
import { withAuth } from '@workos-inc/authkit-nextjs'

export default async function DashboardPage() {
  // Access request data first to ensure deterministic rendering
  await withAuth({ ensureSignedIn: true })

  const [upcomingTasks, parts, recentActivity, latestImages, settings, recentUpdates] = await Promise.all([
    getUpcomingTasks(4),
    getParts(),
    getRecentActivity(3),
    getLatestImages(4, 'private'),
    getSettings(),
    getRecentUpdates(),
  ])

  const activeParts = parts.filter(p => p.status !== 'cancelled')
  const totalSpentCents = activeParts.reduce((sum, p) => sum + p.priceCents * (p.quantity ?? 1), 0)
  const totalSpent = totalSpentCents / 100
  const budgetCents = settings.budgetCents
  const budget = budgetCents / 100

  return (
    <div className="space-y-6">
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

        <SectionCard title="Journal Updates" viewAllHref="/journal">
          <JournalUpdatesPreview updates={recentUpdates} />
        </SectionCard>
      </div>
    </div>
  )
}
