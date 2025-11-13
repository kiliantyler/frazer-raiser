'use server'

import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { revalidatePath } from 'next/cache'

export async function addWorkLogAction(formData: FormData) {
  const description = String(formData.get('description') ?? '').trim()
  const hours = Number(formData.get('hours') ?? 0)
  const costDeltaCents = formData.get('costDeltaCents')
  if (!description || Number.isNaN(hours)) return
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return
  const me = await fetchQuery(api.users.getByWorkosUserId, { workosUserId: user.id })
  if (!me) return
  await fetchMutation(api.worklog.addEntry, {
    date: Date.now(),
    hours,
    description,
    taskId: undefined,
    partId: undefined,
    costDeltaCents: costDeltaCents ? Number(costDeltaCents) : undefined,
    authorId: me._id,
  })
  revalidatePath('/work-log')
}
