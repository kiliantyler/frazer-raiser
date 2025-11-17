'use client'

import { EmptyState } from '@/components/private/empty-state'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { normalizeExternalUrl } from '@/lib/utils/format'
import type { Supplier } from '@/types/suppliers'
import type { Route } from 'next'
import Link from 'next/link'
import { DeleteSupplierDialog } from './delete-supplier-dialog'
import { SupplierDialog } from './supplier-dialog'

export function SuppliersTable({ suppliers }: { suppliers: Array<Supplier> }) {
  if (suppliers.length === 0) {
    return <EmptyState message="No suppliers yet" />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Website</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map(s => {
          const externalUrl = normalizeExternalUrl(s.websiteUrl)
          return (
            <TableRow key={s._id}>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell>
                {externalUrl ? (
                  <Link
                    href={externalUrl as Route}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground underline underline-offset-4 hover:opacity-80">
                    Visit site
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <SupplierDialog
                    mode="edit"
                    supplier={{
                      _id: s._id,
                      name: s.name,
                      websiteUrl: s.websiteUrl,
                    }}
                  />
                  <DeleteSupplierDialog supplierId={s._id} />
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
