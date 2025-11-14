import { formatCurrency } from '@/lib/utils/format'
import { SectionCard } from './section-card'

export function SpendingSummary({
  totalSpent,
  budget,
  totalSpentCents,
  budgetCents,
}: {
  totalSpent: number
  budget: number
  totalSpentCents: number
  budgetCents: number
}) {
  const budgetPercent = Math.min((totalSpentCents / budgetCents) * 100, 100)
  const spentPercent = Math.min((totalSpentCents / budgetCents) * 100, 100)

  return (
    <SectionCard title="Spending Summary" viewAllHref="/parts-costs">
      <div className="space-y-4">
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
          {formatCurrency(budgetCents)} Budgeted
        </div>
      </div>
    </SectionCard>
  )
}

