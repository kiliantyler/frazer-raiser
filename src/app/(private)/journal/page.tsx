import { UpdatesTable } from '@/components/private/journal/updates-table'
import { PageHeader } from '@/components/private/page-header'
import { Button } from '@/components/ui/button'
import { getAllUpdatesForAdmin } from '@/lib/data/updates'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function UpdatesPage() {
  await withAuth({ ensureSignedIn: true })

  const updates = await getAllUpdatesForAdmin()

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
