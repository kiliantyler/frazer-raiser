import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const list = query({
  args: {},
  handler: async ctx => {
    return await ctx.db.query('contributors').collect()
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    userId: v.optional(v.id('users')),
  },
  returns: v.id('contributors'),
  handler: async (ctx, args) => {
    // Check if exists by userId if provided
    if (args.userId) {
      const existing = await ctx.db
        .query('contributors')
        .withIndex('by_user_id', q => q.eq('userId', args.userId))
        .first()
      if (existing) return existing._id
    }

    // Check if exists by name (simple duplicate check)
    const existingByName = await ctx.db
      .query('contributors')
      .filter(q => q.eq(q.field('name'), args.name))
      .first()
    if (existingByName) return existingByName._id

    return await ctx.db.insert('contributors', {
      name: args.name,
      userId: args.userId,
      createdAt: Date.now(),
    })
  },
})

export const getByUserId = query({
  args: {
    userId: v.id('users'),
  },
  returns: v.union(
    v.object({
      _id: v.id('contributors'),
      name: v.string(),
      userId: v.optional(v.id('users')),
      createdAt: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('contributors')
      .withIndex('by_user_id', q => q.eq('userId', args.userId))
      .first()
  },
})

export const remove = mutation({
  args: {
    id: v.id('contributors'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
