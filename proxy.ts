/**
 * Next.js 16 Proxy Configuration
 * Protects admin routes and handles route-based authentication
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Add pathname to headers for layout access
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    // Allow access to login page
    if (pathname === '/admin/login') {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }

    // Check for admin session cookie
    const adminSession = request.cookies.get('admin_session')?.value

    if (!adminSession) {
      // Redirect to admin login if no session
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Parse session token (format: userId:email:role:expiresAt)
    try {
      const [, , role, expiresAtStr] = adminSession.split(':')
      const expiresAt = new Date(expiresAtStr)

      // Check if session expired
      if (expiresAt < new Date()) {
        const loginUrl = new URL('/admin/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        loginUrl.searchParams.set('expired', 'true')
        return NextResponse.redirect(loginUrl)
      }

      // Check if user has admin role
      if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        // Redirect to homepage with error
        const homeUrl = new URL('/', request.url)
        homeUrl.searchParams.set('error', 'access_denied')
        return NextResponse.redirect(homeUrl)
      }

      // Allow access to admin routes
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      // Invalid session format, redirect to login
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Allow all other routes
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// Configure which routes should be processed by proxy
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
