'use client'

import { useState } from 'react'
import { useInit, useStandings } from '@/lib/use-data'
import { useGoleadores, useAsistidores, useTarjetas, useAutogoles } from '@/lib/use-data'
import TablaPosiciones from '@/components/TablaPosiciones'

type Tab = 'posiciones' | 'goleadores' | 'asistidores' | 'tarjetas' | 'autogoles'

export default function TablaPage() {
  const { ready, error } = useInit()
  const { standings } = useStandings()
  const { goleadores } = useGoleadores()
  const { asistidores } = useAsistidores()
  const { tarjetas } = useTarjetas()
  const { autogoles } = useAutogoles()
  const [tab, setTab] = useState<Tab>('posiciones')

  if (error) return <div className="max-w-6xl mx-auto px-4 py-12 text-center"><p className="text-red-600 font-semibold">Error: {error}</p><p className="text-sm text-gray-500 mt-2">Verifica NEXT_PUBLIC_TURSO_URL y NEXT_PUBLIC_TURSO_TOKEN</p></div>
  if (!ready) return <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-400"><p>Cargando...</p></div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-5">
        <h1 className="text-xl md:text-2xl font-oswald font-bold uppercase tracking-wide text-[#1b1c1c] dark:text-white">Estadísticas</h1>
        <p className="text-[0.75rem] text-gray-500 mt-0.5">Temporada Regular · Clasificación y líderes</p>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-5 overflow-x-auto scrollbar-none">
        {([
          { key: 'posiciones', label: '📊 Clasificación' },
          { key: 'goleadores', label: '⚽ Goleadores' },
          { key: 'asistidores', label: '🎯 Asistidores' },
          { key: 'tarjetas', label: '🟡 Tarjetas' },
          { key: 'autogoles', label: '⚠️ Autogoles' },
        ] as { key: Tab; label: string }[]).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`segment-tab text-xs md:text-sm whitespace-nowrap ${tab === t.key ? 'active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'autogoles' && (
        <LeaderboardCard
          title="Autogoles"
          emptyMsg="No hay autogoles registrados"
          rows={autogoles.map(a => ({
            key: a.jugadorId, nombre: a.nombre, equipo: a.equipoNombre, numero: a.numero,
            value: a.goles, label: 'autogoles',
          }))}
        />
      )}

      {tab === 'posiciones' && (
        <div className="card overflow-hidden">
          <TablaPosiciones highlightTop6={true} />
        </div>
      )}

      {tab === 'goleadores' && (
        <LeaderboardCard
          title="Máximos Goleadores"
          emptyMsg="No hay goles registrados"
          rows={goleadores.map(g => ({
            key: g.jugadorId, nombre: g.nombre, equipo: g.equipoNombre, numero: g.numero,
            value: g.goles, label: 'goles',
          }))}
        />
      )}

      {tab === 'asistidores' && (
        <LeaderboardCard
          title="Máximos Asistidores"
          emptyMsg="No hay asistencias registradas"
          rows={asistidores.map(a => ({
            key: a.jugadorId, nombre: a.nombre, equipo: a.equipoNombre, numero: a.numero,
            value: a.asistencias, label: 'asistencias',
          }))}
        />
      )}

      {tab === 'tarjetas' && (
        <div className="card overflow-hidden">
          <div className="px-4 md:px-5 py-3 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-[0.75rem] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Tarjetas</h2>
          </div>
          {tarjetas.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-sm">No hay tarjetas registradas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="px-3 py-3 text-left text-[0.55rem] font-bold uppercase tracking-wider text-gray-500">#</th>
                    <th className="px-3 py-3 text-left text-[0.55rem] font-bold uppercase tracking-wider text-gray-500">Jugador</th>
                    <th className="px-3 py-3 text-left text-[0.55rem] font-bold uppercase tracking-wider text-gray-500">Equipo</th>
                    <th className="px-3 py-3 text-center text-[0.55rem] font-bold uppercase tracking-wider text-gray-500">🟡</th>
                    <th className="px-3 py-3 text-center text-[0.55rem] font-bold uppercase tracking-wider text-gray-500">🔴</th>
                    <th className="px-3 py-3 text-center text-[0.55rem] font-bold uppercase tracking-wider text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {tarjetas.map((t, i) => (
                    <tr key={t.jugadorId} className="border-t border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-3 py-3 text-[0.6rem] font-bold text-gray-400">{i + 1}</td>
                      <td className="px-3 py-3 font-medium">{t.nombre}</td>
                      <td className="px-3 py-3 text-gray-500">{t.equipoNombre}</td>
                      <td className="px-3 py-3 text-center font-oswald font-bold text-yellow-600">{t.amarillas}</td>
                      <td className="px-3 py-3 text-center font-oswald font-bold text-red-600">{t.rojas}</td>
                      <td className="px-3 py-3 text-center font-oswald font-bold">{t.amarillas + t.rojas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function LeaderboardCard({ title, emptyMsg, rows }: {
  title: string; emptyMsg: string
  rows: { key: number; nombre: string; equipo: string; numero: number | null; value: number; label: string }[]
}) {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 md:px-5 py-3 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-[0.75rem] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">{title}</h2>
      </div>
      {rows.length === 0 ? (
        <div className="p-8 text-center text-gray-400"><p className="text-sm">{emptyMsg}</p></div>
      ) : (
        <div className="space-y-1 p-3">
          {rows.slice(0, 20).map((r, i) => (
            <div key={r.key} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[0.6rem] font-bold shrink-0 ${
                i === 0 ? 'bg-yellow-400 text-yellow-900' :
                i === 1 ? 'bg-gray-300 text-gray-700' :
                i === 2 ? 'bg-amber-600 text-white' :
                'bg-gray-100 dark:bg-gray-700 text-gray-500'
              }`}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{r.nombre}</div>
                <div className="text-[0.6rem] text-gray-400">{r.equipo}{r.numero ? ` · #${r.numero}` : ''}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-oswald font-bold text-lg">{r.value}</div>
                <div className="text-[0.5rem] text-gray-400 uppercase tracking-wider">{r.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
