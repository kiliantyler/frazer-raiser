import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const addEntry = mutation({
  args: {
    date: v.number(),
    hours: v.number(),
    description: v.optional(v.string()),
    title: v.string(),
    tags: v.optional(v.array(v.string())),
    imageIds: v.optional(v.array(v.id('images'))),
    contributorIds: v.optional(v.array(v.id('contributors'))),
    taskId: v.optional(v.id('tasks')),
    partId: v.optional(v.id('parts')),
    costDeltaCents: v.optional(v.number()),
    authorId: v.id('users'),
  },
  returns: v.id('workLogs'),
  handler: async (ctx, args) => {
    if (args.taskId) {
      await ctx.db.patch(args.taskId, { status: 'done', updatedAt: Date.now() })
    }

    return await ctx.db.insert('workLogs', {
      date: args.date,
      hours: args.hours,
      description: args.description,
      title: args.title,
      tags: args.tags,
      imageIds: args.imageIds,
      contributorIds: args.contributorIds,
      taskId: args.taskId,
      partId: args.partId,
      costDeltaCents: args.costDeltaCents,
      authorId: args.authorId,
    })
  },
})

export const updateEntry = mutation({
  args: {
    id: v.id('workLogs'),
    date: v.optional(v.number()),
    hours: v.optional(v.number()),
    description: v.optional(v.string()),
    title: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    imageIds: v.optional(v.array(v.id('images'))),
    contributorIds: v.optional(v.array(v.id('contributors'))),
    taskId: v.optional(v.id('tasks')),
    partId: v.optional(v.id('parts')),
    costDeltaCents: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    await ctx.db.patch(id, updates)
  },
})

export const deleteEntry = mutation({
  args: { id: v.id('workLogs') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const listByDateRange = query({
  args: { from: v.number(), to: v.number() },
  returns: v.array(
    v.object({
      _id: v.id('workLogs'),
      _creationTime: v.number(),
      date: v.number(),
      hours: v.number(),
      description: v.optional(v.string()),
      title: v.string(),
      tags: v.optional(v.array(v.string())),
      imageIds: v.optional(v.array(v.id('images'))),
      contributorIds: v.optional(v.array(v.id('contributors'))),
      taskId: v.optional(v.id('tasks')),
      partId: v.optional(v.id('parts')),
      costDeltaCents: v.optional(v.number()),
      authorId: v.id('users'),
      author: v.object({
        name: v.string(),
        avatarUrl: v.optional(v.string()),
      }),
      contributors: v.array(v.object({ name: v.string() })),
    }),
  ),
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query('workLogs')
      .filter(q => q.and(q.gte(q.field('date'), args.from), q.lte(q.field('date'), args.to)))
      .collect()

    const results = await Promise.all(
      rows.map(async row => {
        const author = await ctx.db.get(row.authorId)
        const contributors = row.contributorIds ? await Promise.all(row.contributorIds.map(id => ctx.db.get(id))) : []
        return {
          ...row,
          author: {
            name: author?.name ?? 'Unknown',
            avatarUrl: author?.avatarUrl,
          },
          contributors: contributors.filter(c => c !== null).map(c => ({ name: c!.name })),
        }
      }),
    )
    return results
  },
})

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(
    v.object({
      _id: v.id('workLogs'),
      _creationTime: v.number(),
      date: v.number(),
      hours: v.number(),
      description: v.optional(v.string()),
      title: v.string(),
      tags: v.optional(v.array(v.string())),
      imageIds: v.optional(v.array(v.id('images'))),
      contributorIds: v.optional(v.array(v.id('contributors'))),
      costDeltaCents: v.optional(v.number()),
      contributors: v.array(
        v.object({
          name: v.string(),
          avatarUrl: v.optional(v.string()),
        }),
      ),
    }),
  ),
  handler: async (ctx, args) => {
    const rows = await ctx.db.query('workLogs').collect()
    const results = await Promise.all(
      rows.map(async w => {
        const contributors = w.contributorIds ? await Promise.all(w.contributorIds.map(id => ctx.db.get(id))) : []
        const contributorsWithAvatars = await Promise.all(
          contributors
            .filter(c => c !== null)
            .map(async c => {
              const contributor = c!
              if (contributor.userId) {
                const user = await ctx.db.get(contributor.userId)
                return {
                  name: contributor.name,
                  avatarUrl: user?.avatarUrl,
                }
              }
              return {
                name: contributor.name,
                avatarUrl: undefined,
              }
            }),
        )
        return {
          _id: w._id,
          _creationTime: w._creationTime,
          date: w.date,
          hours: w.hours,
          description: w.description,
          title: w.title,
          tags: w.tags,
          imageIds: w.imageIds,
          contributorIds: w.contributorIds,
          costDeltaCents: w.costDeltaCents,
          contributors: contributorsWithAvatars,
        }
      }),
    )
    const sorted = results.toSorted((a, b) => b.date - a.date)
    return args.limit ? sorted.slice(0, args.limit) : sorted
  },
})
