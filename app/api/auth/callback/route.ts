import { type NextRequest, NextResponse } from "next/server"
import { getEnv } from "@/lib/env"

export async function GET(request: NextRequest) {
  console.log("Auth callback received")

  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const storedState = request.cookies.get("spotify_auth_state")?.value

  // Verify state to prevent CSRF attacks
  if (!state || state !== storedState) {
    console.error("State mismatch in callback")
    return NextResponse.redirect(`${getEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")}?error=state_mismatch`)
  }

  if (!code) {
    console.error("No code in callback")
    return NextResponse.redirect(`${getEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")}?error=no_code`)
  }

  try {
    const clientId = getEnv("SPOTIFY_CLIENT_ID")
    const clientSecret = getEnv("SPOTIFY_CLIENT_SECRET")
    const redirectUri = `${getEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")}/api/auth/callback`

    console.log(`Exchanging code for token with redirect URI: ${redirectUri}`)

    // Exchange code for access token
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text().catch(() => "Unknown error")
      console.error(`Token exchange failed: ${tokenResponse.status}`, errorText)
      throw new Error(`Failed to get access token: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()
    console.log("Token exchange successful")

    // Set tokens in cookies
    const appUrl = getEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")
    const response = NextResponse.redirect(`${appUrl}/dashboard`)

    response.cookies.set("spotify_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenData.expires_in,
      path: "/",
      sameSite: "lax", // Add this to ensure cookies work properly with redirects
    })

    if (tokenData.refresh_token) {
      response.cookies.set("spotify_refresh_token", tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
        sameSite: "lax",
      })
    }

    // Clear the state cookie
    response.cookies.set("spotify_auth_state", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Error during authentication:", error)
    return NextResponse.redirect(
      `${getEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")}?error=authentication_failed`,
    )
  }
}

