import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Check for demo admin authentication cookie first
  const adminCookie = request.cookies.get('sccAdminUser')
  console.log('Middleware - Admin cookie:', adminCookie?.value ? 'exists' : 'none')
  console.log('Middleware - Request path:', request.nextUrl.pathname)
  
  // If accessing admin routes and not authenticated, redirect to login
  if (request.nextUrl.pathname.startsWith('/admin') && !adminCookie) {
    console.log('Middleware - No admin cookie, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}