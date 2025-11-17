import { ConvexProvider } from '@/providers/convex-provider'
import { PostHogClientProvider } from '@/providers/posthog-provider'
import '@/styles/globals.css'
import { type Metadata } from 'next'
import { Suspense } from 'react'
import { bodyFont, displayFont, frazerFont } from './fonts'

export const metadata: Metadata = {
  title: 'Frazer Raiser',
  description: 'Restoration of a 1948 Frazer',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
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
