'use client'

import { updateRoleAction } from '@/app/(private)/collaborators/actions'
import { CollaboratorRoleSelect } from '@/components/private/collaborator-role-select'
import { EmptyState } from '@/components/private/empty-state'
import { TablePagination } from '@/components/shared/table-pagination'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTableFiltering } from '@/hooks/use-table-filtering'
import type { Collaborator } from '@/types/users'
import { Search } from 'lucide-react'

export function CollaboratorsTable({
  collaborators,
  canAdmin,
}: {
  collaborators: Array<Collaborator>
  canAdmin: boolean
}) {
  const { query, setQuery, page, setPage, pageSize, pageCount, paginatedData, filteredData } = useTableFiltering({
    data: collaborators,
    searchFields: user => [user.name, user.email],
    pageSize: 10,
  })

  if (collaborators.length === 0) {
    return <EmptyState message="No collaborators yet" />
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search collaborators..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((u: Collaborator) => (
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={page}
        pageCount={pageCount}
        totalItems={filteredData.length}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </div>
  )
}
