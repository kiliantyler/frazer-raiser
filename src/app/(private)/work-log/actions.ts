'use server'

import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { revalidatePath } from 'next/cache'

export async function addWorkLogAction(formData: FormData) {
  const description = String(formData.get('description') ?? '').trim()
  const title = String(formData.get('title') ?? '').trim()
  const hours = Number(formData.get('hours') ?? 0)
  const costDeltaCents = formData.get('costDeltaCents')
  const tags = String(formData.get('tags') ?? '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)
  const imageIds = (formData.get('imageIds') as string)
    .split(',')
    .map(id => id.trim())
    .filter(Boolean) as Id<'images'>[]

  const contributorIds = (formData.get('contributorIds') as string)
    .split(',')
    .map(id => id.trim())
    .filter(Boolean) as Id<'contributors'>[]

  const taskId = formData.get('taskId') as Id<'tasks'> | null

  if (!title || Number.isNaN(hours)) return
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return
  const me = await fetchQuery(api.users.getByWorkosUserId, { workosUserId: user.id })
  if (!me) return

  // Ensure current user is always included in contributors
  // Create or get existing contributor for current user
  const myContributorId = await fetchMutation(api.contributors.create, {
    name: me.name,
    userId: me._id,
  })
  const finalContributorIds = [...new Set([...contributorIds, myContributorId])]

  await fetchMutation(api.worklog.addEntry, {
    date: Date.now(),
    hours,
    description: description || undefined,
    title,
    tags: tags.length > 0 ? tags : undefined,
    imageIds: imageIds.length > 0 ? imageIds : undefined,
    contributorIds: finalContributorIds.length > 0 ? finalContributorIds : undefined,
    taskId: taskId || undefined,
    partId: undefined,
    costDeltaCents: costDeltaCents ? Math.round(Number(costDeltaCents)) : undefined,
    authorId: me._id,
  })
  revalidatePath('/work-log')
  revalidatePath('/tasks')
}
