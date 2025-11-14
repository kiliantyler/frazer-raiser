import { FormCard } from '@/components/private/form-card'
import { PageHeader } from '@/components/private/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchQuery } from 'convex/nextjs'
import { redirect } from 'next/navigation'
import { updateBudgetAction } from './actions'

export default async function SettingsPage() {
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) {
    redirect('/')
  }

  const me = await fetchQuery(api.users.getByWorkosUserId, {
    workosUserId: user.id,
  })

  if (!me) {
    redirect('/')
  }

  const isAdmin = me.role === 'ADMIN'
  const settings = await fetchQuery(api.settings.get, {})
  const budgetDollars = settings.budgetCents / 100

  return (
    <section className="space-y-6">
      <PageHeader title="Settings" />

      {isAdmin ? (
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
      ) : (
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>Theme is dark by default. Additional settings (gallery curation, integrations status) to follow.</p>
        </div>
      )}
    </section>
  )
}
