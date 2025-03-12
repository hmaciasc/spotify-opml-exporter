import { type NextRequest, NextResponse } from "next/server"
import { getAccessToken } from "@/lib/spotify"

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching user profile")
    const accessToken = await getAccessToken(request)

    if (!accessToken) {
      console.log("No access token available for /api/spotify/me")
      return NextResponse.json({ error: "Unauthorized - No access token" }, { status: 401 })
    }

    console.log("Fetching user profile from Spotify API")
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      // Add cache: 'no-store' to prevent caching issues
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      console.error(`Spotify API error: ${response.status}`, errorText)
      return NextResponse.json(
        { error: `Failed to fetch user profile: ${response.status}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("User profile fetched successfully")
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in /api/spotify/me:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}

