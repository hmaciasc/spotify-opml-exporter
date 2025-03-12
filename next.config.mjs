/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better environment variable support
  serverExternalPackages: [],
  // Ensure environment variables are properly loaded
  env: {
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  // Configure image domains to allow Spotify CDN
  images: {
    domains: [
      'i.scdn.co',      // Spotify CDN
      'mosaic.scdn.co', // Another Spotify CDN
      'lineup-images.scdn.co', // Another Spotify CDN
      'image-cdn-fa.spotifycdn.com', // Another Spotify image domain
      'platform-lookaside.fbsbx.com', // For Facebook profile pictures that might be used
      'localhost'       // For local development
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.scdn.co',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.spotifycdn.com',
        pathname: '**',
      }
    ]
  }
};

export default nextConfig;
