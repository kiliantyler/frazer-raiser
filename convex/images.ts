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
    let uploader = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('workosUserId'), args.uploaderWorkosUserId))
      .unique()
      .catch(() => null)

    // Fallback: if the uploader isn't recognized (for example, when uploads come from
    // an "anonymous" context), associate the image with the first user record so that
    // the image can still be created and used as a hero image.
    if (!uploader && args.uploaderWorkosUserId === 'anonymous') {
      const [fallbackUploader] = await ctx.db.query('users').take(1)
      uploader = fallbackUploader ?? null
    }

    if (!uploader) {
      throw new Error('Uploader not recognized')
    }

    // Get the current max order to append the new image at the end
    const lastImage = await ctx.db.query('images').withIndex('by_order').order('desc').first()
    const newOrder = (lastImage?.order ?? 0) + 1

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
      order: newOrder,
      isPublished: false,
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

export const getByUtKey = query({
  args: { utKey: v.string() },
  returns: v.union(
    v.object({
      _id: v.id('images'),
      url: v.string(),
      width: v.number(),
      height: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const img = await ctx.db
      .query('images')
      .filter(q => q.eq(q.field('utKey'), args.utKey))
      .first()
    if (!img) return null
    return {
      _id: img._id,
      url: img.url,
      width: img.width,
      height: img.height,
    }
  },
})

export const getById = query({
  args: { imageId: v.id('images') },
  returns: v.union(
    v.object({
      _id: v.id('images'),
      url: v.string(),
      width: v.number(),
      height: v.number(),
      utKey: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const img = await ctx.db.get(args.imageId)
    if (!img) return null
    return {
      _id: img._id,
      url: img.url,
      width: img.width,
      height: img.height,
      utKey: img.utKey,
    }
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
      .withIndex('by_isPublished', q => q.eq('isPublished', true))
      .collect()

    const sorted = rows.toSorted((a, b) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })

    return sorted.map(i => ({ _id: i._id, url: i.url, width: i.width, height: i.height, tags: i.tags }))
  },
})

export const getByUrl = query({
  args: { url: v.string() },
  returns: v.union(
    v.object({
      _id: v.id('images'),
      url: v.string(),
      width: v.number(),
      height: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    // Normalize URL - remove query parameters and fragments for matching
    const normalizeUrl = (url: string) => {
      try {
        const urlObj = new URL(url)
        return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`
      } catch {
        const withoutQuery = url.split('?')[0] ?? url
        return withoutQuery.split('#')[0] ?? withoutQuery
      }
    }

    const normalizedSearchUrl = normalizeUrl(args.url)

    // Try exact match first
    let img = await ctx.db
      .query('images')
      .filter(q => q.eq(q.field('url'), args.url))
      .first()

    // If not found, try normalized match
    if (!img) {
      const allImages = await ctx.db.query('images').collect()
      img = allImages.find(i => normalizeUrl(i.url) === normalizedSearchUrl) || null
    }

    // If still not found, try partial match (contains the key)
    if (!img && args.url.includes('/')) {
      const urlParts = args.url.split('/')
      const key = urlParts.at(-1)?.split('?')[0]
      if (key) {
        const imagesByKey = await ctx.db
          .query('images')
          .filter(q => q.eq(q.field('utKey'), key))
          .collect()
        // Get the most recent one
        img = imagesByKey.toSorted((a, b) => b.createdAt - a.createdAt).at(0) || null
      }
    }

    if (!img) return null
    return {
      _id: img._id,
      url: img.url,
      width: img.width,
      height: img.height,
    }
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

export const deleteById = mutation({
  args: { imageId: v.id('images') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.imageId)
    return null
  },
})

export const updateImage = mutation({
  args: {
    imageId: v.id('images'),
    dateTaken: v.optional(v.number()),
    isPublished: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.imageId, {
      dateTaken: args.dateTaken,
      isPublished: args.isPublished,
      tags: args.tags,
    })
    return null
  },
})

export const deleteImages = mutation({
  args: { imageIds: v.array(v.id('images')) },
  returns: v.null(),
  handler: async (ctx, args) => {
    for (const id of args.imageIds) {
      await ctx.db.delete(id)
    }
    return null
  },
})

export const reorderImages = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id('images'),
        order: v.number(),
      }),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    for (const update of args.updates) {
      await ctx.db.patch(update.id, { order: update.order })
    }
    return null
  },
})

export const listInternal = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(
    v.object({
      _id: v.id('images'),
      url: v.string(),
      width: v.number(),
      height: v.number(),
      createdAt: v.number(),
      dateTaken: v.optional(v.number()),
      order: v.optional(v.number()),
      isPublished: v.optional(v.boolean()),
      tags: v.optional(v.array(v.string())),
    }),
  ),
  handler: async (ctx, args) => {
    const allImages = await ctx.db.query('images').collect()

    const sorted = allImages.toSorted((a, b) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER
      if (orderA !== orderB) return orderA - orderB
      return b.createdAt - a.createdAt
    })

    const result = args.limit ? sorted.slice(0, args.limit) : sorted
    return result.map(i => ({
      _id: i._id,
      url: i.url,
      width: i.width,
      height: i.height,
      createdAt: i.createdAt,
      dateTaken: i.dateTaken,
      order: i.order,
      isPublished: i.isPublished,
      tags: i.tags,
    }))
  },
})
