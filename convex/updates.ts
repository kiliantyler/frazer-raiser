import { v } from 'convex/values'
import type { Id } from './_generated/dataModel'
import type { QueryCtx } from './_generated/server'
import { mutation, query } from './_generated/server'

const PublishStatus = v.union(v.literal('draft'), v.literal('published'))

// Helper function to strip HTML tags and create plain text
function stripHtml(html: string): string {
  return (
    html
      // Replace all HTML tags with a space so adjacent text nodes stay separated
      .replaceAll(/<[^>]*>/g, ' ')
      // Replace common HTML entities with spaces so we don't accidentally join words
      .replaceAll('&nbsp;', ' ')
      .replaceAll(/&[^;]+;/g, ' ')
      // Collapse any runs of whitespace down to a single space
      .replaceAll(/\s+/g, ' ')
      .trim()
  )
}

async function resolveUpdateImageIds(
  ctx: QueryCtx,
  updateId: Id<'updates'>,
  existingImageIds: Array<Id<'images'>>,
): Promise<Array<Id<'images'>>> {
  if (existingImageIds.length > 0) {
    return existingImageIds
  }

  const images = await ctx.db
    .query('images')
    .withIndex('by_entityType', q => q.eq('entityRef.type', 'update'))
    .filter(q => q.eq(q.field('entityRef.id'), updateId))
    .collect()

  if (images.length === 0) {
    return existingImageIds
  }

  return images.map((img: { _id: Id<'images'> }) => img._id)
}

export const createDraft = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    contentHtml: v.optional(v.string()),
    authorId: v.id('users'),
    imageIds: v.optional(v.array(v.id('images'))),
    tags: v.optional(v.array(v.string())),
    eventDate: v.optional(v.number()),
  },
  returns: v.id('updates'),
  handler: async (ctx, args) => {
    const now = Date.now()
    // If contentHtml is provided, derive plain text content from it
    // Otherwise use the provided content (for backward compatibility)
    const plainContent = args.contentHtml ? stripHtml(args.contentHtml) : args.content
    const imageIdsToSave = args.imageIds ?? []
    console.log('[createDraft] Received imageIds:', args.imageIds, 'Will save:', imageIdsToSave)
    const updateId = await ctx.db.insert('updates', {
      title: args.title,
      slug: args.slug,
      content: plainContent,
      contentHtml: args.contentHtml,
      publishStatus: 'draft',
      createdAt: now,
      publishedAt: undefined,
      eventDate: args.eventDate,
      authorId: args.authorId,
      imageIds: imageIdsToSave,
      tags: args.tags,
    })
    console.log('[createDraft] Created update:', updateId, 'with imageIds:', imageIdsToSave)
    return updateId
  },
})

export const updateDraft = mutation({
  args: {
    updateId: v.id('updates'),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.string()),
    contentHtml: v.optional(v.string()),
    imageIds: v.optional(v.array(v.id('images'))),
    tags: v.optional(v.array(v.string())),
    eventDate: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { updateId, contentHtml, imageIds, ...patch } = args
    const row = await ctx.db.get(updateId)
    if (!row) return null

    // If contentHtml is provided, derive plain text content from it
    const updatePatch: Record<string, unknown> = { ...patch }
    if (contentHtml !== undefined) {
      updatePatch.contentHtml = contentHtml
      updatePatch.content = stripHtml(contentHtml)
    }

    // Explicitly handle imageIds - only include if provided
    if (imageIds === undefined) {
      console.log('[updateDraft] imageIds is undefined, preserving existing value')
    } else {
      updatePatch.imageIds = imageIds
      console.log('[updateDraft] Updating imageIds to:', imageIds)
    }

    console.log('[updateDraft] Patch object:', updatePatch)
    await ctx.db.patch(updateId, updatePatch)

    // Verify what was saved
    const updated = await ctx.db.get(updateId)
    console.log('[updateDraft] After patch, update.imageIds:', updated?.imageIds)

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

export const deleteUpdate = mutation({
  args: { updateId: v.id('updates') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.updateId)
    if (!row) return null
    await ctx.db.delete(args.updateId)
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
      eventDate: v.optional(v.number()),
      authorName: v.string(),
      authorAvatarUrl: v.optional(v.string()),
    }),
  ),
  handler: async ctx => {
    const rows = await ctx.db
      .query('updates')
      .filter(q => q.eq(q.field('publishStatus'), 'published'))
      .collect()
    rows.sort((a, b) => b.createdAt - a.createdAt)
    return Promise.all(
      rows.map(async u => {
        const author = await ctx.db.get(u.authorId as Id<'users'>)
        return {
          _id: u._id,
          title: u.title,
          slug: u.slug,
          createdAt: u.createdAt,
          publishedAt: u.publishedAt,
          eventDate: u.eventDate,
          authorName: author?.name ?? 'Unknown author',
          authorAvatarUrl: author?.avatarUrl,
        }
      }),
    )
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
      contentHtml: v.optional(v.string()),
      publishStatus: PublishStatus,
      createdAt: v.number(),
      publishedAt: v.optional(v.number()),
      eventDate: v.optional(v.number()),
      authorId: v.id('users'),
      authorName: v.string(),
      authorAvatarUrl: v.optional(v.string()),
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
    const imageIds = await resolveUpdateImageIds(ctx, doc._id as Id<'updates'>, doc.imageIds)
    const author = await ctx.db.get(doc.authorId as Id<'users'>)
    return {
      _id: doc._id,
      _creationTime: doc._creationTime,
      title: doc.title,
      slug: doc.slug,
      content: doc.content,
      contentHtml: doc.contentHtml,
      publishStatus: doc.publishStatus,
      createdAt: doc.createdAt,
      publishedAt: doc.publishedAt,
      eventDate: doc.eventDate,
      authorId: doc.authorId,
      authorName: author?.name ?? 'Unknown author',
      authorAvatarUrl: author?.avatarUrl,
      imageIds,
      tags: doc.tags,
    }
  },
})

