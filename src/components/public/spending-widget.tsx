import { formatCurrency } from '@/lib/utils/format'
import { DollarSign } from 'lucide-react'

export function SpendingWidget({ amount }: { amount: number }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 text-sm shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-center rounded-full bg-primary/10 p-1 text-primary">
        <DollarSign className="size-3.5" />
      </div>
      <div className="flex gap-1.5">
        <span className="text-muted-foreground">Current Spent:</span>
        <span className="font-semibold text-foreground tabular-nums">{formatCurrency(amount)}</span>
      </div>
    </div>
  )
}
