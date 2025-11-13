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

export async function proxy(request: NextRequest) {
  const redirectUri = new URL('/login/callback', request.url).toString()
  const { session, headers, authorizationUrl } = await authkit(request, {
    redirectUri,
  })

  if (!isPublicPath(request.nextUrl.pathname) && !('user' in session && session.user) && authorizationUrl) {
    // Not authenticated on a protected route → redirect to AuthKit
    return NextResponse.redirect(authorizationUrl, { headers })
  }
  return NextResponse.next({ headers })
}

export const config = {
  // Skip Next.js assets and any file with an extension
  matcher: [String.raw`/((?!_next/static|_next/image|favicon.ico|.*\..*).*)`],
}
