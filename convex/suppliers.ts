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
