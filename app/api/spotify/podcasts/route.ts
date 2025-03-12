import { type NextRequest, NextResponse } from "next/server"
import { getAccessToken } from "@/lib/spotify"

export async function GET(request: NextRequest) {
  try {
    const accessToken = await getAccessToken(request)

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user's saved shows (podcasts)
    const response = await fetch("https://api.spotify.com/v1/me/shows?limit=50", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch podcasts")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching podcasts:", error)
    return NextResponse.json({ error: "Failed to fetch podcasts" }, { status: 500 })
  }
}

