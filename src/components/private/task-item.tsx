import { formatDueDate } from '@/lib/utils/format'

export function TaskItem({ title, dueDate, highlighted }: { title: string; dueDate: number; highlighted?: boolean }) {
  return (
    <div className={`rounded-md p-3 ${highlighted ? 'bg-muted/50' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-muted-foreground mt-1">{formatDueDate(dueDate)}</div>
        </div>
      </div>
    </div>
  )
}
