import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const create = mutation({
  args: {
    name: v.string(),
    vendor: v.optional(v.string()),
    supplierId: v.optional(v.id('suppliers')),
    partNumber: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal('ordered'),
        v.literal('shipped'),
        v.literal('received'),
        v.literal('installed'),
        v.literal('cancelled'),
      ),
    ),
    priceCents: v.number(),
    quantity: v.optional(v.number()),
    isForCar: v.optional(v.boolean()),
    purchasedOn: v.optional(v.number()),
    notes: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    linkedTaskId: v.optional(v.id('tasks')),
    imageIds: v.optional(v.array(v.id('images'))),
    createdBy: v.id('users'),
  },
  returns: v.id('parts'),
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert('parts', {
      name: args.name,
      vendor: args.vendor,
      supplierId: args.supplierId,
      partNumber: args.partNumber,
      status: args.status ?? 'ordered',
      priceCents: args.priceCents,
      quantity: args.quantity,
      isForCar: args.isForCar,
      purchasedOn: args.purchasedOn,
      installedOn: undefined,
      notes: args.notes,
      sourceUrl: args.sourceUrl,
      linkedTaskId: args.linkedTaskId,
      imageIds: args.imageIds ?? [],
      createdBy: args.createdBy,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const update = mutation({
  args: {
    partId: v.id('parts'),
    name: v.optional(v.string()),
    vendor: v.optional(v.string()),
    supplierId: v.optional(v.id('suppliers')),
    partNumber: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal('ordered'),
        v.literal('shipped'),
        v.literal('received'),
        v.literal('installed'),
        v.literal('cancelled'),
      ),
    ),
    priceCents: v.optional(v.number()),
    quantity: v.optional(v.number()),
    isForCar: v.optional(v.boolean()),
    purchasedOn: v.optional(v.number()),
    installedOn: v.optional(v.number()),
    notes: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    linkedTaskId: v.optional(v.id('tasks')),
    imageIds: v.optional(v.array(v.id('images'))),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { partId, ...patch } = args
    const part = await ctx.db.get(partId)
    if (!part) return null
    await ctx.db.patch(partId, { ...patch, updatedAt: Date.now() })
    return null
  },
})

export const markInstalled = mutation({
  args: { partId: v.id('parts'), installedOn: v.number() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const part = await ctx.db.get(args.partId)
    if (!part) return null
    await ctx.db.patch(args.partId, { installedOn: args.installedOn, status: 'installed', updatedAt: Date.now() })
    return null
  },
})

export const markOrdered = mutation({
  args: { partId: v.id('parts') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const part = await ctx.db.get(args.partId)
    if (!part) return null
    await ctx.db.patch(args.partId, { installedOn: undefined, status: 'ordered', updatedAt: Date.now() })
    return null
  },
})

export const setStatus = mutation({
  args: {
    partId: v.id('parts'),
    status: v.union(
      v.literal('ordered'),
      v.literal('shipped'),
      v.literal('received'),
      v.literal('installed'),
      v.literal('cancelled'),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const patch: Record<string, unknown> = { status: args.status, updatedAt: Date.now() }
    if (args.status === 'installed') {
      patch.installedOn = Date.now()
    }
    if (args.status !== 'installed') {
      patch.installedOn = undefined
    }
    await ctx.db.patch(args.partId, patch)
    return null
  },
})

export const remove = mutation({
  args: { partId: v.id('parts') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.partId)
    return null
  },
})

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('parts'),
      name: v.string(),
      vendor: v.optional(v.string()),
      supplierId: v.optional(v.id('suppliers')),
      partNumber: v.optional(v.string()),
      status: v.optional(
        v.union(
          v.literal('ordered'),
          v.literal('shipped'),
          v.literal('received'),
          v.literal('installed'),
          v.literal('cancelled'),
        ),
      ),
      priceCents: v.number(),
      quantity: v.optional(v.number()),
      isForCar: v.optional(v.boolean()),
      purchasedOn: v.optional(v.number()),
      installedOn: v.optional(v.number()),
      sourceUrl: v.optional(v.string()),
      linkedTaskId: v.optional(v.id('tasks')),
      supplierName: v.optional(v.string()),
      supplierUrl: v.optional(v.string()),
    }),
  ),
  handler: async ctx => {
    const rows = await ctx.db.query('parts').collect()
    const mapped = []
    for (const p of rows) {
      let supplierName: string | undefined
      let supplierUrl: string | undefined
      if (p.supplierId) {
        const s = await ctx.db.get(p.supplierId)
        if (s) {
          supplierName = s.name
          supplierUrl = s.websiteUrl
        }
      }
      mapped.push({
        _id: p._id,
        name: p.name,
        vendor: p.vendor,
        supplierId: p.supplierId,
        partNumber: p.partNumber,
        status: p.status,
        priceCents: p.priceCents,
        quantity: p.quantity,
        isForCar: p.isForCar,
        purchasedOn: p.purchasedOn,
        installedOn: p.installedOn,
        sourceUrl: p.sourceUrl,
        linkedTaskId: p.linkedTaskId,
        supplierName,
        supplierUrl,
      })
    }
    return mapped
  },
})
