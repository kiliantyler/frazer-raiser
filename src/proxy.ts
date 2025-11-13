import { authkit } from '@workos-inc/authkit-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

function isPublicPath(pathname: string): boolean {
  if (pathname === '/') return true
  if (pathname.startsWith('/updates')) return true
  if (pathname === '/gallery') return true
  if (pathname === '/timeline') return true
  if (pathname === '/contact') return true
  if (pathname === '/about') return true
  if (pathname === '/login/callback') return true
  if (pathname.startsWith('/api/')) return true
  return false
}

function isValidReturnPath(pathname: string): boolean {
  // Don't use chunk files, static assets, or API routes as return paths
  if (pathname.startsWith('/_next')) return false
  if (pathname.startsWith('/api')) return false
  if (pathname.includes('.')) return false // No file extensions
  if (!pathname.startsWith('/')) return false
  return true
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const searchParams = request.nextUrl.searchParams

  // Skip processing if this is a static asset or invalid path
  if (!isValidReturnPath(pathname)) {
    return NextResponse.next()
  }

  // Skip RSC (React Server Component) requests - these are internal Next.js fetches
  // and should not trigger auth redirects (they'll be handled by the page navigation)
  if (searchParams.has('_rsc')) {
    return NextResponse.next()
  }

  const redirectUri = new URL('/login/callback', request.url).toString()

  const { session, headers, authorizationUrl } = await authkit(request, {
    redirectUri,
  })

  if (!isPublicPath(pathname) && !('user' in session && session.user) && authorizationUrl) {
    // Not authenticated on a protected route → redirect to AuthKit
    return NextResponse.redirect(authorizationUrl, { headers })
  }
  return NextResponse.next({ headers })
}

export const config = {
  // Skip Next.js assets and any file with an extension
  matcher: [String.raw`/((?!_next/static|_next/image|favicon.ico|.*\..*).*)`],
}
