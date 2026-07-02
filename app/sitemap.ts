import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const baseUrl = process.env.PAGES_BASE_URL || 'https://uncubanodev.github.io/inter-coloma'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/calendario', '/tabla', '/equipos', '/playoffs', '/admin']
  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))
}
