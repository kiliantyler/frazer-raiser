import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchQuery } from 'convex/nextjs'
import { PartDialog } from './part-dialog'
import { PartsTable } from './parts-table'

export default async function PartsCostsPage() {
  // Read request data before any non-deterministic libs (Convex) to satisfy Next RSC constraint
  await withAuth({ ensureSignedIn: true })
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
  const [parts, suppliers] = (await Promise.all([
    fetchQuery(api.parts.list, {}),
    fetchQuery(api.suppliers.list, {}),
  ])) as [PartListItem[], Supplier[]]
  const totalCents = parts.reduce((sum: number, p: PartListItem) => sum + (p.priceCents ?? 0), 0)
  const totalParts = parts.length
  const averageCents = totalParts > 0 ? Math.round(totalCents / totalParts) : 0

  function formatCurrency(cents: number) {
    const dollars = cents / 100
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dollars)
  }
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-2xl">Parts & Cost Tracker</h1>
        <PartDialog mode="create" suppliers={suppliers} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-red-600">{formatCurrency(totalCents)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Parts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{totalParts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Average Cost per Part</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(averageCents)}</div>
          </CardContent>
        </Card>
      </div>

      <PartsTable parts={parts} suppliers={suppliers} />
    </section>
  )
}
