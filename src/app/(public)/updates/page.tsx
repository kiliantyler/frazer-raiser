import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import Link from 'next/link'
import { connection } from 'next/server'

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default async function PublicUpdatesPage() {
  // Mark this route as dynamic for Next.js 16 so that libraries using randomness
  // internally (like Convex's client) don't trip the prerender-random check.
  await connection()

  const items = await fetchQuery(api.updates.listPublic, {})

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-serif text-3xl">Updates</h1>
      <p className="mt-2 text-muted-foreground">Latest journal entries and project updates.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <p className="col-span-full text-muted-foreground">No updates yet.</p>
        ) : (
          items.map(item => (
            <Link key={item._id} href={`/updates/${item.slug}`}>
              <Card className="h-full transition-all duration-300 hover:border-border hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="font-serif text-xl transition-colors hover:text-primary">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.eventDate
                      ? formatDate(item.eventDate)
                      : item.publishedAt
                        ? formatDate(item.publishedAt)
                        : formatDate(item.createdAt)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </main>
  )
}
