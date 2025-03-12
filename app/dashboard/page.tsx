"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SpotifyLogo } from "@/components/spotify-logo"
import { Loader2, Download, LogOut } from "lucide-react"

interface Podcast {
  added_at: string,
  show: Show
}

interface Show {
  id: string
  name: string
  description: string
  images: { url: string }[]
  publisher: string
}

export default function Dashboard() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [user, setUser] = useState<{ display_name: string; images: { url: string }[] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user profile
        const userResponse = await fetch("/api/spotify/me")
        if (!userResponse.ok) {
          const errorData = await userResponse.json().catch(() => ({}))
          console.error("User API response error:", userResponse.status, errorData)
          throw new Error(`Failed to fetch user data: ${userResponse.status}`)
        }
        const userData = await userResponse.json()
        setUser(userData)
        console.log(userData)

        // Fetch podcasts
        const podcastsResponse = await fetch("/api/spotify/podcasts")
        if (!podcastsResponse.ok) {
          const errorData = await podcastsResponse.json().catch(() => ({}))
          console.error("Podcasts API response error:", podcastsResponse.status, errorData)
          throw new Error(`Failed to fetch podcasts: ${podcastsResponse.status}`)
        }
        const podcastsData = await podcastsResponse.json()
        console.log(podcastsData)
        podcastsData.items.map((podcast: Podcast) => {
          console.log(podcast.show.images)
        })
        setPodcasts(podcastsData.items || [])
      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const exportOPML = async () => {
    try {
      setExporting(true)
      const response = await fetch("/api/spotify/export-poml")
      if (!response.ok) throw new Error("Failed to export OPML")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = "spotify-podcasts.opml"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting OPML:", error)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center">
            <SpotifyLogo className="h-8 w-8 text-[#1DB954]" />
            <span className="ml-2 text-xl font-semibold">Spotify OPML Exporter</span>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user.images?.[0]?.url && (
                  <Image
                    src={user.images[0].url || "/placeholder.svg"}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm font-medium hidden sm:inline">{user.display_name}</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/api/auth/logout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Link>
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 container px-4 sm:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium mb-2">Error</h3>
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => (window.location.href = "/api/auth/login")}>
              Try logging in again
            </Button>
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Podcasts</h1>
            <p className="text-muted-foreground mt-1">
              {loading ? "Loading your podcasts..." : `${podcasts.length} podcasts found`}
            </p>
          </div>
          <Button
            onClick={exportOPML}
            disabled={loading || exporting || podcasts.length === 0}
            className="bg-[#1DB954] hover:bg-[#1DB954]/90"
          >
            {exporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export as OPML
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#1DB954]" />
          </div>
        ) : podcasts.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No podcasts found</h3>
            <p className="text-muted-foreground mb-4">You dont have any podcasts in your Spotify library.</p>
            <Button asChild variant="outline">
              <a href="https://open.spotify.com/genre/podcasts-web" target="_blank" rel="noopener noreferrer">
                Browse Podcasts on Spotify
              </a>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {podcasts.map((podcast) => (
              <Card key={podcast.show.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={podcast.show.images[2]?.url || "/placeholder.svg?height=300&width=300"}
                    alt={podcast.show.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-1">{podcast.show.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{podcast.show.publisher}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 sm:px-8 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Spotify OPML Exporter. All rights reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground">Not affiliated with Spotify AB</p>
        </div>
      </footer>
    </div>
  )
}

