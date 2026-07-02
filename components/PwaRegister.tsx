'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

function getBasePath() {
  if (typeof window === 'undefined') return '/inter-coloma'
  const match = window.location.pathname.match(/^\/[^/]+/)
  return match ? match[0] : '/inter-coloma'
}

export default function PwaRegister() {
  const pathname = usePathname()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [installed, setInstalled] = useState(false)
  // hide on non-home pages when not standalone
  const isStandalone = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches
  if (pathname !== '/' && !isStandalone) return null

  useEffect(() => {
    const bp = getBasePath()
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(bp + '/sw.js?base=' + encodeURIComponent(bp)).catch(() => {})
    }

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    const installedHandler = () => setInstalled(true)

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', installedHandler)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
    }
    setDeferredPrompt(null)
  }

  if (installed || !deferredPrompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-6 md:left-auto md:right-6 md:w-80">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#00450d] flex items-center justify-center text-white text-lg shrink-0">⚽</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Instalar InterColoma</p>
          <p className="text-[0.6rem] text-gray-500">Agrega la app a tu pantalla de inicio</p>
        </div>
        <button onClick={handleInstall}
          className="bg-[#00450d] text-white text-[0.6rem] font-bold uppercase tracking-wider px-4 py-2 rounded-lg hover:brightness-110 transition-all shrink-0 cursor-pointer">
          Instalar
        </button>
      </div>
    </div>
  )
}
