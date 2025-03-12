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
    const podcasts = data.items || []

    // Generate POML content
    const pomlContent = generatePOML(podcasts)

    // Return as downloadable file
    return new NextResponse(pomlContent, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Disposition": "attachment; filename=spotify-podcasts.poml",
      },
    })
  } catch (error) {
    console.error("Error exporting POML:", error)
    return NextResponse.json({ error: "Failed to export POML" }, { status: 500 })
  }
}

function generatePOML(podcasts: any[]) {
  // Create XML header
  let poml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  poml += '<opml version="2.0">\n'
  poml += "  <head>\n"
  poml += "    <title>Spotify Podcasts</title>\n"
  poml += `    <dateCreated>${new Date().toISOString()}</dateCreated>\n`
  poml += "  </head>\n"
  poml += "  <body>\n"

  // Add each podcast as an outline element
  podcasts.forEach((item) => {
    const podcast = item.show
    const feedUrl = podcast.href || `https://open.spotify.com/show/${podcast.id}`

    poml += `    <outline text="${escapeXml(podcast.name)}" `
    poml += `type="rss" `
    poml += `xmlUrl="${escapeXml(feedUrl)}" `
    poml += `htmlUrl="${escapeXml(podcast.external_urls?.spotify || "")}" `
    poml += `/>\n`
  })

  // Close the XML structure
  poml += "  </body>\n"
  poml += "</opml>"

  return poml
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return ""
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

