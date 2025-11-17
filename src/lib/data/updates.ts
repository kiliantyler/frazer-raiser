import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { fetchQuery } from 'convex/nextjs'

export async function getUpdateBySlug(slug: string) {
  'use cache'
  return await fetchQuery(api.updates.getBySlug, { slug })
}

async function getImageById(imageId: Id<'images'>) {
  'use cache'
  return await fetchQuery(api.images.getById, { imageId })
}

export async function getHeroImage(imageIds: Array<Id<'images'>>) {
  'use cache'
  if (imageIds.length === 0) {
    return null
  }
  const imageId = imageIds[0]
  if (!imageId) {
    return null
  }
  return await getImageById(imageId)
}

export async function getAllUpdatesForAdmin() {
  'use cache'
  return await fetchQuery(api.updates.listAllForAdmin, {})
}

export async function getUpdates() {
  'use cache'
  return await fetchQuery(api.updates.listPublicForTimeline, {})
}
