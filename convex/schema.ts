import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    workosUserId: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    role: v.union(v.literal('ADMIN'), v.literal('COLLABORATOR'), v.literal('VIEWER')),
    createdAt: v.number(),
  })
    .index('by_workosUserId', ['workosUserId'])
    .index('by_email', ['email']),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal('todo'), v.literal('in_progress'), v.literal('blocked'), v.literal('done')),
    priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    assignedTo: v.optional(v.id('users')),
    dueDate: v.optional(v.number()),
    costEstimateCents: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    progressPct: v.number(),
    imageIds: v.array(v.id('images')),
    createdBy: v.id('users'),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_status', ['status'])
    .index('by_assignedTo', ['assignedTo'])
    .index('by_dueDate', ['dueDate']),

  parts: defineTable({
    name: v.string(),
    vendor: v.optional(v.string()),
    supplierId: v.optional(v.id('suppliers')),
    partNumber: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal('ordered'),
        v.literal('shipped'),
        v.literal('received'),
        v.literal('installed'),
        v.literal('cancelled'),
      ),
    ),
    priceCents: v.number(),
    quantity: v.optional(v.number()),
    isForCar: v.optional(v.boolean()),
    purchasedOn: v.optional(v.number()),
    installedOn: v.optional(v.number()),
    notes: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    linkedTaskId: v.optional(v.id('tasks')),
    imageIds: v.array(v.id('images')),
    createdBy: v.id('users'),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_installedOn', ['installedOn']),

  updates: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    contentHtml: v.optional(v.string()),
    publishStatus: v.union(v.literal('draft'), v.literal('published')),
    createdAt: v.number(),
    publishedAt: v.optional(v.number()),
    eventDate: v.optional(v.number()),
    authorId: v.id('users'),
    imageIds: v.array(v.id('images')),
    tags: v.optional(v.array(v.string())),
  })
    .index('by_publishStatus', ['publishStatus'])
    .index('by_slug', ['slug'])
    .index('by_createdAt', ['createdAt']),

  images: defineTable({
    utKey: v.string(),
    url: v.string(),
    width: v.number(),
    height: v.number(),
    size: v.number(),
    mime: v.string(),
    tags: v.optional(v.array(v.string())),
    dateTaken: v.optional(v.union(v.number(), v.null())),
    order: v.optional(v.number()),
    isPublished: v.optional(v.boolean()),
    entityRef: v.optional(
      v.object({
        type: v.union(v.literal('task'), v.literal('update'), v.literal('part')),
        id: v.union(v.id('tasks'), v.id('updates'), v.id('parts')),
      }),
    ),
    uploaderId: v.id('users'),
    visibility: v.union(v.literal('public'), v.literal('private')),
    createdAt: v.number(),
  })
    .index('by_visibility', ['visibility'])
    .index('by_entityType', ['entityRef.type'])
    .index('by_order', ['order'])
    .index('by_isPublished', ['isPublished']),

  workLogs: defineTable({
    date: v.number(),
    hours: v.number(),
    description: v.string(),
    taskId: v.optional(v.id('tasks')),
    partId: v.optional(v.id('parts')),
    costDeltaCents: v.optional(v.number()),
    authorId: v.id('users'),
  }).index('by_date', ['date']),

  guestbook: defineTable({
    name: v.string(),
    message: v.string(),
    createdAt: v.number(),
    isApproved: v.boolean(),
  })
    .index('by_isApproved', ['isApproved'])
    .index('by_createdAt', ['createdAt']),

  suppliers: defineTable({
    name: v.string(),
    websiteUrl: v.optional(v.string()),
    createdBy: v.id('users'),
    createdAt: v.number(),
  }).index('by_name', ['name']),

  settings: defineTable({
    budgetCents: v.number(),
    updatedAt: v.number(),
    updatedBy: v.id('users'),
  }),
})
