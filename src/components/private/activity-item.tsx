import { formatTimeAgo } from '@/lib/utils/format'
import type { LucideIcon } from 'lucide-react'

export function ActivityItem({
  description,
  timestamp,
  icon: Icon,
}: {
  description: string
  timestamp: number
  icon: LucideIcon
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm">{description}</div>
        <div className="text-xs text-muted-foreground mt-1">{formatTimeAgo(timestamp)}</div>
      </div>
    </div>
  )
}
