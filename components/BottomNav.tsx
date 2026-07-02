'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'Inicio', icon: '🏠' },
  { href: '/calendario', label: 'Calendario', icon: '📅' },
  { href: '/tabla', label: 'Estadísticas', icon: '📊' },
  { href: '/equipos', label: 'Equipos', icon: '👥' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden flex-none bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map(tab => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-all relative ${
                isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {isActive && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#bcf200] rounded-full" />
              )}
              <span className="text-lg" aria-hidden="true">{tab.icon}</span>
              <span className={`text-[0.625rem] font-semibold uppercase tracking-wider ${
                isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
