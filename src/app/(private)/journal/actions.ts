'use server'

import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import sanitizeHtml from 'sanitize-html'

// Sanitize HTML configuration - keep in sync with the public updates renderer
const sanitizeOptions = {
  allowedTags: [
    'p',
    'br',
    'strong',
    'em',
    'u',
    's',
    'del',
    'mark',
    'span',
    'h1',
    'h2',
    'h3',
    'ul',
    'ol',
    'li',
    'blockquote',
    'code',
    'pre',
    'a',
    'hr',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
  },
  allowedStyles: {
    '*': {
      'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
    },
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

  // Debug logging
  console.log('[createUpdateAction] FormData entries:', Array.from(formData.entries()))
  if (imageIdRaw) {
    console.log('[createUpdateAction] imageIdRaw:', imageIdRaw)
  } else {
    console.log('[createUpdateAction] No imageId found in form data')
  }

  const imageIds: Id<'images'>[] | undefined = imageIdRaw ? [imageIdRaw as unknown as Id<'images'>] : undefined

  console.log('[createUpdateAction] Calling createDraft with imageIds:', imageIds)

  const updateId = await fetchMutation(api.updates.createDraft, {
    title,
    slug,
    content: '', // Will be derived from contentHtml in the mutation
    contentHtml,
    authorId: me._id,
    imageIds,
    tags: undefined,
  })

  console.log('[createUpdateAction] Created update with ID:', updateId, 'imageIds were:', imageIds)

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

  // Get existing update to preserve imageIds if no new image is provided
  const existingUpdate = await fetchQuery(api.updates.getById, { updateId })

  const imageIdRaw = String(formData.get('imageId') ?? '').trim()

  // Debug logging
  console.log('[updateUpdateAction] FormData entries:', Array.from(formData.entries()))
  if (imageIdRaw) {
    console.log('[updateUpdateAction] imageIdRaw:', imageIdRaw)
  } else {
    console.log('[updateUpdateAction] No imageId found in form data')
    if (existingUpdate) {
      console.log('[updateUpdateAction] Existing imageIds:', existingUpdate.imageIds)
    }
  }

  let imageIds: Id<'images'>[] | undefined

  if (imageIdRaw) {
    // New image provided - use it
    imageIds = [imageIdRaw as unknown as Id<'images'>]
  } else if (existingUpdate && existingUpdate.imageIds.length > 0) {
    // No new image, but preserve existing imageIds
    imageIds = existingUpdate.imageIds
  } else {
    // No image at all
    imageIds = undefined
  }

  console.log('[updateUpdateAction] Calling updateDraft with imageIds:', imageIds)

  await fetchMutation(api.updates.updateDraft, {
    updateId,
    title,
    slug,
    contentHtml,
    imageIds,
  })

  console.log('[updateUpdateAction] Updated update with ID:', updateId, 'imageIds were:', imageIds)

  // Always link image to update if we have an imageId (either new or existing)
  // This ensures the association is maintained even if imageIds field has issues
  const imageIdToLink = imageIdRaw || existingUpdate?.imageIds[0]
  if (imageIdToLink) {
    await fetchMutation(api.images.linkToEntity, {
      imageId: imageIdToLink as unknown as Id<'images'>,
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
