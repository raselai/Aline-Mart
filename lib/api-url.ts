/**
 * Get the base URL for API requests
 * Works in both development and production (Vercel, Railway)
 */
export function getBaseUrl() {
  // Browser should use relative path
  if (typeof window !== 'undefined') return ''

  // Reference for Railway
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  }

  if (process.env.RAILWAY_STATIC_URL) {
    return process.env.RAILWAY_STATIC_URL
  }

  // Reference for vercel.com
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  // Use NEXT_PUBLIC_APP_URL if set
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  // Assume localhost
  return 'http://localhost:3000'
}

/**
 * Get full API URL for server-side fetching
 */
export function getApiUrl(path: string) {
  const baseUrl = getBaseUrl()
  return `${baseUrl}${path}`
}
