import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

const TaskStatus = v.union(v.literal('todo'), v.literal('in_progress'), v.literal('blocked'), v.literal('done'))
const TaskPriority = v.union(v.literal('low'), v.literal('medium'), v.literal('high'))

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: TaskStatus,
    priority: TaskPriority,
    assignedTo: v.optional(v.id('users')),
    dueDate: v.optional(v.number()),
    costEstimateCents: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    progressPct: v.number(),
    imageIds: v.optional(v.array(v.id('images'))),
    createdBy: v.id('users'),
  },
  returns: v.id('tasks'),
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert('tasks', {
      title: args.title,
      description: args.description,
      status: args.status,
      priority: args.priority,
      assignedTo: args.assignedTo,
      dueDate: args.dueDate,
      costEstimateCents: args.costEstimateCents,
      tags: args.tags,
      progressPct: args.progressPct,
      imageIds: args.imageIds ?? [],
      createdBy: args.createdBy,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const update = mutation({
  args: {
    taskId: v.id('tasks'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(TaskStatus),
    priority: v.optional(TaskPriority),
    assignedTo: v.optional(v.id('users')),
    dueDate: v.optional(v.number()),
    costEstimateCents: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    progressPct: v.optional(v.number()),
    imageIds: v.optional(v.array(v.id('images'))),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { taskId, ...patch } = args
    const task = await ctx.db.get(taskId)
    if (!task) return null
    await ctx.db.patch(taskId, { ...patch, updatedAt: Date.now() })
    return null
  },
})

export const get = query({
  args: { taskId: v.id('tasks') },
  returns: v.union(
    v.object({
      _id: v.id('tasks'),
      title: v.string(),
      description: v.optional(v.string()),
      status: TaskStatus,
      priority: TaskPriority,
      assignedTo: v.optional(v.id('users')),
      dueDate: v.optional(v.number()),
      costEstimateCents: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
      progressPct: v.number(),
      imageIds: v.array(v.id('images')),
      createdBy: v.id('users'),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.taskId)
  },
})

export const listByStatus = query({
  args: { status: TaskStatus },
  returns: v.array(v.object({ _id: v.id('tasks'), title: v.string(), status: TaskStatus, priority: TaskPriority })),
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query('tasks')
      .filter(q => q.eq(q.field('status'), args.status))
      .collect()
    return rows.map(t => ({ _id: t._id, title: t.title, status: t.status, priority: t.priority }))
  },
})

export const listByAssignee = query({
  args: { assignedTo: v.id('users') },
  returns: v.array(v.object({ _id: v.id('tasks'), title: v.string(), status: TaskStatus, priority: TaskPriority })),
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query('tasks')
      .filter(q => q.eq(q.field('assignedTo'), args.assignedTo))
      .collect()
    return rows.map(t => ({ _id: t._id, title: t.title, status: t.status, priority: t.priority }))
  },
})

export const listUpcoming = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(
    v.object({
      _id: v.id('tasks'),
      title: v.string(),
      dueDate: v.number(),
      status: TaskStatus,
      priority: TaskPriority,
    }),
  ),
  handler: async (ctx, args) => {
    const now = Date.now()
    const rows = await ctx.db.query('tasks').collect()
    const sorted = rows
      .filter(t => t.dueDate !== undefined && t.dueDate >= now)
      .map(t => ({
        _id: t._id,
        title: t.title,
        dueDate: t.dueDate!,
        status: t.status,
        priority: t.priority,
      }))
      .toSorted((a, b) => a.dueDate - b.dueDate)
    return args.limit ? sorted.slice(0, args.limit) : sorted
  },
})
