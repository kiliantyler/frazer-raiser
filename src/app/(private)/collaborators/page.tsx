import { CollaboratorRoleSelect } from '@/components/private/collaborator-role-select'
import { EmptyState } from '@/components/private/empty-state'
import { PageHeader } from '@/components/private/page-header'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchQuery } from 'convex/nextjs'
import { updateRoleAction } from './actions'

type Collaborator = {
  _id: string
  email: string
  name: string
  avatarUrl?: string
  role: 'ADMIN' | 'COLLABORATOR' | 'VIEWER'
}

export default async function CollaboratorsPage() {
  const { user } = await withAuth({ ensureSignedIn: true })
  const me = user ? await fetchQuery(api.users.getByWorkosUserId, { workosUserId: user.id }) : null
  const canAdmin = me?.role === 'ADMIN'
  const users = (await fetchQuery(api.users.list, {})) as Collaborator[]
  return (
    <section className="space-y-6">
      <PageHeader title="Collaborators" />
      {users.length === 0 ? (
        <EmptyState message="No collaborators yet" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u: Collaborator) => (
              <TableRow key={String(u._id)}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  {canAdmin ? (
                    <form action={updateRoleAction} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={String(u._id)} />
                      <CollaboratorRoleSelect initialRole={u.role} />
                    </form>
                  ) : (
                    u.role
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  )
}
