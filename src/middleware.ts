import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /login, /dashboard)
  const path = request.nextUrl.pathname

  // If running on localhost and trying to access auth callback, redirect to production
  if (request.nextUrl.hostname === 'localhost' && path === '/auth/callback') {
    const url = new URL(request.url)
    url.hostname = 'hub.instabids.ai'
    url.protocol = 'https:'
    url.port = ''
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/auth/callback', '/login', '/dashboard']
}