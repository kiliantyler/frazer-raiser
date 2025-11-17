import { api } from '@convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'

export async function getParts() {
  'use cache'
  return await fetchQuery(api.parts.list, {})
}

export async function getSuppliers() {
  'use cache'
  return await fetchQuery(api.suppliers.list, {})
}
