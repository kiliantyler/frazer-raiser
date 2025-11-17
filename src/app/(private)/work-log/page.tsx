import { PageHeader } from '@/components/private/page-header'
import { WorkLogForm } from '@/components/private/work-log/work-log-form'
import { WorkLogList } from '@/components/private/work-log/work-log-list'
import { getWorkLogByDateRange } from '@/lib/data/work-log'
import { formatCurrency } from '@/lib/utils/format'
import type { WorkLogItem } from '@/types/work-log'
import { withAuth } from '@workos-inc/authkit-nextjs'

export default async function WorkLogPage() {
  // Read request data before any non-deterministic operations (Date.now) to satisfy Next RSC constraint
  await withAuth({ ensureSignedIn: true })
  const now = Date.now()
  const thirtyDays = 1000 * 60 * 60 * 24 * 30
  const items = (await getWorkLogByDateRange(now - thirtyDays, now)) as WorkLogItem[]
  const totalHours = items.reduce((sum: number, it: WorkLogItem) => sum + it.hours, 0)
  const totalCostDelta = items.reduce((sum: number, it: WorkLogItem) => sum + (it.costDeltaCents ?? 0), 0)
  return (
    <section className="space-y-6">
      <PageHeader title="Work Log" />
      <WorkLogForm />
      <div className="text-sm text-muted-foreground">
        Last 30 days: {totalHours.toFixed(1)} hours • {formatCurrency(totalCostDelta)}
      </div>
      <WorkLogList items={items} />
    </section>
  )
}
