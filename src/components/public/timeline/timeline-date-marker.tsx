import { cn } from '@/lib/utils'

export function TimelineDateMarker({ dateStr, className }: { dateStr: string; className?: string }) {
  const [month, day, year] = dateStr.split(' ')

  return (
    <div className={cn('flex flex-col items-end md:items-end', className)}>
      <div className="flex flex-col items-end md:items-end">
        <span className="text-sm font-bold text-foreground/90 leading-none">
          {month} {day}
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">{year}</span>
      </div>
    </div>
  )
}
