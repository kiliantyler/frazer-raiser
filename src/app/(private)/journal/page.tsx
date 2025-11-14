import { PageHeader } from '@/components/private/page-header'
import { Button } from '@/components/ui/button'
import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchQuery } from 'convex/nextjs'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { UpdatesTable } from './updates-table'

export default async function UpdatesPage() {
  await withAuth({ ensureSignedIn: true })

  const updates = await fetchQuery(api.updates.listAllForAdmin, {})

  return (
    <section className="space-y-6">
      <PageHeader
        title="Journal Updates"
        action={
          <Button asChild>
            <Link href="/journal/new">
              <Plus className="mr-1.5 size-4" />
              New Journal Entry
            </Link>
          </Button>
        }
      />

      <UpdatesTable updates={updates} />
    </section>
  )
}
