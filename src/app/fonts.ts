import { Inter, Playfair_Display } from 'next/font/google'

export const displayFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
})

export const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})
