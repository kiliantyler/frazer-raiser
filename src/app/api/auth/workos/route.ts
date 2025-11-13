import { api } from '@convex/_generated/api'
import { handleAuth } from '@workos-inc/authkit-nextjs'
import { fetchMutation } from 'convex/nextjs'

export const GET = handleAuth({
  returnPathname: '/',
  async onSuccess({ user }) {
    if (!user) return
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || 'User'
    await fetchMutation(api.users.upsert, {
      workosUserId: user.id,
      email: user.email ?? '',
      name,
      avatarUrl: user.profilePictureUrl ?? undefined,
    })
  },
})
