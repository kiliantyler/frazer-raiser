import { api } from '@convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'

export async function getSettings() {
  'use cache'
  return await fetchQuery(api.settings.get, {})
}
