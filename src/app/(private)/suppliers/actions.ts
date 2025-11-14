'use server'

import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { revalidatePath } from 'next/cache'

export async function createSupplierAction(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const websiteUrl = String(formData.get('websiteUrl') ?? '').trim() || undefined
  if (!name) return
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return
  const me = await fetchQuery(api.users.getByWorkosUserId, { workosUserId: user.id })
  if (!me) return
  await fetchMutation(api.suppliers.create, { name, websiteUrl, createdBy: me._id })
  revalidatePath('/suppliers')
}

export async function updateSupplierAction(formData: FormData) {
  const supplierIdRaw = String(formData.get('supplierId') ?? '')
  if (!supplierIdRaw) return
  const supplierId = supplierIdRaw as unknown as Id<'suppliers'>
  const name = String(formData.get('name') ?? '').trim()
  const websiteUrl = String(formData.get('websiteUrl') ?? '').trim() || undefined
  if (!name) return
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return
  await fetchMutation(api.suppliers.update, {
    supplierId,
    name,
    websiteUrl,
  })
  revalidatePath('/suppliers')
}

export async function deleteSupplierAction(formData: FormData) {
  const supplierId = String(formData.get('supplierId') ?? '')
  if (!supplierId) return
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return
  await fetchMutation(api.suppliers.remove, { supplierId: supplierId as unknown as Id<'suppliers'> })
  revalidatePath('/suppliers')
}
