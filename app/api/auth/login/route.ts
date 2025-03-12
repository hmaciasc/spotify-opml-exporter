import { NextResponse } from "next/server"
import { validateEnv, getEnv } from "@/lib/env"
import crypto from "crypto"

export async function GET() {
  console.log("Starting login process...")
  console.log("Current environment:", process.env.NODE_ENV)
  console.log("Checking for required environment variables...")

  // Validate environment variables before proceeding
  try {
    validateEnv()
  } catch (error) {
    console.error("Environment validation failed:", error)

    // Return a more helpful error message
    return NextResponse.json(
      {
        error: "Server configuration error. Please check environment variables.",
        details: "The .env.local file may not be loading correctly. Make sure it exists in the project root.",
        missingVars: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }

  // Use getEnv to safely get environment variables with fallbacks
  const clientId = getEnv("SPOTIFY_CLIENT_ID")
  const appUrl = getEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")
  const redirectUri = `${appUrl}/api/auth/callback`
  const scope = "user-library-read user-read-private user-read-email"

  // Generate a random string for state using crypto
  const state = crypto.randomBytes(16).toString("hex")

  console.log(`Redirecting to Spotify authorization with redirect URI: ${redirectUri}`)

  // Store state in a cookie for verification later
  const response = NextResponse.redirect(
    `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=${encodeURIComponent(scope)}&state=${state}`,
  )

  response.cookies.set("spotify_auth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  })

  return response
}

