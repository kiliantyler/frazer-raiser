import { StatCard } from '@/components/private/stat-card'

type AdminStatsProps = {
  totalUsers: number
  totalAdmins: number
  totalTasks: number
  totalPublishedUpdates: number
}

export function AdminStats({ totalUsers, totalAdmins, totalTasks, totalPublishedUpdates }: AdminStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Collaborators" value={totalUsers} />
      <StatCard title="Admins" value={totalAdmins} valueClassName="text-emerald-500" />
      <StatCard title="Tasks" value={totalTasks} />
      <StatCard title="Published Updates" value={totalPublishedUpdates} />
    </div>
  )
}
