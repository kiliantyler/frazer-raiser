'use server'

import type { PartStatus } from '@/types/parts'
import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { revalidatePath } from 'next/cache'

export async function createPartAction(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const vendor = String(formData.get('vendor') ?? '').trim() || undefined
  const partNumber = String(formData.get('partNumber') ?? '').trim() || undefined
  const sourceUrlRaw = String(formData.get('sourceUrl') ?? '').trim()
  const sourceUrl = sourceUrlRaw || undefined
  const supplierIdRaw = String(formData.get('supplierId') ?? '').trim()
  const supplierId = supplierIdRaw ? (supplierIdRaw as unknown as Id<'suppliers'>) : undefined
  // Price field is expected in dollars; convert to cents
  const priceDollars = Number(formData.get('price') ?? 0)
  const priceCents = Math.round(priceDollars * 100)
  // Purchased on date (YYYY-MM-DD) -> epoch ms
  const purchasedOnStr = String(formData.get('purchasedOn') ?? '')
  const purchasedOn = purchasedOnStr ? new Date(purchasedOnStr + 'T00:00:00').getTime() : Date.now()
  if (!name || Number.isNaN(priceCents)) return
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return
  const me = await fetchQuery(api.users.getByWorkosUserId, { workosUserId: user.id })
  if (!me) return
  await fetchMutation(api.parts.create, {
    name,
    vendor,
    supplierId,
    partNumber,
    priceCents,
    purchasedOn,
    notes: undefined,
    sourceUrl,
    linkedTaskId: undefined,
    imageIds: [],
    createdBy: me._id,
  })
  revalidatePath('/parts-costs')
}

export async function deletePartAction(formData: FormData) {
  const partId = String(formData.get('partId') ?? '')
  if (!partId) return
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return
  await fetchMutation(api.parts.remove, { partId: partId as unknown as Id<'parts'> })
  revalidatePath('/parts-costs')
}

export async function updatePartAction(formData: FormData) {
  const partIdRaw = String(formData.get('partId') ?? '')
  if (!partIdRaw) return
  const partId = partIdRaw as unknown as Id<'parts'>
  const name = String(formData.get('name') ?? '').trim()
  const vendor = String(formData.get('vendor') ?? '').trim() || undefined
  const partNumber = String(formData.get('partNumber') ?? '').trim() || undefined
  const sourceUrlRaw = String(formData.get('sourceUrl') ?? '').trim()
  const sourceUrl = sourceUrlRaw || undefined
  const supplierIdRaw = String(formData.get('supplierId') ?? '').trim()
  const supplierId = supplierIdRaw ? (supplierIdRaw as unknown as Id<'suppliers'>) : undefined
  const priceDollars = Number(formData.get('price') ?? Number.NaN)
  const priceCents = Number.isNaN(priceDollars) ? undefined : Math.round(priceDollars * 100)
  const purchasedOnStr = String(formData.get('purchasedOn') ?? '')
  const purchasedOn = purchasedOnStr ? new Date(purchasedOnStr + 'T00:00:00').getTime() : undefined
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return
  await fetchMutation(api.parts.update, {
    partId,
    name: name || undefined,
    vendor,
    supplierId,
    partNumber,
    priceCents,
    purchasedOn,
    sourceUrl,
  })
  revalidatePath('/parts-costs')
}

export async function setPartStatusAction(formData: FormData) {
  const partIdRaw = String(formData.get('partId') ?? '')
  const status = String(formData.get('status') ?? '')
  if (!partIdRaw || !status) return
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return
  await fetchMutation(api.parts.setStatus, {
    partId: partIdRaw as unknown as Id<'parts'>,
    status: status as unknown as PartStatus,
  })
  revalidatePath('/parts-costs')
}
