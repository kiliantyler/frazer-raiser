import { updateBudgetAction } from '@/app/(private)/settings/actions'
import { FormCard } from '@/components/private/form-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type BudgetFormProps = {
  budgetDollars: number
}

export function BudgetForm({ budgetDollars }: BudgetFormProps) {
  return (
    <FormCard title="Budget">
      <form action={updateBudgetAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="budget">Project Budget (USD)</Label>
          <Input
            id="budget"
            name="budget"
            type="number"
            step="0.01"
            min="0"
            defaultValue={budgetDollars}
            required
            aria-label="Project budget in US dollars"
          />
          <p className="text-sm text-muted-foreground">
            Set the total project budget. This value is used to calculate spending progress on the dashboard.
          </p>
        </div>
        <Button type="submit" aria-label="Save budget setting">
          Save Budget
        </Button>
      </form>
    </FormCard>
  )
}
