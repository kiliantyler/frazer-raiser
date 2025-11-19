import { UpdateContent } from '@/components/public/updates/update-content'
import { UpdateHeader } from '@/components/public/updates/update-header'
import { UpdateHeroImage } from '@/components/public/updates/update-hero-image'
import { getHeroImage, getUpdateBySlug } from '@/lib/data/updates'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ slug: string }> }

export default async function UpdateDetailPage({ params }: Props) {
  const { slug } = await params
  if (!slug) return notFound()

  const update = await getUpdateBySlug(slug)
  if (!update || update.publishStatus !== 'published') {
    return notFound()
  }

  const heroImage = await getHeroImage(update.imageIds)

  const displayDate = update.eventDate ?? update.publishedAt ?? update.createdAt

  return (
    <main className="mx-auto max-w-3xl px-6 pt-28 pb-12 md:pt-36">
      <article>
        <UpdateHeader
          title={update.title}
          displayDate={displayDate}
          authorName={update.authorName}
          authorAvatarUrl={update.authorAvatarUrl}
        />

        {heroImage && <UpdateHeroImage imageUrl={heroImage.url} alt={update.title} />}

        <div className="prose prose-invert prose-lg max-w-none">
          <UpdateContent contentHtml={update.contentHtml} content={update.content} />
        </div>
      </article>
    </main>
  )
}
