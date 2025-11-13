import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const createMessage = mutation({
  args: { name: v.string(), message: v.string() },
  returns: v.id('guestbook'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('guestbook', {
      name: args.name,
      message: args.message,
      createdAt: Date.now(),
      isApproved: false,
    })
  },
})

export const listPublic = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('guestbook'),
      name: v.string(),
      message: v.string(),
      createdAt: v.number(),
    }),
  ),
  handler: async ctx => {
    const rows = await ctx.db
      .query('guestbook')
      .filter(q => q.eq(q.field('isApproved'), true))
      .collect()
    return rows.map(g => ({ _id: g._id, name: g.name, message: g.message, createdAt: g.createdAt }))
  },
})

export const approve = mutation({
  args: { actorUserId: v.id('users'), messageId: v.id('guestbook'), approve: v.boolean() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const actor = await ctx.db.get(args.actorUserId)
    if (!actor || actor.role !== 'ADMIN') throw new Error('Forbidden')
    const row = await ctx.db.get(args.messageId)
    if (!row) return null
    await ctx.db.patch(args.messageId, { isApproved: args.approve })
    return null
  },
})
