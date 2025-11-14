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
      _creationTime: v.number(),
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
    const doc = await ctx.db
      .query('updates')
      .filter(q => q.eq(q.field('slug'), args.slug))
      .unique()
      .catch(() => null)
    if (!doc) {
      return null
    }
    return {
      _id: doc._id,
      _creationTime: doc._creationTime,
      title: doc.title,
      slug: doc.slug,
      content: doc.content,
      publishStatus: doc.publishStatus,
      createdAt: doc.createdAt,
      publishedAt: doc.publishedAt,
      authorId: doc.authorId,
      imageIds: doc.imageIds,
      tags: doc.tags,
    }
  },
})

export const listPublicForTimeline = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('updates'),
      title: v.string(),
      slug: v.string(),
      content: v.string(),
      excerpt: v.string(),
      publishedAt: v.number(),
      createdAt: v.number(),
      heroImage: v.union(
        v.object({
          _id: v.id('images'),
          url: v.string(),
          width: v.number(),
          height: v.number(),
        }),
        v.null(),
      ),
    }),
  ),
  handler: async ctx => {
    const rows = await ctx.db
      .query('updates')
      .filter(q => q.eq(q.field('publishStatus'), 'published'))
      .collect()

    // Sort by publishedAt (or createdAt fallback), newest first
    rows.sort((a, b) => {
      const aDate = a.publishedAt ?? a.createdAt
      const bDate = b.publishedAt ?? b.createdAt
      return bDate - aDate
    })

    // Helper to strip markdown and create excerpt
    const createExcerpt = (content: string, maxLength = 200): string => {
      // Remove markdown headers, links, images, bold, italic, code blocks
      let text = content
        .replaceAll(/^#{1,6}\s+/gm, '') // Headers
        .replaceAll(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
        .replaceAll(/!\[([^\]]*)\]\([^)]+\)/g, '') // Images
        .replaceAll(/\*\*([^*]+)\*\*/g, '$1') // Bold
        .replaceAll(/\*([^*]+)\*/g, '$1') // Italic
        .replaceAll(/`([^`]+)`/g, '$1') // Inline code
        .replaceAll(/```[\s\S]*?```/g, '') // Code blocks
        .replaceAll(/\n+/g, ' ') // Newlines to spaces
        .trim()

      if (text.length <= maxLength) return text
      return text.slice(0, maxLength).trim() + '...'
    }

    // Resolve hero images and create excerpts
    const results = await Promise.all(
      rows.map(async update => {
        // Get first image as hero image
        const heroImageId = update.imageIds[0]
        let heroImage = null
        if (heroImageId) {
          const img = await ctx.db.get(heroImageId)
          if (img) {
            heroImage = {
              _id: img._id,
              url: img.url,
              width: img.width,
              height: img.height,
            }
          }
        }

        const excerpt = createExcerpt(update.content)

        return {
          _id: update._id,
          title: update.title,
          slug: update.slug,
          content: update.content,
          excerpt,
          publishedAt: update.publishedAt ?? update.createdAt,
          createdAt: update.createdAt,
          heroImage,
        }
      }),
    )

    return results
  },
})

export const listAllForAdmin = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('updates'),
      title: v.string(),
      slug: v.string(),
      publishStatus: PublishStatus,
      createdAt: v.number(),
      publishedAt: v.optional(v.number()),
      imageIds: v.array(v.id('images')),
    }),
  ),
  handler: async ctx => {
    const rows = await ctx.db.query('updates').collect()
    // Sort by createdAt, newest first
    rows.sort((a, b) => b.createdAt - a.createdAt)
    return rows.map(u => ({
      _id: u._id,
      title: u.title,
      slug: u.slug,
      publishStatus: u.publishStatus,
      createdAt: u.createdAt,
      publishedAt: u.publishedAt,
      imageIds: u.imageIds,
    }))
  },
})

export const getById = query({
  args: { updateId: v.id('updates') },
  returns: v.union(
    v.object({
      _id: v.id('updates'),
      title: v.string(),
      slug: v.string(),
      content: v.string(),
      publishStatus: PublishStatus,
      createdAt: v.number(),
      publishedAt: v.optional(v.number()),
      imageIds: v.array(v.id('images')),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const update = await ctx.db.get(args.updateId)
    if (!update) return null
    return {
      _id: update._id,
      title: update.title,
      slug: update.slug,
      content: update.content,
      publishStatus: update.publishStatus,
      createdAt: update.createdAt,
      publishedAt: update.publishedAt,
      imageIds: update.imageIds,
    }
  },
})
