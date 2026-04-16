import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const COOKIE_NAME = "birth-session"

function getSecret() {
  const raw = process.env.JWT_SECRET
  if (!raw) return new TextEncoder().encode("fallback-dev-secret")
  return new TextEncoder().encode(raw)
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value

  // Redirect logged-in users away from login
  if (pathname.startsWith("/auth/login") && token) {
    try {
      await jwtVerify(token, getSecret())
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } catch {
      // Invalid token — let them reach the login page
    }
  }

  // Protect all /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
    try {
      await jwtVerify(token, getSecret())
    } catch {
      const response = NextResponse.redirect(new URL("/auth/login", request.url))
      response.cookies.delete(COOKIE_NAME)
      return response
    }
  }

  return NextResponse.next()
}

export const proxyConfig = {
  matcher: ["/dashboard/:path*", "/auth/login"],
}
