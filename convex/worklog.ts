import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const addEntry = mutation({
  args: {
    date: v.number(),
    hours: v.number(),
    description: v.string(),
    taskId: v.optional(v.id('tasks')),
    partId: v.optional(v.id('parts')),
    costDeltaCents: v.optional(v.number()),
    authorId: v.id('users'),
  },
  returns: v.id('workLogs'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('workLogs', {
      date: args.date,
      hours: args.hours,
      description: args.description,
      taskId: args.taskId,
      partId: args.partId,
      costDeltaCents: args.costDeltaCents,
      authorId: args.authorId,
    })
  },
})

export const listByDateRange = query({
  args: { from: v.number(), to: v.number() },
  returns: v.array(
    v.object({
      _id: v.id('workLogs'),
      date: v.number(),
      hours: v.number(),
      description: v.string(),
      taskId: v.optional(v.id('tasks')),
      partId: v.optional(v.id('parts')),
      costDeltaCents: v.optional(v.number()),
      authorId: v.id('users'),
    }),
  ),
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query('workLogs')
      .filter(q => q.and(q.gte(q.field('date'), args.from), q.lte(q.field('date'), args.to)))
      .collect()
    return rows
  },
})

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(
    v.object({
      _id: v.id('workLogs'),
      date: v.number(),
      hours: v.number(),
      description: v.string(),
      costDeltaCents: v.optional(v.number()),
    }),
  ),
  handler: async (ctx, args) => {
    const rows = await ctx.db.query('workLogs').collect()
    const sorted = rows
      .map(w => ({
        _id: w._id,
        date: w.date,
        hours: w.hours,
        description: w.description,
        costDeltaCents: w.costDeltaCents,
      }))
      .toSorted((a, b) => b.date - a.date)
    return args.limit ? sorted.slice(0, args.limit) : sorted
  },
})
