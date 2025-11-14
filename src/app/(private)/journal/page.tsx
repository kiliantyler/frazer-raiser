import { PageHeader } from '@/components/private/page-header'
import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchQuery } from 'convex/nextjs'
import { UpdateDialog } from './update-dialog'
import { UpdatesTable } from './updates-table'

export default async function UpdatesPage() {
  await withAuth({ ensureSignedIn: true })

  const updates = await fetchQuery(api.updates.listAllForAdmin, {})

  return (
    <section className="space-y-6">
      <PageHeader title="Journal Updates" action={<UpdateDialog mode="create" />} />

      <UpdatesTable updates={updates} />
    </section>
  )
}