export const listPublicForTimeline = query({
  args: {},
  returns: v.object({
    items: v.array(
      v.union(
        v.object({
          type: v.literal('update'),
          _id: v.id('updates'),
          title: v.string(),
          slug: v.string(),
          content: v.string(),
          excerpt: v.string(),
          publishedAt: v.number(),
          createdAt: v.number(),
          eventDate: v.optional(v.number()),
          authorName: v.string(),
          authorAvatarUrl: v.optional(v.string()),
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
        v.object({
          type: v.literal('part'),
          _id: v.id('parts'),
          title: v.string(),
          priceCents: v.number(),
          date: v.number(),
          createdAt: v.number(),
          url: v.optional(v.string()),
          vendor: v.optional(v.string()),
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
    ),
    totalSpentCents: v.number(),
  }),
  handler: async ctx => {
    const updates = await ctx.db
      .query('updates')
      .filter(q => q.eq(q.field('publishStatus'), 'published'))
      .collect()

    const parts = await ctx.db
      .query('parts')
      .filter(q => q.eq(q.field('isForCar'), true))
      .collect()

    const activeParts = parts.filter(p => p.status !== 'cancelled')
    const totalSpentCents = activeParts.reduce((acc, part) => acc + part.priceCents * (part.quantity ?? 1), 0)

    // Helper to strip markdown or HTML and create excerpt
    const createExcerpt = (update: { content: string; contentHtml?: string }, maxLength = 200): string => {
      let text: string

      // If contentHtml exists, strip HTML to plain text
      if (update.contentHtml) {
        text = stripHtml(update.contentHtml)
      } else {
        // Otherwise, strip markdown
        text = update.content
          .replaceAll(/^#{1,6}\s+/gm, '') // Headers
          .replaceAll(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
          .replaceAll(/!\[([^\]]*)\]\([^)]+\)/g, '') // Images
          .replaceAll(/\*\*([^*]+)\*\*/g, '$1') // Bold
          .replaceAll(/\*([^*]+)\*/g, '$1') // Italic
          .replaceAll(/`([^`]+)`/g, '$1') // Inline code
          .replaceAll(/```[\s\S]*?```/g, '') // Code blocks
          .replaceAll(/\n+/g, ' ') // Newlines to spaces
          .trim()
      }

      if (text.length <= maxLength) return text
      return text.slice(0, maxLength).trim() + '...'
    }

    // Resolve hero images and create excerpts
    const processedUpdates = await Promise.all(
      updates.map(async update => {
        const imageIds = await resolveUpdateImageIds(ctx, update._id as Id<'updates'>, update.imageIds)

        const heroImageId = imageIds[0]
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

        const author = await ctx.db.get(update.authorId as Id<'users'>)

        const excerpt = createExcerpt(update)

        return {
          type: 'update' as const,
          _id: update._id,
          title: update.title,
          slug: update.slug,
          content: update.content,
          excerpt,
          publishedAt: update.eventDate ?? update.publishedAt ?? update.createdAt,
          createdAt: update.createdAt,
          eventDate: update.eventDate,
          authorName: author?.name ?? 'Unknown author',
          authorAvatarUrl: author?.avatarUrl,
          heroImage,
        }
      }),
    )

    const processedParts = await Promise.all(
      activeParts.map(async part => {
        let heroImage = null
        // Use the first image if available
        if (part.imageIds && part.imageIds.length > 0) {
          const firstImageId = part.imageIds[0]
          if (firstImageId) {
            const img = await ctx.db.get(firstImageId)
            if (img) {
              heroImage = {
                _id: img._id,
                url: img.url,
                width: img.width,
                height: img.height,
              }
            }
          }
        }

        return {
          type: 'part' as const,
          _id: part._id,
          title: part.name,
          priceCents: part.priceCents,
          date: part.purchasedOn ?? part.installedOn ?? part.createdAt,
          createdAt: part.createdAt,
          url: part.sourceUrl,
          vendor: part.vendor,
          heroImage,
        }
      }),
    )

    const allItems = [...processedUpdates, ...processedParts]

    // Sort by eventDate (or publishedAt/createdAt fallback), newest first
    allItems.sort((a, b) => {
      const aDate = a.type === 'update' ? a.publishedAt : a.date
      const bDate = b.type === 'update' ? b.publishedAt : b.date
      return bDate - aDate
    })

    return {
      items: allItems,
      totalSpentCents,
    }
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
      eventDate: v.optional(v.number()),
      imageIds: v.array(v.id('images')),
    }),
  ),
  handler: async ctx => {
    const rows = await ctx.db.query('updates').collect()
    // Sort by display date (eventDate ?? publishedAt ?? createdAt), newest first
    rows.sort((a, b) => {
      const aDate = a.eventDate ?? a.publishedAt ?? a.createdAt
      const bDate = b.eventDate ?? b.publishedAt ?? b.createdAt
      return bDate - aDate
    })
    return Promise.all(
      rows.map(async u => {
        const imageIds = await resolveUpdateImageIds(ctx, u._id as Id<'updates'>, u.imageIds)
        return {
          _id: u._id,
          title: u.title,
          slug: u.slug,
          publishStatus: u.publishStatus,
          createdAt: u.createdAt,
          publishedAt: u.publishedAt,
          eventDate: u.eventDate,
          imageIds,
        }
      }),
    )
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
      contentHtml: v.optional(v.string()),
      publishStatus: PublishStatus,
      createdAt: v.number(),
      publishedAt: v.optional(v.number()),
      eventDate: v.optional(v.number()),
      imageIds: v.array(v.id('images')),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const update = await ctx.db.get(args.updateId)
    if (!update) return null
    const imageIds = await resolveUpdateImageIds(ctx, update._id as Id<'updates'>, update.imageIds)
    return {
      _id: update._id,
      title: update.title,
      slug: update.slug,
      content: update.content,
      contentHtml: update.contentHtml,
      publishStatus: update.publishStatus,
      createdAt: update.createdAt,
      publishedAt: update.publishedAt,
      eventDate: update.eventDate,
      imageIds,
    }
  },
})

export const listPublicForRss = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('updates'),
      title: v.string(),
      slug: v.string(),
      content: v.string(),
      contentHtml: v.optional(v.string()),
      publishedAt: v.number(),
      createdAt: v.number(),
      eventDate: v.optional(v.number()),
      authorName: v.string(),
    }),
  ),
  handler: async ctx => {
    const rows = await ctx.db
      .query('updates')
      .filter(q => q.eq(q.field('publishStatus'), 'published'))
      .collect()

    // Sort by eventDate (or publishedAt/createdAt fallback), newest first
    rows.sort((a, b) => {
      const aDate = a.eventDate ?? a.publishedAt ?? a.createdAt
      const bDate = b.eventDate ?? b.publishedAt ?? b.createdAt
      return bDate - aDate
    })

    const results = await Promise.all(
      rows.map(async update => {
        const author = await ctx.db.get(update.authorId as Id<'users'>)
        return {
          _id: update._id,
          title: update.title,
          slug: update.slug,
          content: update.content,
          contentHtml: update.contentHtml,
          publishedAt: update.eventDate ?? update.publishedAt ?? update.createdAt,
          createdAt: update.createdAt,
          eventDate: update.eventDate,
          authorName: author?.name ?? 'Unknown author',
        }
      }),
    )

    return results
  },
})
