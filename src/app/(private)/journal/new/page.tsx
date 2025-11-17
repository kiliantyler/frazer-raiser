import { UpdateEditor } from '@/components/private/journal/update-editor'
import { withAuth } from '@workos-inc/authkit-nextjs'

export default async function NewUpdatePage() {
  await withAuth({ ensureSignedIn: true })

  return <UpdateEditor mode="create" />
}
