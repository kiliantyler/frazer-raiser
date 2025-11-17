import { PageHeader } from '@/components/private/page-header'
import { StatCard } from '@/components/private/stat-card'
import { formatCurrency } from '@/lib/utils/format'
import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchQuery } from 'convex/nextjs'
import { PartDialog } from './part-dialog'
import { PartsTable } from './parts-table'

type PartListItem = {
  _id: string
  name: string
  vendor?: string
  status?: 'ordered' | 'shipped' | 'received' | 'installed' | 'cancelled'
  priceCents: number
  purchasedOn?: number
  installedOn?: number
  linkedTaskId?: string
}

type Supplier = { _id: string; name: string; websiteUrl?: string }

async function getParts() {
  'use cache'
  return await fetchQuery(api.parts.list, {})
}

async function getSuppliers() {
  'use cache'
  return await fetchQuery(api.suppliers.list, {})
}

export default async function PartsCostsPage() {
  // Read request data before any non-deterministic libs (Convex) to satisfy Next RSC constraint
  await withAuth({ ensureSignedIn: true })
  const [parts, suppliers] = (await Promise.all([getParts(), getSuppliers()])) as [PartListItem[], Supplier[]]
  const totalCents = parts.reduce((sum: number, p: PartListItem) => sum + (p.priceCents ?? 0), 0)
  const totalParts = parts.length
  const averageCents = totalParts > 0 ? Math.round(totalCents / totalParts) : 0

  return (
    <section className="space-y-6">
      <PageHeader title="Parts & Cost Tracker" action={<PartDialog mode="create" suppliers={suppliers} />} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Spent" value={formatCurrency(totalCents)} valueClassName="text-red-600" />
        <StatCard title="Total Parts" value={totalParts} />
        <StatCard title="Average Cost per Part" value={formatCurrency(averageCents)} />
      </div>

      <PartsTable parts={parts} suppliers={suppliers} />
    </section>
  )
}
