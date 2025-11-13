import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchQuery } from 'convex/nextjs'
import { updateRoleAction } from './actions'

type Collaborator = {
  _id: string
  email: string
  name: string
  avatarUrl?: string
  role: 'ADMIN' | 'COLLABORATOR' | 'VIEWER'
}

export default async function CollaboratorsPage() {
  const { user } = await withAuth({ ensureSignedIn: true })
  const me = user ? await fetchQuery(api.users.getByWorkosUserId, { workosUserId: user.id }) : null
  const canAdmin = me?.role === 'ADMIN'
  const users = (await fetchQuery(api.users.list, {})) as Collaborator[]
  return (
    <section className="space-y-6">
      <h1 className="font-serif text-2xl">Collaborators</h1>
      <table className="w-full text-sm">
        <thead className="text-left text-muted-foreground">
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Role</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {users.map((u: Collaborator) => (
            <tr key={String(u._id)} className="border-t border-border/40">
              <td className="py-2">{u.name}</td>
              <td className="py-2">{u.email}</td>
              <td className="py-2">{u.role}</td>
              <td className="py-2">
                {canAdmin && (
                  <form action={updateRoleAction} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={String(u._id)} />
                    <select name="role" className="bg-background border border-border/40 rounded px-2 py-1">
                      <option value="VIEWER">Viewer</option>
                      <option value="COLLABORATOR">Collaborator</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <button className="text-primary underline" type="submit">
                      Update
                    </button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
