'use client'

import { useState } from 'react'
import { useInit, useJugadoresByEquipos } from '@/lib/use-data'
import TeamBadge from '@/components/TeamBadge'

export default function EquiposPage() {
  const { ready, error } = useInit()
  const { equipos } = useJugadoresByEquipos()
  const [expanded, setExpanded] = useState<Set<number>>(new Set(equipos.map(e => e.equipo.id)))

  if (error) return <div className="max-w-6xl mx-auto px-4 py-12 text-center"><p className="text-red-600 font-semibold">Error: {error}</p><p className="text-sm text-gray-500 mt-2">Verifica NEXT_PUBLIC_TURSO_URL y NEXT_PUBLIC_TURSO_TOKEN</p></div>
  if (!ready) return <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-400"><p>Cargando...</p></div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-oswald font-bold uppercase tracking-wide text-[#1b1c1c] dark:text-white">Equipos</h1>
        <p className="text-[0.75rem] text-gray-500 mt-0.5">{equipos.length} equipos participantes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {equipos.map(({ equipo, jugadores }) => (
          <div key={equipo.id} className="card overflow-hidden">
            <button onClick={() => setExpanded(prev => { const next = new Set(prev); if (next.has(equipo.id)) next.delete(equipo.id); else next.add(equipo.id); return next })}
              className="w-full flex items-center gap-3 px-4 md:px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex-1 text-left">
                <TeamBadge numero={equipo.numero} name={equipo.nombre} />
                <p className="text-[0.6rem] text-gray-400">{jugadores.length} jugadores</p>
              </div>
              <span className={`text-gray-400 transition-transform ${expanded.has(equipo.id) ? 'rotate-180' : ''}`}>▾</span>
            </button>

            {expanded.has(equipo.id) && (
              <div className="px-4 md:px-5 pb-4">
                {jugadores.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Sin jugadores registrados</p>
                ) : (
                  <div className="space-y-1">
                    {jugadores.map((j, i) => (
                      <div key={j.id}
                        className={`flex items-center gap-3 py-2 ${i < jugadores.length - 1 ? 'border-b border-gray-100 dark:border-gray-700/30' : ''}`}>
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 text-[0.65rem] font-oswald font-bold shrink-0">
                          {j.numero || '-'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{j.nombre}</p>
                        </div>
                        {j.posicion && (
                          <span className="text-[0.55rem] font-semibold uppercase tracking-wider text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded shrink-0">
                            {j.posicion}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
