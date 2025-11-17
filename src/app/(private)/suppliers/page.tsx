import { PageHeader } from '@/components/private/page-header'
import { SupplierDialog } from '@/components/private/suppliers/supplier-dialog'
import { SuppliersTable } from '@/components/private/suppliers/suppliers-table'
import { getSuppliers } from '@/lib/data/suppliers'
import type { Supplier } from '@/types/suppliers'
import { withAuth } from '@workos-inc/authkit-nextjs'

export default async function SuppliersPage() {
  // Read request data before any non-deterministic libs (Convex) to satisfy Next RSC constraint
  await withAuth({ ensureSignedIn: true })
  const suppliers = (await getSuppliers()) as Supplier[]
  return (
    <section className="space-y-6">
      <PageHeader title="Suppliers" action={<SupplierDialog mode="create" />} />

      <SuppliersTable suppliers={suppliers} />
    </section>
  )
}
