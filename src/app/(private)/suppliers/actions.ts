'use server'

import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { revalidatePath } from 'next/cache'

export async function createSupplierAction(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const websiteUrl = String(formData.get('websiteUrl') ?? '').trim() || undefined
  if (!name) return
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return
  const me = await fetchQuery(api.users.getByWorkosUserId, { workosUserId: user.id })
  if (!me) return
  await fetchMutation(api.suppliers.create, { name, websiteUrl, createdBy: me._id })
  revalidatePath('/suppliers')
}
