import { v } from 'convex/values'
import type { Id } from './_generated/dataModel'
import { mutation, query } from './_generated/server'

const DEFAULT_BUDGET_CENTS = 2500000 // $25,000

export const get = query({
  args: {},
  returns: v.object({
    budgetCents: v.number(),
  }),
  handler: async ctx => {
    const settings = await ctx.db.query('settings').first()
    if (!settings) {
      return { budgetCents: DEFAULT_BUDGET_CENTS }
    }
    return { budgetCents: settings.budgetCents }
  },
})

export const updateBudget = mutation({
  args: {
    actorUserId: v.id('users'),
    budgetCents: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const actor = await ctx.db.get(args.actorUserId as Id<'users'>)
    if (!actor || actor.role !== 'ADMIN') {
      throw new Error('Forbidden')
    }

    const existing = await ctx.db.query('settings').first()
    const now = Date.now()

    if (existing) {
      await ctx.db.patch(existing._id, {
        budgetCents: args.budgetCents,
        updatedAt: now,
        updatedBy: args.actorUserId,
      })
    } else {
      await ctx.db.insert('settings', {
        budgetCents: args.budgetCents,
        updatedAt: now,
        updatedBy: args.actorUserId,
      })
    }

    return null
  },
})
