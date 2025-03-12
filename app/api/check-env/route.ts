import { NextResponse } from "next/server"

export async function GET() {
  // Check if required environment variables are set
  const requiredVars = ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "NEXT_PUBLIC_APP_URL"]
  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    return NextResponse.json({
      loaded: false,
      message: `Missing environment variables: ${missingVars.join(", ")}`,
      missingVars,
    })
  }

  return NextResponse.json({
    loaded: true,
    message: "All required environment variables are loaded",
  })
}

