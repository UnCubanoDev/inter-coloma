'use client'

import { useState } from 'react'
import { useInit, usePartidos, usePlayoffs } from '@/lib/use-data'
import { useAdmin } from '@/components/AuthGuard'
import LoginModal from '@/components/LoginModal'
import { JugadoresManager } from '@/components/JugadoresManager'
import { AdminMatchRow } from './AdminMatchRow'
import { ResetButton } from './ResetButton'
import { PlayoffAdmin } from './PlayoffAdmin'

type Tab = 'partidos' | 'playoffs' | 'jugadores'

export default function AdminPage() {
  const { ready, error } = useInit()
  const { partidos, refresh: refreshPartidos } = usePartidos()
  const { playoffs, refresh: refreshPlayoffs } = usePlayoffs()
  const admin = useAdmin()
  const [loginOpen, setLoginOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('partidos')

  if (error) return <div className="max-w-6xl mx-auto px-4 py-12 text-center"><p className="text-red-600 font-semibold">Error: {error}</p><p className="text-sm text-gray-500 mt-2">Verifica NEXT_PUBLIC_TURSO_URL y NEXT_PUBLIC_TURSO_TOKEN</p></div>
  if (!ready) return <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-400"><p>Cargando...</p></div>

  const total = partidos.length
  const jugados = partidos.filter(p => p.jugado).length

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-oswald font-bold uppercase tracking-wide text-[#1b1c1c] dark:text-white">Panel de Administración</h1>
          <p className="text-[0.75rem] text-gray-500 mt-0.5">Gestión de partidos y torneo</p>
        </div>
        <div className="flex items-center gap-3">
          {admin ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.6rem] font-bold uppercase tracking-wider bg-[#00450d]/10 text-[#00450d]">
              <span className="w-2 h-2 rounded-full bg-[#00450d]" />
              Admin activo
            </span>
          ) : (
            <button onClick={() => setLoginOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[0.65rem] font-bold uppercase tracking-wider bg-[#00450d] text-white hover:brightness-110 transition-all active:scale-[0.98]">
              🔐 Iniciar sesión
            </button>
          )}
          {admin && <ResetButton onReset={() => { refreshPartidos(); refreshPlayoffs() }} />}
        </div>
      </div>

      {!admin && (
        <div className="card p-6 mb-6 text-center border-l-4 border-l-amber-400 bg-amber-50/50 dark:bg-amber-900/10">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">Modo solo lectura</p>
          <p className="text-xs text-amber-600 dark:text-amber-400">Inicia sesión como administrador para modificar partidos y gestionar el torneo.</p>
        </div>
      )}

      {/* Tabs */}
      <div role="tablist" aria-label="Secciones de administración" className="flex border-b border-gray-200 dark:border-gray-700 mb-5">
        {(['partidos', 'playoffs', 'jugadores'] as Tab[]).map(t => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`segment-tab text-xs md:text-sm ${tab === t ? 'active' : ''}`}>
            {t === 'partidos' ? '📋 Partidos' : t === 'playoffs' ? '🏆 Playoffs' : '👥 Jugadores'}
          </button>
        ))}
      </div>

      {/* Partidos */}
      {tab === 'partidos' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="card p-4"><div className="font-oswald text-xl font-bold text-[#00450d]">{total}</div><div className="text-[0.55rem] text-gray-500 uppercase tracking-wider font-semibold mt-1">Partidos totales</div></div>
            <div className="card p-4"><div className="font-oswald text-xl font-bold text-green-700">{jugados}</div><div className="text-[0.55rem] text-gray-500 uppercase tracking-wider font-semibold mt-1">Jugados</div></div>
            <div className="card p-4"><div className="font-oswald text-xl font-bold text-amber-600">{total - jugados}</div><div className="text-[0.55rem] text-gray-500 uppercase tracking-wider font-semibold mt-1">Pendientes</div></div>
            <div className="card p-4"><div className="font-oswald text-xl font-bold text-gray-600">{playoffs.length}</div><div className="text-[0.55rem] text-gray-500 uppercase tracking-wider font-semibold mt-1">Playoffs</div></div>
          </div>

          <div className="card overflow-hidden">
            <div className="px-4 md:px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-[0.8rem] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Todos los Partidos</h2>
              <span className="text-[0.55rem] text-gray-400">{partidos.length} registros</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="px-3 py-3 text-left text-[0.55rem] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">Fecha</th>
                    <th className="px-3 py-3 text-left text-[0.55rem] font-bold uppercase tracking-wider text-gray-500">Local</th>
                    <th className="px-3 py-3 text-center text-[0.55rem] font-bold uppercase tracking-wider text-gray-500">Resultado</th>
                    <th className="px-3 py-3 text-right text-[0.55rem] font-bold uppercase tracking-wider text-gray-500">Visitante</th>
                    <th className="px-3 py-3 text-center text-[0.55rem] font-bold uppercase tracking-wider text-gray-500">Estado</th>
                    <th className="px-3 py-3 text-center text-[0.55rem] font-bold uppercase tracking-wider text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {partidos.map(partido => (
                    <AdminMatchRow key={partido.id} match={partido} onUpdate={refreshPartidos} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Playoffs */}
      {tab === 'playoffs' && (
        <div className="card overflow-hidden">
          <div className="px-4 md:px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-[0.8rem] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Playoffs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-3 py-3 text-left text-[0.55rem] font-bold uppercase tracking-wider text-gray-500">Ronda</th>
                  <th className="px-3 py-3 text-left text-[0.55rem] font-bold uppercase tracking-wider text-gray-500">Local</th>
                  <th className="px-3 py-3 text-center text-[0.55rem] font-bold uppercase tracking-wider text-gray-500">Resultado</th>
                  <th className="px-3 py-3 text-right text-[0.55rem] font-bold uppercase tracking-wider text-gray-500">Visitante</th>
                  <th className="px-3 py-3 text-center text-[0.55rem] font-bold uppercase tracking-wider text-gray-500">Estado</th>
                </tr>
              </thead>
              <tbody>
                {playoffs.map(p => <PlayoffAdmin key={p.id} match={p} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Jugadores */}
      {tab === 'jugadores' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[0.8rem] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Jugadores por Equipo</h2>
          </div>
          <JugadoresManager />
        </div>
      )}

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </div>
  )
}
