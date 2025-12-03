import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Check for demo admin authentication cookie first
  const adminCookie = request.cookies.get('sccAdminUser')
  console.log('Middleware - Admin cookie:', adminCookie?.value ? 'exists' : 'none')
  console.log('Middleware - Request path:', request.nextUrl.pathname)
  
  // If accessing admin login page and already authenticated, redirect to admin
  if (request.nextUrl.pathname === '/admin/login' && adminCookie) {
    console.log('Middleware - Already logged in, redirecting to admin')
    return NextResponse.redirect(new URL('/admin', request.url))
  }
  
  // If accessing admin routes (except login) and not authenticated, redirect to login
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    if (!adminCookie) {
      console.log('Middleware - No admin cookie, redirecting to login')
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/admin/login'
      return NextResponse.redirect(redirectUrl)
    }
    console.log('Middleware - Admin cookie exists, allowing access')
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/admin/login'],
}