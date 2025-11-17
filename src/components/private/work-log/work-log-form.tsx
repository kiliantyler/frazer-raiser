import { addWorkLogAction } from '@/app/(private)/work-log/actions'
import { FormCard } from '@/components/private/form-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function WorkLogForm() {
  return (
    <FormCard title="Add Work Log Entry">
      <form action={addWorkLogAction} className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <Input name="description" placeholder="Description" aria-label="Description" />
        <Input name="hours" type="number" step="0.25" placeholder="Hours" aria-label="Hours" />
        <Input name="costDeltaCents" type="number" placeholder="Cost delta (cents)" aria-label="Cost change in cents" />
        <Button type="submit">Add</Button>
      </form>
    </FormCard>
  )
}
