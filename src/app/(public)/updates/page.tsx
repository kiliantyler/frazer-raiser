import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function PublicUpdatesPage() {
  // Placeholder static list; will fetch from Convex `updates.listPublic`
  const items = [] as Array<{ slug: string; title: string; publishedAt?: number }>
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-serif text-3xl">Updates</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.length === 0 ? (
          <p className="text-muted-foreground">No updates yet.</p>
        ) : (
          items.map(item => (
            <Card key={item.slug}>
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  <Link href={{ pathname: '/updates/[slug]', query: { slug: item.slug } }}>{item.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : null}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}
