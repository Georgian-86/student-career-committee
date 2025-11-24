import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const user = request.cookies.get("sccAdmin")

    // Allow access to login page
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // Redirect to login if not authenticated
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
