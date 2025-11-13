'use server'

import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { revalidatePath } from 'next/cache'

export async function updateRoleAction(formData: FormData) {
  const userId = String(formData.get('userId') ?? '')
  const role = String(formData.get('role') ?? '')
  if (!userId || !role) return
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return
  const me = await fetchQuery(api.users.getByWorkosUserId, { workosUserId: user.id })
  if (!me) return
  await fetchMutation(api.users.updateRole, {
    actorUserId: me._id,
    userId: userId as unknown as Id<'users'>,
    role: role as 'ADMIN' | 'COLLABORATOR' | 'VIEWER',
  })
  revalidatePath('/collaborators')
}
