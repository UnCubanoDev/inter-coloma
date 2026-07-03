'use client'

import { useEffect, useState, useCallback } from 'react'

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /iPad|iPhone|iPod/.test(ua) && !/CriOS|FxiOS|OPiOS|mercury/.test(ua)
}

const DISMISSED_KEY = 'pwa-ios-dismissed'

export default function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [installed, setInstalled] = useState(false)
  const [pathname, setPathname] = useState('/')
  const [showIOSPrompt, setShowIOSPrompt] = useState(false)

  const updatePathname = useCallback(() => {
    setPathname(window.location.pathname)
  }, [])

  useEffect(() => {
    const bp = document.documentElement.getAttribute('data-basepath') || ''
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

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isStandalone) {
      setInstalled(true)
    }

    if (!isStandalone && isIOS() && !localStorage.getItem(DISMISSED_KEY)) {
      setShowIOSPrompt(true)
    }

    updatePathname()
    window.addEventListener('popstate', updatePathname)

    const origPushState = window.history.pushState
    window.history.pushState = function (...args) {
      origPushState.apply(window.history, args)
      setTimeout(updatePathname, 0)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
      window.removeEventListener('popstate', updatePathname)
      window.history.pushState = origPushState
    }
  }, [updatePathname])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
    }
    setDeferredPrompt(null)
  }

  const dismissIOS = () => {
    setShowIOSPrompt(false)
    localStorage.setItem(DISMISSED_KEY, '1')
  }

  const isStandalone = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches

  // Android banner: show when beforeinstallprompt fired and not installed
  const showAndroid = deferredPrompt && !installed && (pathname === '/' || isStandalone)

  // iOS banner: show when on iOS Safari, not installed, not dismissed
  const showIOS = showIOSPrompt && !installed

  if (!showAndroid && !showIOS) return null

  return (
    <div className="fixed z-50 bottom-20 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-80">
      {showAndroid && (
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
      )}

      {showIOS && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00450d] flex items-center justify-center text-white text-lg shrink-0">⚽</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Instalar InterColoma</p>
              <ol className="mt-2 space-y-1.5">
                <li className="flex items-center gap-2 text-[0.65rem] text-gray-600 dark:text-gray-400">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 text-[0.55rem] font-bold shrink-0">1</span>
                  Toca el botón <span className="inline-flex items-center gap-0.5 font-semibold text-gray-800 dark:text-gray-200">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                    Compartir
                  </span>
                </li>
                <li className="flex items-center gap-2 text-[0.65rem] text-gray-600 dark:text-gray-400">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 text-[0.55rem] font-bold shrink-0">2</span>
                  Desplázate y elige <span className="font-semibold text-gray-800 dark:text-gray-200">Agregar a pantalla de inicio</span>
                </li>
                <li className="flex items-center gap-2 text-[0.65rem] text-gray-600 dark:text-gray-400">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 text-[0.55rem] font-bold shrink-0">3</span>
                  Toca <span className="font-semibold text-gray-800 dark:text-gray-200">Agregar</span> en la esquina superior derecha
                </li>
              </ol>
            </div>
            <button onClick={dismissIOS}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors shrink-0 cursor-pointer"
              aria-label="Cerrar">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
