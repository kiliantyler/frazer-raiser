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

export async function assignToMeAction(formData: FormData) {
  const taskId = String(formData.get('taskId') ?? '')
  if (!taskId) return
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) return
  const me = await fetchQuery(api.users.getByWorkosUserId, { workosUserId: user.id })
  if (!me) return
  await fetchMutation(api.tasks.update, {
    taskId: taskId as unknown as Id<'tasks'>,
    assignedTo: me._id,
  })
  revalidatePath('/tasks')
}
