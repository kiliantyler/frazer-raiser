'use server'

import { getCurrentUserOrNull } from '@/lib/auth'
import type { PartStatus } from '@/types/parts'
import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { revalidatePath } from 'next/cache'

export async function getSuppliersAction() {
  const user = await getCurrentUserOrNull()
  if (!user) {
    throw new Error('Unauthorized')
  }

  try {
    const suppliers = await fetchQuery(api.suppliers.list, {})
    return { success: true, data: suppliers }
  } catch (error) {
    console.error('Failed to fetch suppliers:', error)
    return { success: false, error: 'Failed to fetch suppliers' }
  }
}

export async function createPartAction(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const supplierIdRaw = String(formData.get('supplierId') ?? '').trim()
  const supplierId = supplierIdRaw ? (supplierIdRaw as unknown as Id<'suppliers'>) : undefined
  const partNumber = String(formData.get('partNumber') ?? '').trim() || undefined
  const sourceUrl = String(formData.get('sourceUrl') ?? '').trim() || undefined
  const priceStr = String(formData.get('price') ?? '').trim()
  const quantityStr = String(formData.get('quantity') ?? '1').trim()
  const purchasedOnStr = String(formData.get('purchasedOn') ?? '').trim()
  const isForCar = formData.get('isForCar') === 'on'

  if (!name) return

  const priceCents = priceStr ? Math.round(Number.parseFloat(priceStr) * 100) : 0
  const quantity = quantityStr ? Number.parseInt(quantityStr, 10) : 1
  const purchasedOn = purchasedOnStr ? new Date(purchasedOnStr).getTime() : undefined

  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return
  const me = await fetchQuery(api.users.getByWorkosUserId, { workosUserId: user.id })
  if (!me) return

  await fetchMutation(api.parts.create, {
    name,
    supplierId,
    partNumber,
    sourceUrl,
    priceCents,
    quantity,
    isForCar,
    purchasedOn,
    createdBy: me._id,
  })
  revalidatePath('/parts-costs')
}

export async function updatePartAction(formData: FormData) {
  const partIdRaw = String(formData.get('partId') ?? '')
  if (!partIdRaw) return
  const partId = partIdRaw as unknown as Id<'parts'>

  const name = String(formData.get('name') ?? '').trim()
  const supplierIdRaw = String(formData.get('supplierId') ?? '').trim()
  const supplierId = supplierIdRaw ? (supplierIdRaw as unknown as Id<'suppliers'>) : undefined
  const partNumber = String(formData.get('partNumber') ?? '').trim() || undefined
  const sourceUrl = String(formData.get('sourceUrl') ?? '').trim() || undefined
  const priceStr = String(formData.get('price') ?? '').trim()
  const quantityStr = String(formData.get('quantity') ?? '1').trim()
  const purchasedOnStr = String(formData.get('purchasedOn') ?? '').trim()
  const isForCar = formData.get('isForCar') === 'on'

  if (!name) return

  const priceCents = priceStr ? Math.round(Number.parseFloat(priceStr) * 100) : undefined
  const quantity = quantityStr ? Number.parseInt(quantityStr, 10) : undefined
  const purchasedOn = purchasedOnStr ? new Date(purchasedOnStr).getTime() : undefined

  await fetchMutation(api.parts.update, {
    partId,
    name,
    supplierId,
    partNumber,
    sourceUrl,
    priceCents,
    quantity,
    isForCar,
    purchasedOn,
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

export async function setPartStatusAction(formData: FormData) {
  const partId = String(formData.get('partId') ?? '')
  const status = String(formData.get('status') ?? '')
  if (!partId || !status) return
  await fetchMutation(api.parts.update, {
    partId: partId as unknown as Id<'parts'>,
    status: status as PartStatus,
  })
  revalidatePath('/parts-costs')
}
