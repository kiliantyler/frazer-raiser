import { api } from '@convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'

export async function getUserByWorkosUserId(workosUserId: string) {
  'use cache'
  return await fetchQuery(api.users.getByWorkosUserId, { workosUserId })
}

export async function getUsers() {
  'use cache'
  return await fetchQuery(api.users.list, {})
}

export async function getTasksByStatus(status: 'todo' | 'in_progress' | 'blocked' | 'done') {
  'use cache'
  return await fetchQuery(api.tasks.listByStatus, { status })
}

export async function getPublishedUpdates() {
  'use cache'
  return await fetchQuery(api.updates.listPublic, {})
}
