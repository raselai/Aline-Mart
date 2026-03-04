import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.alinemart.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/account/',
          '/cart',
          '/checkout',
          '/wishlist',
          '/auth/',
          '/paystation/',
          '/orders/',
          '/test-api',
          '/test-store',
          '/test-products',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
