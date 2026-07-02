import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const basePath = process.env.PAGES_BASE_URL
  ? new URL(process.env.PAGES_BASE_URL).pathname.replace(/\/$/, '')
  : '/inter-coloma'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'InterColoma 2026',
    short_name: 'InterColoma',
    description: 'Torneo de fútbol InterColoma 2026 - 13 equipos, todos contra todos',
    start_url: `${basePath}/`,
    display: 'standalone',
    background_color: '#fcf9f8',
    theme_color: '#00450d',
    orientation: 'portrait-primary',
    icons: [
      {
        src: `${basePath}/icons/icon-192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: `${basePath}/icons/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: `${basePath}/icons/icon-192.svg`,
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: `${basePath}/icons/icon-512.svg`,
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    screenshots: [],
    categories: ['sports', 'utilities'],
    lang: 'es',
    dir: 'ltr',
  }
}
