'use client'

import { useEffect, useState } from 'react'
import { isAuthenticated } from '@/lib/auth'

export function useAdmin() {
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    setAdmin(isAuthenticated())
    const handler = () => setAdmin(isAuthenticated())
    window.addEventListener('auth-change', handler)
    return () => window.removeEventListener('auth-change', handler)
  }, [])

  return admin
}

export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const admin = useAdmin()
  if (!admin) return fallback ?? null
  return <>{children}</>
}

export function ReadOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const admin = useAdmin()
  if (admin) return fallback ?? null
  return <>{children}</>
}

export function AdminBlocker({ children }: { children: React.ReactNode }) {
  const admin = useAdmin()

  if (!admin) {
    return (
      <div className="relative">
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 rounded-xl backdrop-blur-[1px]">
          <div className="text-center p-6">
            <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" />
            </svg>
            <p className="text-sm font-semibold text-gray-400">Inicia sesión como admin para modificar</p>
          </div>
        </div>
        {children}
      </div>
    )
  }

  return <>{children}</>
}
