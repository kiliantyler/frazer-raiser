import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EmptyState } from '@/components/private/empty-state'
import { FormCard } from '@/components/private/form-card'
import { PageHeader } from '@/components/private/page-header'
import { normalizeExternalUrl } from '@/lib/utils/format'
import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchQuery } from 'convex/nextjs'
import Link from 'next/link'
import { createSupplierAction } from './actions'

export default async function SuppliersPage() {
  // Read request data before any non-deterministic libs (Convex) to satisfy Next RSC constraint
  await withAuth({ ensureSignedIn: true })
  type Supplier = { _id: string; name: string; websiteUrl?: string }
  const suppliers = (await fetchQuery(api.suppliers.list, {})) as Supplier[]
  return (
    <section className="space-y-6">
      <PageHeader title="Suppliers" />

      <FormCard title="Add Supplier">
        <form action={createSupplierAction} className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="e.g. Kanter Auto" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="websiteUrl">Website</Label>
            <Input id="websiteUrl" name="websiteUrl" type="url" placeholder="https://example.com" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">Add Supplier</Button>
          </div>
        </form>
      </FormCard>

      <FormCard title="All Suppliers">
        <div className="grid gap-3">
          {suppliers.length === 0 ? (
            <EmptyState message="No suppliers yet" />
          ) : (
            suppliers.map(s => {
              const externalUrl = normalizeExternalUrl(s.websiteUrl)
              return (
                <div key={s._id} className="flex items-center justify-between">
                  <div className="font-medium">{s.name}</div>
                  {externalUrl ? (
                    <Link
                      href={externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground underline underline-offset-4 hover:opacity-80">
                      Visit site
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </FormCard>
    </section>
  )
}
