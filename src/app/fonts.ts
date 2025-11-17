import { Inter, Playfair_Display } from 'next/font/google'
import localFont from 'next/font/local'

export const displayFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
})

export const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const frazerFont = localFont({
  src: [
    {
      path: '../../fonts/Frazer.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/Frazer.woff',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-frazer',
  display: 'swap',
})
