import { ConvexProvider } from '@/providers/convex-provider'
import { PostHogClientProvider } from '@/providers/posthog-provider'
import '@/styles/globals.css'
import { type Metadata } from 'next'
import { Suspense } from 'react'
import { bodyFont, displayFont, frazerFont } from './fonts'

export const metadata: Metadata = {
  title: 'Frazer Raiser',
  description: 'Restoration of a 1948 Frazer',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Frazer Raiser',
    description: 'Restoration of a 1948 Frazer',
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Frazer Raiser',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frazer Raiser',
    description: 'Restoration of a 1948 Frazer',
    images: ['/opengraph-image.jpg'],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${displayFont.variable} ${bodyFont.variable} ${frazerFont.variable}`}>
      <body>
        <Suspense fallback={null}>
          <ConvexProvider>
            <PostHogClientProvider>{children}</PostHogClientProvider>
          </ConvexProvider>
        </Suspense>
      </body>
    </html>
  )
}
