import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchQuery } from 'convex/nextjs'
import { addWorkLogAction } from './actions'

export default async function WorkLogPage() {
  // Read request data before any non-deterministic operations (Date.now) to satisfy Next RSC constraint
  await withAuth({ ensureSignedIn: true })
  const now = Date.now()
  const thirtyDays = 1000 * 60 * 60 * 24 * 30
  type WorkLogItem = { _id: string; date: number; hours: number; description: string; costDeltaCents?: number }
  const items = (await fetchQuery(api.worklog.listByDateRange, { from: now - thirtyDays, to: now })) as WorkLogItem[]
  const totalHours = items.reduce((sum: number, it: WorkLogItem) => sum + it.hours, 0)
  const totalCostDelta = items.reduce((sum: number, it: WorkLogItem) => sum + (it.costDeltaCents ?? 0), 0)
  return (
    <section className="space-y-6">
      <h1 className="font-serif text-2xl">Work Log</h1>
      <form action={addWorkLogAction} className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <Input name="description" placeholder="Description" aria-label="Description" />
        <Input name="hours" type="number" step="0.25" placeholder="Hours" aria-label="Hours" />
        <Input name="costDeltaCents" type="number" placeholder="Cost delta (cents)" aria-label="Cost change in cents" />
        <Button type="submit">Add</Button>
      </form>
      <div className="text-sm text-muted-foreground">
        Last 30 days: {totalHours.toFixed(1)} hours • ${(totalCostDelta / 100).toFixed(2)}
      </div>
      <ul className="space-y-2">
        {items.map((it: WorkLogItem) => (
          <li key={String(it._id)} className="text-sm">
            {new Date(it.date).toLocaleDateString()} — {it.description} • {it.hours}h{' '}
            {it.costDeltaCents ? `• $${(it.costDeltaCents / 100).toFixed(2)}` : ''}
          </li>
        ))}
      </ul>
    </section>
  )
}
