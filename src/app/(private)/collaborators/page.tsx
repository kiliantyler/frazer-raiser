import { CollaboratorsTable } from '@/components/private/collaborators/collaborators-table'
import { getUserByWorkosUserId, getUsers } from '@/lib/data/users'
import type { Collaborator } from '@/types/users'
import { withAuth } from '@workos-inc/authkit-nextjs'

export default async function CollaboratorsPage() {
  const { user } = await withAuth({ ensureSignedIn: true })
  const me = user ? await getUserByWorkosUserId(user.id) : null
  const canAdmin = me?.role === 'ADMIN'
  const users = (await getUsers()) as Collaborator[]
  return (
    <section className="space-y-6">
      <CollaboratorsTable collaborators={users} canAdmin={canAdmin} />
    </section>
  )
}
