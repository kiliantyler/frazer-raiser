import { PageHeader } from '@/components/private/page-header'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { UpdateEditor } from '../update-editor'

export default async function NewUpdatePage() {
  await withAuth({ ensureSignedIn: true })

  return (
    <section className="space-y-6">
      <PageHeader title="New Journal Entry" />
      <UpdateEditor mode="create" />
    </section>
  )
}
