'use server'

import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import sanitizeHtml from 'sanitize-html'

// Sanitize HTML configuration - conservative set of allowed tags and attributes
const sanitizeOptions = {
  allowedTags: [
    'p',
    'br',
    'strong',
    'em',
    'u',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'blockquote',
    'code',
    'pre',
    'a',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {
    img: ['http', 'https', 'data'],
  },
}

export async function createUpdateAction(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const slug = String(formData.get('slug') ?? '').trim()
  const contentHtmlRaw = String(formData.get('contentHtml') ?? '').trim()

  if (!title || !slug || !contentHtmlRaw) return

  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return

  const me = await fetchQuery(api.users.getByWorkosUserId, { workosUserId: user.id })
  if (!me) return

  // Sanitize HTML content
  const contentHtml = sanitizeHtml(contentHtmlRaw, sanitizeOptions)

  const imageIdRaw = String(formData.get('imageId') ?? '').trim()
  const imageIds: Id<'images'>[] = []
  if (imageIdRaw) {
    imageIds.push(imageIdRaw as unknown as Id<'images'>)
  }

  const updateId = await fetchMutation(api.updates.createDraft, {
    title,
    slug,
    content: '', // Will be derived from contentHtml in the mutation
    contentHtml,
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
  redirect('/journal')
}

export async function updateUpdateAction(formData: FormData) {
  const updateIdRaw = String(formData.get('updateId') ?? '').trim()
  if (!updateIdRaw) return

  const updateId = updateIdRaw as unknown as Id<'updates'>
  const title = String(formData.get('title') ?? '').trim()
  const slug = String(formData.get('slug') ?? '').trim()
  const contentHtmlRaw = String(formData.get('contentHtml') ?? '').trim()

  if (!title || !slug || !contentHtmlRaw) return

  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return

  // Sanitize HTML content
  const contentHtml = sanitizeHtml(contentHtmlRaw, sanitizeOptions)

  const imageIdRaw = String(formData.get('imageId') ?? '').trim()
  const imageIds: Id<'images'>[] = []
  if (imageIdRaw) {
    imageIds.push(imageIdRaw as unknown as Id<'images'>)
  }

  await fetchMutation(api.updates.updateDraft, {
    updateId,
    title,
    slug,
    contentHtml,
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
  redirect('/journal')
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
  redirect('/journal')
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
  redirect('/journal')
}
