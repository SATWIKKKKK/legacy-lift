import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Public routes that don't need authentication
  const publicRoutes = ["/api/auth/login", "/api/auth/register", "/api/health"]

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Protected API routes
  if (pathname.startsWith("/api/")) {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Add user ID to headers for use in route handlers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", decoded.userId)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}
