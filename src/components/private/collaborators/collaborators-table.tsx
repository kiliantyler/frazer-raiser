import { updateRoleAction } from '@/app/(private)/collaborators/actions'
import { CollaboratorRoleSelect } from '@/components/private/collaborator-role-select'
import { EmptyState } from '@/components/private/empty-state'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Collaborator } from '@/types/users'

export function CollaboratorsTable({
  collaborators,
  canAdmin,
}: {
  collaborators: Array<Collaborator>
  canAdmin: boolean
}) {
  if (collaborators.length === 0) {
    return <EmptyState message="No collaborators yet" />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {collaborators.map((u: Collaborator) => (
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
  )
}
