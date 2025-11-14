'use server'

import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { revalidatePath } from 'next/cache'

export async function createUpdateAction(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const slug = String(formData.get('slug') ?? '').trim()
  const content = String(formData.get('content') ?? '').trim()
  const imageIdRaw = String(formData.get('imageId') ?? '').trim()

  if (!title || !slug || !content) return

  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return

  const me = await fetchQuery(api.users.getByWorkosUserId, { workosUserId: user.id })
  if (!me) return

  const imageIds: Id<'images'>[] = []
  if (imageIdRaw) {
    imageIds.push(imageIdRaw as unknown as Id<'images'>)
  }

  const updateId = await fetchMutation(api.updates.createDraft, {
    title,
    slug,
    content,
    authorId: me._id,
    imageIds,
    tags: undefined,
  })

  // Link image to update if provided
  if (imageIdRaw) {
    await fetchMutation(api.images.linkToEntity, {
      imageId: imageIdRaw as unknown as Id<'images'>,
      refType: 'update',
      refId: updateId,
    })
  }

  revalidatePath('/journal')
  revalidatePath('/timeline')
  revalidatePath('/updates')
}

export async function updateUpdateAction(formData: FormData) {
  const updateIdRaw = String(formData.get('updateId') ?? '').trim()
  if (!updateIdRaw) return

  const updateId = updateIdRaw as unknown as Id<'updates'>
  const title = String(formData.get('title') ?? '').trim()
  const slug = String(formData.get('slug') ?? '').trim()
  const content = String(formData.get('content') ?? '').trim()
  const imageIdRaw = String(formData.get('imageId') ?? '').trim()

  if (!title || !slug || !content) return

  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return

  const imageIds: Id<'images'>[] = []
  if (imageIdRaw) {
    imageIds.push(imageIdRaw as unknown as Id<'images'>)
  }

  await fetchMutation(api.updates.updateDraft, {
    updateId,
    title,
    slug,
    content,
    imageIds: imageIds.length > 0 ? imageIds : undefined,
  })

  // Link image to update if provided
  if (imageIdRaw) {
    await fetchMutation(api.images.linkToEntity, {
      imageId: imageIdRaw as unknown as Id<'images'>,
      refType: 'update',
      refId: updateId,
    })
  }

  revalidatePath('/journal')
  revalidatePath('/timeline')
  revalidatePath('/updates')
}

export async function publishUpdateAction(formData: FormData) {
  const updateIdRaw = String(formData.get('updateId') ?? '').trim()
  if (!updateIdRaw) return

  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return

  await fetchMutation(api.updates.publish, {
    updateId: updateIdRaw as unknown as Id<'updates'>,
  })

  revalidatePath('/journal')
  revalidatePath('/timeline')
  revalidatePath('/updates')
}

export async function unpublishUpdateAction(formData: FormData) {
  const updateIdRaw = String(formData.get('updateId') ?? '').trim()
  if (!updateIdRaw) return

  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return

  await fetchMutation(api.updates.unpublish, {
    updateId: updateIdRaw as unknown as Id<'updates'>,
  })

  revalidatePath('/journal')
  revalidatePath('/timeline')
  revalidatePath('/updates')
}
