import { EmptyState } from '@/components/private/empty-state'
import { SectionCard } from '@/components/private/section-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function AdminSections() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <SectionCard title="People & Access" viewAllHref="/collaborators">
        <p className="text-sm text-muted-foreground">
          Manage who can access the private dashboard and adjust collaborator roles across the project.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline" aria-label="Manage collaborators and roles">
            <Link href="/collaborators">Manage collaborators</Link>
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Project Data">
        <p className="text-sm text-muted-foreground">
          Quickly jump to the core data powering the project: tasks, parts, suppliers, and work logs.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline" aria-label="Go to tasks management">
            <Link href="/tasks">Tasks</Link>
          </Button>
          <Button asChild size="sm" variant="outline" aria-label="Go to parts and costs management">
            <Link href="/parts-costs">Parts &amp; costs</Link>
          </Button>
          <Button asChild size="sm" variant="outline" aria-label="Go to suppliers management">
            <Link href="/suppliers">Suppliers</Link>
          </Button>
          <Button asChild size="sm" variant="outline" aria-label="Go to work log">
            <Link href="/work-log">Work log</Link>
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Media & Story" viewAllHref="/internal-gallery" className="md:col-span-2">
        <p className="text-sm text-muted-foreground">
          Curate the project story and visuals that appear on the public site and internal dashboards.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline" aria-label="Go to internal gallery">
            <Link href="/internal-gallery">Internal gallery</Link>
          </Button>
          <Button asChild size="sm" variant="outline" aria-label="View public updates">
            <Link href="/updates">Public updates</Link>
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Site Settings" viewAllHref="/settings" className="md:col-span-2">
        <p className="text-sm text-muted-foreground">
          Configure high-level settings for the private dashboard and integrations.
        </p>
        <div className="mt-4">
          <EmptyState message="Most configuration lives in code today. Use settings for runtime tweaks." />
        </div>
      </SectionCard>
    </div>
  )
}
