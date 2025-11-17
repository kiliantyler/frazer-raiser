import { PageHeader } from '@/components/private/page-header'
import { BudgetForm } from '@/components/private/settings/budget-form'
import { getSettings } from '@/lib/data/settings'
import { getUserByWorkosUserId } from '@/lib/data/users'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) {
    redirect('/')
  }

  const me = await getUserByWorkosUserId(user.id)

  if (!me) {
    redirect('/')
  }

  const isAdmin = me.role === 'ADMIN'
  const settings = await getSettings()
  const budgetDollars = settings.budgetCents / 100

  return (
    <section className="space-y-6">
      <PageHeader title="Settings" />

      {isAdmin ? (
        <BudgetForm budgetDollars={budgetDollars} />
      ) : (
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>Theme is dark by default. Additional settings (gallery curation, integrations status) to follow.</p>
        </div>
      )}
    </section>
  )
}
