import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Define protected routes
  const protectedRoutes = ["/dashboard"]

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  // If it's a protected route, check for the access token
  if (isProtectedRoute) {
    const accessToken = request.cookies.get("spotify_access_token")?.value

    // If there's no access token, redirect to the login page
    if (!accessToken) {
      console.log(`No access token found for protected route: ${path}, redirecting to login`)
      return NextResponse.redirect(new URL("/?error=session_expired", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}

