import { PageHeader } from '@/components/private/page-header'
import { PartDialog } from '@/components/private/parts-costs/part-dialog'
import { PartsTable } from '@/components/private/parts-costs/parts-table'
import { StatCard } from '@/components/private/stat-card'
import { getParts, getSuppliers } from '@/lib/data/parts'
import { formatCurrency } from '@/lib/utils/format'
import type { PartListItem } from '@/types/parts'
import type { Supplier } from '@/types/suppliers'
import { withAuth } from '@workos-inc/authkit-nextjs'

export default async function PartsCostsPage() {
  // Read request data before any non-deterministic libs (Convex) to satisfy Next RSC constraint
  await withAuth({ ensureSignedIn: true })
  const [parts, suppliers] = (await Promise.all([getParts(), getSuppliers()])) as [PartListItem[], Supplier[]]
  const activeParts = parts.filter(p => p.status !== 'cancelled')
  const totalCents = activeParts.reduce(
    (sum: number, p: PartListItem) => sum + (p.priceCents ?? 0) * (p.quantity ?? 1),
    0,
  )
  const totalParts = activeParts.reduce((sum: number, p: PartListItem) => sum + (p.quantity ?? 1), 0)
  const partsForCar = activeParts.filter(p => p.isForCar === true)
  const totalCentsForCar = partsForCar.reduce(
    (sum: number, p: PartListItem) => sum + (p.priceCents ?? 0) * (p.quantity ?? 1),
    0,
  )
  const totalPartsForCar = partsForCar.reduce((sum: number, p: PartListItem) => sum + (p.quantity ?? 1), 0)
  const averageCents = totalPartsForCar > 0 ? Math.round(totalCentsForCar / totalPartsForCar) : 0

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
