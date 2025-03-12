export function validateEnv() {
  const requiredEnvVars = ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "NEXT_PUBLIC_APP_URL"]
  const missingEnvVars = []

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Missing environment variable: ${envVar}`)
      missingEnvVars.push(envVar)
    } else {
      // Log that we found the environment variable (but don't log the value for security)
      console.log(`Found environment variable: ${envVar}`)
    }
  }

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}. ` +
        `Make sure your .env.local file exists in the project root and contains these variables.`,
    )
  }

  return true
}

// Function to get environment variables with fallbacks
export function getEnv(key: string, defaultValue = ""): string {
  const value = process.env[key]
  if (!value) {
    console.warn(`Environment variable ${key} not found, using default value`)
    return defaultValue
  }
  return value
}

