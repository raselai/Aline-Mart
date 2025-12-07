import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Temporary proxy - authentication will be enabled in Phase 6
export function proxy(request: NextRequest) {
  // For now, allow all requests to pass through
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/account/:path*",
  ],
}
