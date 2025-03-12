import { NextResponse } from "next/server"

export async function GET() {
  const response = NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL || "/")

  // Clear all auth cookies
  response.cookies.set("spotify_access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })

  response.cookies.set("spotify_refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })

  return response
}

