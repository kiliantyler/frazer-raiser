import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchQuery } from 'convex/nextjs'
import { notFound } from 'next/navigation'
import { UpdateEditor } from '../../update-editor'

type Props = { params: Promise<{ id: string }> }

export default async function EditUpdatePage({ params }: Props) {
  await withAuth({ ensureSignedIn: true })

  const { id } = await params
  const updateId = id as unknown as Id<'updates'>

  const update = await fetchQuery(api.updates.getById, { updateId })
  if (!update) {
    return notFound()
  }

  return <UpdateEditor mode="edit" updateId={updateId} initialUpdate={update} />
}
