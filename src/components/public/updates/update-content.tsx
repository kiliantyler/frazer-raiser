import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import sanitizeHtml from 'sanitize-html'

type UpdateContentProps = {
  contentHtml?: string
  content?: string
}

export function UpdateContent({ contentHtml, content }: UpdateContentProps) {
  if (contentHtml) {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(contentHtml, {
            allowedTags: [
              'p',
              'br',
              'strong',
              'em',
              'u',
              's',
              'del',
              'mark',
              'span',
              'h1',
              'h2',
              'h3',
              'ul',
              'ol',
              'li',
              'blockquote',
              'code',
              'pre',
              'a',
              'hr',
              'table',
              'thead',
              'tbody',
              'tr',
              'th',
              'td',
              'img',
            ],
            allowedAttributes: {
              a: ['href', 'target', 'rel'],
              img: ['src', 'alt', 'width', 'height'],
            },
            allowedStyles: {
              '*': {
                'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
              },
            },
            allowedSchemes: ['http', 'https', 'mailto'],
            allowedSchemesByTag: {
              img: ['http', 'https', 'data'],
            },
          }),
        }}
        className="[&_h1]:font-serif [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_ul]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:text-muted-foreground [&_ol]:mb-4 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:text-muted-foreground [&_li]:leading-relaxed [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_a]:text-primary [&_a]:underline [&_a:hover]:text-primary/80 [&_img]:my-4 [&_img]:rounded-lg [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2"
      />
    )
  }

  if (content) {
    return (
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="font-serif text-3xl font-bold mb-4 mt-8">{children}</h1>,
          h2: ({ children }) => <h2 className="font-serif text-2xl font-bold mb-3 mt-6">{children}</h2>,
          h3: ({ children }) => <h3 className="font-serif text-xl font-bold mb-2 mt-4">{children}</h3>,
          p: ({ children }) => <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>,
          ul: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-2 text-muted-foreground">{children}</ol>,
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
        {content}
      </ReactMarkdown>
    )
  }

  return null
}
