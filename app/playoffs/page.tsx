'use client'

import { useInit, usePlayoffs, useStandings } from '@/lib/use-data'
import { PlayoffMatch } from './PlayoffMatch'
import { SetupPlayoffs } from './SetupPlayoffs'
import TeamBadge from '@/components/TeamBadge'

export default function PlayoffsPage() {
  const { ready, error } = useInit()
  const { playoffs, refresh: refreshPlayoffs } = usePlayoffs()
  const { standings } = useStandings()

  if (error) return <div className="max-w-6xl mx-auto px-4 py-12 text-center"><p className="text-red-600 font-semibold">Error: {error}</p><p className="text-sm text-gray-500 mt-2">Verifica NEXT_PUBLIC_TURSO_URL y NEXT_PUBLIC_TURSO_TOKEN</p></div>
  if (!ready) return <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-400"><p>Cargando...</p></div>

  const top6 = standings.slice(0, 6)
  const needsSetup = playoffs.every(p => p.equipoLocalId === null && p.equipoVisitanteId === null)

  const [m1, m2, m3, m4, m5] = playoffs

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-oswald font-bold uppercase tracking-wide text-[#1b1c1c] dark:text-white">Playoffs</h1>
          <p className="text-[0.75rem] text-gray-500 mt-0.5">Fase final · Eliminación directa</p>
        </div>
        <SetupPlayoffs needsSetup={needsSetup} onSetup={refreshPlayoffs} />
      </div>

      {needsSetup && standings.length >= 6 && (
        <div className="card p-6 mb-6 text-center border-l-4 border-l-[#bcf200]">
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Playoffs listos para configurar</p>
          <p className="text-xs text-gray-500">Usa el botón &ldquo;Configurar Playoffs&rdquo; para generar los enfrentamientos</p>
        </div>
      )}

      {!needsSetup ? (
        <>
          {top6.length >= 6 && (
            <div className="card p-3 mb-5 flex flex-wrap items-center gap-2">
              <span className="text-[0.55rem] font-bold uppercase tracking-wider text-gray-500 mr-1">Clasificados:</span>
              {top6.map((t, i) => (
                <span key={t.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.6rem] font-semibold bg-[#00450d]/10 text-[#00450d]"><TeamBadge numero={t.numero} name={t.nombre} size={16} /></span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="space-y-4">
              <h3 className="text-[0.6rem] font-bold uppercase tracking-wider text-gray-500 text-center pb-1 border-b border-gray-200 dark:border-gray-700">Cuartos de Final</h3>
              {m1 && <div className="card p-4"><div className="text-[0.5rem] font-bold uppercase tracking-wider text-gray-400 mb-2 text-center">Cuarto 1</div><PlayoffMatch match={m1} onUpdate={refreshPlayoffs} /></div>}
              {m2 && <div className="card p-4"><div className="text-[0.5rem] font-bold uppercase tracking-wider text-gray-400 mb-2 text-center">Cuarto 2</div><PlayoffMatch match={m2} onUpdate={refreshPlayoffs} /></div>}
            </div>
            <div className="space-y-4">
              <h3 className="text-[0.6rem] font-bold uppercase tracking-wider text-gray-500 text-center pb-1 border-b border-gray-200 dark:border-gray-700">Semifinales</h3>
              {m3 && <div className="card p-4"><div className="text-[0.5rem] font-bold uppercase tracking-wider text-gray-400 mb-2 text-center">Semifinal 1</div><PlayoffMatch match={m3} onUpdate={refreshPlayoffs} /></div>}
              {m4 && <div className="card p-4"><div className="text-[0.5rem] font-bold uppercase tracking-wider text-gray-400 mb-2 text-center">Semifinal 2</div><PlayoffMatch match={m4} onUpdate={refreshPlayoffs} /></div>}
            </div>
            <div className="space-y-4">
              <h3 className="text-[0.6rem] font-bold uppercase tracking-wider text-gray-500 text-center pb-1 border-b border-gray-200 dark:border-gray-700">Final</h3>
              {m5 && (
                <div className="card p-5 border-2 border-[#bcf200] relative">
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#bcf200] text-[#1b1c1c] text-[0.5rem] font-bold uppercase tracking-wider px-3 py-0.5 rounded">🏆 Gran Final</div>
                  <div className="mt-3"><PlayoffMatch match={m5} onUpdate={refreshPlayoffs} /></div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : standings.length < 6 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <p className="text-gray-500 font-semibold">Playoffs no disponibles</p>
          <p className="text-xs text-gray-400 mt-1">Se necesitan al menos 6 equipos con partidos jugados</p>
        </div>
      ) : null}
    </div>
  )
}
