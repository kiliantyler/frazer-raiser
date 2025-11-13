import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchQuery } from 'convex/nextjs'
import { Camera, Clock, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diffMs = now - timestamp
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
  }
  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
  }
  if (diffDays === 1) {
    return 'Yesterday'
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`
  }
  if (diffDays < 14) {
    return '1 week ago'
  }
  if (diffDays < 21) {
    return '2 weeks ago'
  }
  return `${Math.floor(diffDays / 7)} weeks ago`
}

function formatDueDate(dueDate: number): string {
  const now = Date.now()
  const diffMs = dueDate - now
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return 'Overdue'
  }
  if (diffDays === 0) {
    return 'Due today'
  }
  if (diffDays === 1) {
    return 'Due: 1 Day'
  }
  if (diffDays < 7) {
    return `Due: ${diffDays} Days`
  }
  if (diffDays < 14) {
    return 'Due: 1 Week'
  }
  if (diffDays < 21) {
    return 'Due: 2 Weeks'
  }
  return `Due: ${Math.floor(diffDays / 7)} Weeks`
}

function getActivityIcon(description: string) {
  const lower = description.toLowerCase()
  if (lower.includes('order') || lower.includes('purchas') || lower.includes('bought')) {
    return ShoppingCart
  }
  if (lower.includes('photo') || lower.includes('upload') || lower.includes('image')) {
    return Camera
  }
  return Clock
}

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
  const budgetPercent = Math.min((totalSpentCents / budgetCents) * 100, 100)
  const spentPercent = Math.min((totalSpentCents / budgetCents) * 100, 100)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">1948 Frazer Restoration Dashboard</h1>
        <p className="text-muted-foreground">An overview of project status, spending, and recent activity.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Spending Summary */}
        <Card className="border-border/40 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Spending Summary</CardTitle>
            <Link href="/parts-costs" className="text-sm text-muted-foreground hover:text-foreground">
              View All
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-3xl font-bold">
                {totalSpent.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Budget</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-muted-foreground/20" style={{ width: `${budgetPercent}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Spent</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-destructive" style={{ width: `${spentPercent}%` }} />
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {budget.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{' '}
              Budgeted
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="border-border/40 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
            <Link href="/tasks" className="text-sm text-muted-foreground hover:text-foreground">
              View All
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming tasks</p>
            ) : (
              upcomingTasks.map((task, index) => (
                <div key={task._id} className={`rounded-md p-3 ${index === 0 ? 'bg-muted/50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{task.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{formatDueDate(task.dueDate)}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/40 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <Link href="/work-log" className="text-sm text-muted-foreground hover:text-foreground">
              View All
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            ) : (
              recentActivity.map(activity => {
                const Icon = getActivityIcon(activity.description)
                return (
                  <div key={activity._id} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">{activity.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">{formatTimeAgo(activity.date)}</div>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Latest Photos */}
        <Card className="border-border/40 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Latest Photos</CardTitle>
            <Link href="/internal-gallery" className="text-sm text-muted-foreground hover:text-foreground">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            {latestImages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No photos yet</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {latestImages.map(image => (
                  <div key={image._id} className="relative aspect-square overflow-hidden rounded-md bg-muted">
                    <Image
                      src={image.url}
                      alt="Project photo"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
