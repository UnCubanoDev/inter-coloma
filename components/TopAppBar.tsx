'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { isAuthenticated, logout } from '@/lib/auth'
import LoginModal from './LoginModal'

const BASE_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/calendario', label: 'Calendario' },
  { href: '/tabla', label: 'Estadísticas' },
  { href: '/equipos', label: 'Equipos' },
  { href: '/playoffs', label: 'Playoffs' },
]

export default function TopAppBar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    setAdmin(isAuthenticated())
    const handler = () => setAdmin(isAuthenticated())
    window.addEventListener('auth-change', handler)
    return () => window.removeEventListener('auth-change', handler)
  }, [])

  const navLinks = admin ? [...BASE_LINKS, { href: '/admin', label: 'Admin' }] : BASE_LINKS

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#00450d] text-white shadow-md safe-area-top">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <span className="text-lg md:text-xl font-bold font-oswald tracking-wide whitespace-nowrap">INTERCOLOMA</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const isActive = pathname === link.href
                return (
                  <Link key={link.href} href={link.href}
                    className={`px-3 py-1.5 rounded text-[0.75rem] font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                      isActive ? 'bg-[#bcf200] text-[#1b1c1c]' : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}>
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-2">
              {admin ? (
                <button onClick={() => { logout(); setMenuOpen(false) }}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded text-[0.65rem] font-semibold uppercase tracking-wider bg-white/15 text-white hover:bg-white/25 transition-all">
                  <span className="w-2 h-2 rounded-full bg-[#bcf200]" />
                  Admin
                </button>
              ) : (
                <button onClick={() => setLoginOpen(true)}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded text-[0.65rem] font-semibold uppercase tracking-wider border border-white/30 text-white/80 hover:bg-white/10 transition-all">
                  🔐 Admin
                </button>
              )}

              <button
                className="md:hidden relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menú"
              >
                {admin && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#bcf200]" />}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden pb-4 space-y-1 animate-fadeIn">
              {navLinks.map(link => {
                const isActive = pathname === link.href
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 rounded text-sm font-medium transition-colors ${
                      isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}>
                    {link.label}
                  </Link>
                )
              })}
              <div className="border-t border-white/10 pt-2 mt-2">
                {admin ? (
                  <button onClick={() => { logout(); setMenuOpen(false) }}
                    className="w-full px-4 py-3 rounded text-sm font-medium text-white/70 hover:bg-white/10 text-left">
                    🔓 Cerrar sesión admin
                  </button>
                ) : (
                  <button onClick={() => { setLoginOpen(true); setMenuOpen(false) }}
                    className="w-full px-4 py-3 rounded text-sm font-medium text-white/70 hover:bg-white/10 text-left">
                    🔐 Iniciar sesión admin
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </>
  )
}
