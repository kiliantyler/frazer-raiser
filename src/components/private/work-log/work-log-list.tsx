import { EmptyState } from '@/components/private/empty-state'
import { formatCurrency } from '@/lib/utils/format'
import type { WorkLogItem } from '@/types/work-log'

export function WorkLogList({ items }: { items: Array<WorkLogItem> }) {
  if (items.length === 0) {
    return <EmptyState message="No work log entries yet" />
  }

  return (
    <ul className="space-y-2">
      {items.map((it: WorkLogItem) => (
        <li key={String(it._id)} className="text-sm">
          {new Date(it.date).toLocaleDateString()} — {it.description} • {it.hours}h{' '}
          {it.costDeltaCents ? `• ${formatCurrency(it.costDeltaCents)}` : ''}
        </li>
      ))}
    </ul>
  )
}
