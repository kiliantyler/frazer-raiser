import { formatCurrency } from '@/lib/utils/format'
import { Wrench } from 'lucide-react'

type TimelinePartContentProps = {
  title: string
  priceCents: number
  vendor?: string
}

export function TimelinePartContent({ title, priceCents, vendor }: TimelinePartContentProps) {
  return (
    <div className="relative flex flex-col gap-1.5 rounded-xl border border-border/50 bg-card p-4 shadow-sm backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex size-5 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Wrench className="size-3" />
            </div>
            <h3 className="font-medium text-foreground leading-snug">{title}</h3>
          </div>
          {vendor && (
            <p className="text-xs text-muted-foreground pl-7">
              from <span className="font-medium text-foreground/80">{vendor}</span>
            </p>
          )}
        </div>
        <div className="text-sm font-semibold tabular-nums text-foreground">{formatCurrency(priceCents)}</div>
      </div>
    </div>
  )
}
