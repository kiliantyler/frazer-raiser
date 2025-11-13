import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const createOnUpload = mutation({
  args: {
    utKey: v.string(),
    url: v.string(),
    width: v.number(),
    height: v.number(),
    size: v.number(),
    mime: v.string(),
    uploaderWorkosUserId: v.string(),
    visibility: v.union(v.literal('public'), v.literal('private')),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.id('images'),
  handler: async (ctx, args) => {
    const uploader = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('workosUserId'), args.uploaderWorkosUserId))
      .unique()
      .catch(() => null)
    if (!uploader) {
      throw new Error('Uploader not recognized')
    }
    return await ctx.db.insert('images', {
      utKey: args.utKey,
      url: args.url,
      width: args.width,
      height: args.height,
      size: args.size,
      mime: args.mime,
      tags: args.tags ?? [],
      entityRef: undefined,
      uploaderId: uploader._id,
      visibility: args.visibility,
      createdAt: Date.now(),
    })
  },
})

export const linkToEntity = mutation({
  args: {
    imageId: v.id('images'),
    refType: v.union(v.literal('task'), v.literal('update'), v.literal('part')),
    refId: v.union(v.id('tasks'), v.id('updates'), v.id('parts')),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const img = await ctx.db.get(args.imageId)
    if (!img) return null
    await ctx.db.patch(args.imageId, { entityRef: { type: args.refType, id: args.refId } })
    return null
  },
})

export const listPublic = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('images'),
      url: v.string(),
      width: v.number(),
      height: v.number(),
      tags: v.optional(v.array(v.string())),
    }),
  ),
  handler: async ctx => {
    const rows = await ctx.db
      .query('images')
      .filter(q => q.eq(q.field('visibility'), 'public'))
      .collect()
    return rows.map(i => ({ _id: i._id, url: i.url, width: i.width, height: i.height, tags: i.tags }))
  },
})

export const listLatest = query({
  args: { limit: v.optional(v.number()), visibility: v.optional(v.union(v.literal('public'), v.literal('private'))) },
  returns: v.array(
    v.object({
      _id: v.id('images'),
      url: v.string(),
      width: v.number(),
      height: v.number(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    let query = ctx.db.query('images')
    if (args.visibility) {
      query = query.filter(q => q.eq(q.field('visibility'), args.visibility))
    }
    const rows = await query.collect()
    const sorted = rows
      .map(i => ({
        _id: i._id,
        url: i.url,
        width: i.width,
        height: i.height,
        createdAt: i.createdAt,
      }))
      .toSorted((a, b) => b.createdAt - a.createdAt)
    return args.limit ? sorted.slice(0, args.limit) : sorted
  },
})
