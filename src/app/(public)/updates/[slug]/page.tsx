import { api } from '@convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

type Props = { params: Promise<{ slug: string }> }

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default async function UpdateDetailPage({ params }: Props) {
  const { slug } = await params
  if (!slug) return notFound()

  const update = await fetchQuery(api.updates.getBySlug, { slug })
  if (!update || update.publishStatus !== 'published') {
    return notFound()
  }

  // Fetch hero image if available
  let heroImage = null
  if (update.imageIds.length > 0) {
    const imageId = update.imageIds[0]
    if (imageId) {
      const image = await fetchQuery(api.images.getById, { imageId })
      if (image) {
        heroImage = image
      }
    }
  }

  const publishedDate = update.publishedAt ?? update.createdAt

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <article>
        <header className="mb-8">
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">{update.title}</h1>
          <time dateTime={new Date(publishedDate).toISOString()} className="mt-2 block text-sm text-muted-foreground">
            {formatDate(publishedDate)}
          </time>
        </header>

        {heroImage && (
          <div className="mb-8 aspect-video overflow-hidden rounded-lg">
            <Image
              src={heroImage.url}
              alt={update.title}
              width={heroImage.width}
              height={heroImage.height}
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
        )}

        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="font-serif text-3xl font-bold mb-4 mt-8">{children}</h1>,
              h2: ({ children }) => <h2 className="font-serif text-2xl font-bold mb-3 mt-6">{children}</h2>,
              h3: ({ children }) => <h3 className="font-serif text-xl font-bold mb-2 mt-4">{children}</h3>,
              p: ({ children }) => <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>,
              ul: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">{children}</ul>,
              ol: ({ children }) => (
                <ol className="mb-4 ml-6 list-decimal space-y-2 text-muted-foreground">{children}</ol>
              ),
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="my-4 border-l-4 border-primary pl-4 italic text-muted-foreground">
                  {children}
                </blockquote>
              ),
              code: ({ children, className }) => {
                const isInline = !className
                return isInline ? (
                  <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">{children}</code>
                ) : (
                  <code className={className}>{children}</code>
                )
              },
              pre: ({ children }) => <pre className="mb-4 overflow-x-auto rounded-lg bg-muted p-4">{children}</pre>,
              a: ({ href, children }) => {
                if (!href) return <>{children}</>
                // Check if it's an external link (starts with http://, https://, //, or mailto:)
                const isExternal =
                  href.startsWith('http://') ||
                  href.startsWith('https://') ||
                  href.startsWith('//') ||
                  href.startsWith('mailto:')
                // Use Next.js Link for all links, with target="_blank" for external links
                return (
                  <Link
                    href={href as Route}
                    className="text-primary underline hover:text-primary/80"
                    target={isExternal && !href.startsWith('mailto:') ? '_blank' : undefined}
                    rel={isExternal && !href.startsWith('mailto:') ? 'noopener noreferrer' : undefined}>
                    {children}
                  </Link>
                )
              },
              img: ({ src, alt }) => {
                if (!src || typeof src !== 'string') return null
                // For external images, use Next.js Image with unoptimized
                // For internal images, we could optimize but markdown images are typically external
                return (
                  <div className="relative my-4 aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={src}
                      alt={alt || ''}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 800px"
                      unoptimized
                    />
                  </div>
                )
              },
            }}>
            {update.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  )
}
