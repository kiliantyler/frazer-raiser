'use server'

import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { revalidatePath } from 'next/cache'

export async function updateBudgetAction(formData: FormData) {
  const budgetDollars = Number(formData.get('budget') ?? 0)
  const budgetCents = Math.round(budgetDollars * 100)
  if (Number.isNaN(budgetCents) || budgetCents < 0) return

  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return

  const me = await fetchQuery(api.users.getByWorkosUserId, { workosUserId: user.id })
  if (!me || me.role !== 'ADMIN') return

  await fetchMutation(api.settings.updateBudget, {
    actorUserId: me._id,
    budgetCents,
  })

  revalidatePath('/settings')
  revalidatePath('/dashboard')
}
