import { PageHeader } from '@/components/private/page-header'
import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchQuery } from 'convex/nextjs'
import { SupplierDialog } from './supplier-dialog'
import { SuppliersTable } from './suppliers-table'

type Supplier = { _id: string; name: string; websiteUrl?: string }

async function getSuppliers() {
  'use cache'
  return await fetchQuery(api.suppliers.list, {})
}

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
