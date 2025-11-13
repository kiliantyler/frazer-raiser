import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import Link from 'next/link'
import { createSupplierAction } from './actions'

function normalizeExternalUrl(url: string | undefined): `https://${string}` | `http://${string}` | null {
  if (!url) return null
  if (url.startsWith('http://')) {
    return url as `http://${string}`
  }
  if (url.startsWith('https://')) {
    return url as `https://${string}`
  }
  return `https://${url}` as `https://${string}`
}

export default async function SuppliersPage() {
  type Supplier = { _id: string; name: string; websiteUrl?: string }
  const suppliers = (await fetchQuery(api.suppliers.list, {})) as Supplier[]
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-serif text-2xl">Suppliers</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Add Supplier</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">All Suppliers</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {suppliers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No suppliers yet</p>
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
        </CardContent>
      </Card>
    </section>
  )
}
