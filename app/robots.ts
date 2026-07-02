import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const baseUrl = process.env.PAGES_BASE_URL || 'https://uncubanodev.github.io/inter-coloma'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
