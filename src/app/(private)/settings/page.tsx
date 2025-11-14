import { PageHeader } from '@/components/private/page-header'

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <PageHeader title="Settings" />
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>Theme is dark by default. Additional settings (gallery curation, integrations status) to follow.</p>
      </div>
    </section>
  )
}
