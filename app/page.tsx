"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SpotifyLogo } from "@/components/spotify-logo"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [envStatus, setEnvStatus] = useState<{ loaded: boolean; message: string } | null>(null)

  useEffect(() => {
    // Check if environment variables are loaded
    const checkEnv = async () => {
      try {
        const response = await fetch("/api/check-env")
        const data = await response.json()
        setEnvStatus(data)
      } catch (err) {
        setEnvStatus({
          loaded: false,
          message: "Could not check environment variables",
        })
      }
    }

    checkEnv()

    const errorParam = searchParams.get("error")
    if (errorParam) {
      switch (errorParam) {
        case "state_mismatch":
          setError("Authentication failed: State mismatch")
          break
        case "no_code":
          setError("Authentication failed: No authorization code received")
          break
        case "authentication_failed":
          setError("Authentication failed: Could not authenticate with Spotify")
          break
        case "session_expired":
          setError("Your session has expired. Please log in again.")
          break
        default:
          setError(`Authentication error: ${errorParam}`)
      }
    }
  }, [searchParams])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-8">
          <SpotifyLogo className="h-8 w-8 text-[#1DB954]" />
          <span className="ml-2 text-xl font-semibold">Spotify POML Exporter</span>
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid items-center gap-6 py-8 md:py-12 px-4 sm:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Export Your Spotify Podcasts</h1>

            {envStatus && !envStatus.loaded && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 mb-6 max-w-[42rem] mx-auto">
                <h3 className="font-medium mb-2">Environment Configuration Issue</h3>
                <p className="mb-2">{envStatus.message}</p>
                <p className="text-sm">
                  Make sure your <code className="bg-amber-100 px-1 py-0.5 rounded">.env.local</code> file is in the
                  project root and contains the required variables.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6 max-w-[42rem] mx-auto">
                <p>{error}</p>
              </div>
            )}

            <p className="max-w-[42rem] text-muted-foreground sm:text-xl">
              Download all your favorite podcasts as a POML file to use with other podcast apps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button
                asChild
                size="lg"
                className="bg-[#1DB954] hover:bg-[#1DB954]/90"
                // disabled={envStatus && !envStatus.loaded}
              >
                <Link href="/api/auth/login">Login with Spotify</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <div className="flex flex-col items-center gap-2 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-[#1DB954]"
                >
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Simple Login</h3>
              <p className="text-center text-muted-foreground">Securely connect with your Spotify account</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-[#1DB954]"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">View Podcasts</h3>
              <p className="text-center text-muted-foreground">See all your subscribed podcasts in one place</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-[#1DB954]"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Export POML</h3>
              <p className="text-center text-muted-foreground">
                Download a POML file compatible with other podcast apps
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 sm:px-8 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Spotify POML Exporter. All rights reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground">Not affiliated with Spotify AB</p>
        </div>
      </footer>
    </div>
  )
}

