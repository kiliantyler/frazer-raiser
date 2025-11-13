import { notFound } from 'next/navigation'

type Props = { params: { slug: string } }

export default async function UpdateDetailPage({ params }: Props) {
  const { slug } = params
  // Placeholder; will fetch from Convex `updates.getBySlug`
  if (!slug) return notFound()
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-serif text-3xl">{slug}</h1>
      <div className="prose prose-invert mt-6 max-w-none">
        <p>Update content will appear here.</p>
      </div>
    </main>
  )
}
