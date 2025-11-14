'use server'

import { env } from '@/env'
import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { revalidatePath } from 'next/cache'

export async function updateProfileAction(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const avatarUrl = String(formData.get('avatarUrl') ?? '').trim() || undefined

  if (!name || !email) return

  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return

  const me = await fetchQuery(api.users.getByWorkosUserId, { workosUserId: user.id })
  if (!me) return

  // Update in Convex
  await fetchMutation(api.users.updateProfile, {
    userId: me._id,
    name,
    email,
    avatarUrl,
  })

  // Sync to WorkOS if API key is available
  try {
    if (env.WORKOS_API_KEY) {
      const { WorkOS } = await import('@workos-inc/node')
      const workos = new WorkOS(env.WORKOS_API_KEY)

      // Parse name into firstName and lastName
      const nameParts = name.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || undefined

      await workos.userManagement.updateUser({
        userId: user.id,
        firstName,
        lastName,
        email,
        ...(avatarUrl && { profilePictureUrl: avatarUrl }),
      })
    }
  } catch (error) {
    // Log error but don't fail the request - Convex update succeeded
    console.error('Failed to sync profile to WorkOS:', error)
  }

  revalidatePath('/profile')
  revalidatePath('/dashboard')
}
