import type { NextRequest } from "next/server"
import { getEnv } from "./env"

export async function getAccessToken(request: NextRequest): Promise<string | null> {
  const accessToken = request.cookies.get("spotify_access_token")?.value
  const refreshToken = request.cookies.get("spotify_refresh_token")?.value

  if (!accessToken) {
    console.log("No access token found in cookies")

    if (!refreshToken) {
      console.log("No refresh token found in cookies")
      return null
    }

    console.log("Attempting to refresh token")
    // Try to refresh the token
    return refreshAccessToken(refreshToken)
  }

  return accessToken
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const clientId = getEnv("SPOTIFY_CLIENT_ID")
    const clientSecret = getEnv("SPOTIFY_CLIENT_SECRET")

    if (!clientId || !clientSecret) {
      console.error("Missing Spotify credentials")
      return null
    }

    console.log("Refreshing token with Spotify API")
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      // Add cache: 'no-store' to prevent caching issues
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      console.error(`Failed to refresh token: ${response.status}`, errorText)
      throw new Error(`Token refresh failed: ${response.status}`)
    }

    const data = await response.json()
    console.log("Token refreshed successfully")
    return data.access_token
  } catch (error) {
    console.error("Error refreshing token:", error)
    return null
  }
}

