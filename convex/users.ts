import { v } from 'convex/values'
import type { Id } from './_generated/dataModel'
import { mutation, query } from './_generated/server'

type Role = 'ADMIN' | 'COLLABORATOR' | 'VIEWER'

export const upsert = mutation({
  args: {
    workosUserId: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  returns: v.object({
    userId: v.id('users'),
    role: v.union(v.literal('ADMIN'), v.literal('COLLABORATOR'), v.literal('VIEWER')),
  }),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('workosUserId'), args.workosUserId))
      .unique()
      .catch(() => null)

    if (existing) {
      const updated = {
        ...existing,
        email: args.email,
        name: args.name,
        avatarUrl: args.avatarUrl ?? existing.avatarUrl,
      }
      await ctx.db.replace(existing._id, updated)
      return { userId: existing._id, role: existing.role as Role }
    }

    const count = await ctx.db.query('users').take(1)
    const role: Role = count.length === 0 ? 'ADMIN' : 'COLLABORATOR'
    const userId = await ctx.db.insert('users', {
      workosUserId: args.workosUserId,
      email: args.email,
      name: args.name,
      avatarUrl: args.avatarUrl,
      role,
      createdAt: Date.now(),
    })
    return { userId, role }
  },
})

export const getByWorkosUserId = query({
  args: { workosUserId: v.string() },
  returns: v.union(
    v.object({
      _id: v.id('users'),
      _creationTime: v.number(),
      workosUserId: v.string(),
      email: v.string(),
      name: v.string(),
      avatarUrl: v.optional(v.string()),
      role: v.union(v.literal('ADMIN'), v.literal('COLLABORATOR'), v.literal('VIEWER')),
      createdAt: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('workosUserId'), args.workosUserId))
      .unique()
      .catch(() => null)
  },
})

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('users'),
      email: v.string(),
      name: v.string(),
      avatarUrl: v.optional(v.string()),
      role: v.union(v.literal('ADMIN'), v.literal('COLLABORATOR'), v.literal('VIEWER')),
    }),
  ),
  handler: async ctx => {
    const rows = await ctx.db.query('users').collect()
    return rows.map(u => ({
      _id: u._id,
      email: u.email,
      name: u.name,
      avatarUrl: u.avatarUrl,
      role: u.role,
    }))
  },
})

export const updateRole = mutation({
  args: {
    actorUserId: v.id('users'),
    userId: v.id('users'),
    role: v.union(v.literal('ADMIN'), v.literal('COLLABORATOR'), v.literal('VIEWER')),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const actor = await ctx.db.get(args.actorUserId as Id<'users'>)
    if (!actor || actor.role !== 'ADMIN') {
      throw new Error('Forbidden')
    }
    const target = await ctx.db.get(args.userId as Id<'users'>)
    if (!target) return null
    await ctx.db.patch(target._id, { role: args.role })
    return null
  },
})

export const updateProfile = mutation({
  args: {
    userId: v.id('users'),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)
    if (!user) {
      throw new Error('User not found')
    }

    const updates: {
      name?: string
      email?: string
      avatarUrl?: string
    } = {}

    if (args.name !== undefined) {
      updates.name = args.name
    }
    if (args.email !== undefined) {
      updates.email = args.email
    }
    if (args.avatarUrl !== undefined) {
      updates.avatarUrl = args.avatarUrl
    }

    await ctx.db.patch(args.userId, updates)
    return null
  },
})
