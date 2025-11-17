import { api } from '@convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'

export async function getWorkLogByDateRange(from: number, to: number) {
  'use cache'
  return await fetchQuery(api.worklog.listByDateRange, { from, to })
}
