import { api } from '@convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'

export async function getUpcomingTasks(limit: number) {
  'use cache'
  return await fetchQuery(api.tasks.listUpcoming, { limit })
}

export async function getParts() {
  'use cache'
  return await fetchQuery(api.parts.list, {})
}

export async function getRecentActivity(limit: number) {
  'use cache'
  return await fetchQuery(api.worklog.listRecent, { limit })
}

export async function getLatestImages(limit: number, visibility: 'private' | 'public') {
  'use cache'
  if (visibility === 'public') {
    return await fetchQuery(api.images.listPublic, {})
  }
  return await fetchQuery(api.images.listInternal, { limit })
}

export async function getInternalImages(limit: number) {
  'use cache'
  return await fetchQuery(api.images.listInternal, { limit })
}

export async function getSettings() {
  'use cache'
  return await fetchQuery(api.settings.get, {})
}

export async function getRecentUpdates() {
  'use cache'
  return await fetchQuery(api.updates.listPublicForTimeline, {})
}
