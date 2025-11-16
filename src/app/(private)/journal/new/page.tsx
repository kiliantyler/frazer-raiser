import { withAuth } from '@workos-inc/authkit-nextjs'
import { UpdateEditor } from '../update-editor'

export default async function NewUpdatePage() {
  await withAuth({ ensureSignedIn: true })

  return <UpdateEditor mode="create" />
}
