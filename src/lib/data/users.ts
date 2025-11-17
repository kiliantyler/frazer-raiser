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
