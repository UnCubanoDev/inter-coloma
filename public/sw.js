const CACHE = 'liga2026-v1'

const ASSETS = [
  '/',
  '/calendario',
  '/tabla',
  '/playoffs',
  '/admin',
  '/manifest.json',
]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return

  e.respondWith(
    fetch(request).then((res) => {
      if (res.ok && res.type === 'basic' && !url.pathname.startsWith('/_next/')) {
        const clone = res.clone()
        caches.open(CACHE).then((cache) => cache.put(request, clone))
      }
      return res
    }).catch(() => caches.match(request))
  )
})