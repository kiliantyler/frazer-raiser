import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const create = mutation({
  args: {
    name: v.string(),
    websiteUrl: v.optional(v.string()),
    createdBy: v.id('users'),
  },
  returns: v.id('suppliers'),
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert('suppliers', {
      name: args.name,
      websiteUrl: args.websiteUrl,
      createdBy: args.createdBy,
      createdAt: now,
    })
  },
})

export const update = mutation({
  args: {
    supplierId: v.id('suppliers'),
    name: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { supplierId, ...patch } = args
    const supplier = await ctx.db.get(supplierId)
    if (!supplier) return null
    await ctx.db.patch(supplierId, patch)
    return null
  },
})

export const remove = mutation({
  args: { supplierId: v.id('suppliers') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.supplierId)
    return null
  },
})

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('suppliers'),
      name: v.string(),
      websiteUrl: v.optional(v.string()),
    }),
  ),
  handler: async ctx => {
    const rows = await ctx.db.query('suppliers').collect()
    // Sort by name ascending for consistency
    rows.sort((a, b) => a.name.localeCompare(b.name))
    return rows.map(s => ({
      _id: s._id,
      name: s.name,
      websiteUrl: s.websiteUrl,
    }))
  },
})
