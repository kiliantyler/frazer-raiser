import { UpdatesTable } from '@/components/private/journal/updates-table'
import { getAllUpdatesForAdmin } from '@/lib/data/updates'
import { withAuth } from '@workos-inc/authkit-nextjs'

export default async function UpdatesPage() {
  await withAuth({ ensureSignedIn: true })

  const updates = await getAllUpdatesForAdmin()

  return (
    <section className="space-y-6">
      <UpdatesTable updates={updates} />
    </section>
  )
}
