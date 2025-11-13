import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

const PublishStatus = v.union(v.literal('draft'), v.literal('published'))

export const createDraft = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    authorId: v.id('users'),
    imageIds: v.optional(v.array(v.id('images'))),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.id('updates'),
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert('updates', {
      title: args.title,
      slug: args.slug,
      content: args.content,
      publishStatus: 'draft',
      createdAt: now,
      publishedAt: undefined,
      authorId: args.authorId,
      imageIds: args.imageIds ?? [],
      tags: args.tags,
    })
  },
})

export const updateDraft = mutation({
  args: {
    updateId: v.id('updates'),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.string()),
    imageIds: v.optional(v.array(v.id('images'))),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { updateId, ...patch } = args
    const row = await ctx.db.get(updateId)
    if (!row) return null
    await ctx.db.patch(updateId, { ...patch })
    return null
  },
})

export const publish = mutation({
  args: { updateId: v.id('updates') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.updateId)
    if (!row) return null
    await ctx.db.patch(args.updateId, { publishStatus: 'published', publishedAt: Date.now() })
    return null
  },
})

export const unpublish = mutation({
  args: { updateId: v.id('updates') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.updateId)
    if (!row) return null
    await ctx.db.patch(args.updateId, { publishStatus: 'draft', publishedAt: undefined })
    return null
  },
})

export const listPublic = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('updates'),
      title: v.string(),
      slug: v.string(),
      createdAt: v.number(),
      publishedAt: v.optional(v.number()),
    }),
  ),
  handler: async ctx => {
    const rows = await ctx.db
      .query('updates')
      .filter(q => q.eq(q.field('publishStatus'), 'published'))
      .collect()
    rows.sort((a, b) => b.createdAt - a.createdAt)
    return rows.map(u => ({
      _id: u._id,
      title: u.title,
      slug: u.slug,
      createdAt: u.createdAt,
      publishedAt: u.publishedAt,
    }))
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  returns: v.union(
    v.object({
      _id: v.id('updates'),
      title: v.string(),
      slug: v.string(),
      content: v.string(),
      publishStatus: PublishStatus,
      createdAt: v.number(),
      publishedAt: v.optional(v.number()),
      authorId: v.id('users'),
      imageIds: v.array(v.id('images')),
      tags: v.optional(v.array(v.string())),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('updates')
      .filter(q => q.eq(q.field('slug'), args.slug))
      .unique()
      .catch(() => null)
  },
})
