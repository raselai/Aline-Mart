/**
 * Get the base URL for API requests
 * Works in both development and production (Vercel)
 */
export function getBaseUrl() {
  // Browser should use relative path
  if (typeof window !== 'undefined') return ''

  // Reference for vercel.com
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

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
