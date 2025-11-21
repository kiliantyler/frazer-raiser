'use server'

import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { revalidatePath } from 'next/cache'

export async function createTaskAction(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  if (!title) return
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return
  const me = await fetchQuery(api.users.getByWorkosUserId, { workosUserId: user.id })
  if (!me) return
  await fetchMutation(api.tasks.create, {
    title,
    description: undefined,
    status: 'todo',
    priority: 'medium',
    assignedTo: undefined,
    dueDate: undefined,
    costEstimateCents: undefined,
    tags: undefined,
    progressPct: 0,
    imageIds: [],
    createdBy: me._id,
  })
  revalidatePath('/tasks')
}

export async function updateTaskStatusAction(formData: FormData) {
  const taskId = String(formData.get('taskId') ?? '')
  const status = String(formData.get('status') ?? '')
  if (!taskId || !status) return
  await fetchMutation(api.tasks.update, {
    taskId: taskId as unknown as Id<'tasks'>,
    status: status as 'todo' | 'in_progress' | 'blocked' | 'done',
  })
  revalidatePath('/tasks')
}

export async function updateTaskAction(formData: FormData) {
  const taskId = String(formData.get('taskId') ?? '')
  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const priority = String(formData.get('priority') ?? '')
  const dueDateStr = String(formData.get('dueDate') ?? '')
  const tags = String(formData.get('tags') ?? '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)

  if (!taskId || !title) return

  await fetchMutation(api.tasks.update, {
    taskId: taskId as unknown as Id<'tasks'>,
    title,
    description: description || undefined,
    priority: priority as 'low' | 'medium' | 'high',
    dueDate: dueDateStr ? new Date(dueDateStr).getTime() : undefined,
    tags: tags.length > 0 ? tags : undefined,
  })
  revalidatePath('/tasks')
}
