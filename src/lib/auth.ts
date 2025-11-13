import { withAuth } from '@workos-inc/authkit-nextjs'

export type CurrentUser = {
  id: string
  email: string
  firstName?: string
  lastName?: string
  image?: string
} | null

export async function getCurrentUserOrNull(): Promise<CurrentUser> {
  const { user } = await withAuth({ ensureSignedIn: false })
  if (!user) return null
  return {
    id: user.id,
    email: user.email ?? '',
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    image: user.profilePictureUrl ?? undefined,
  }
}
