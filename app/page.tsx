'use client'

import Link from 'next/link'
import { useInit, useStandings, useStats, useGoleadores, usePartidos } from '@/lib/use-data'

export default function Home() {
  const { ready, error } = useInit()
  const { standings } = useStandings()
  const { stats } = useStats()
  const { goleadores } = useGoleadores()
  const { partidos } = usePartidos()

  const d = new Date()
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const todayMatches = partidos.filter(p => p.fecha.startsWith(todayStr))

  if (error) return <div className="max-w-6xl mx-auto px-4 py-12 text-center text-red-600"><p>Error: {error}</p><p className="text-sm mt-2">Verifica las variables NEXT_PUBLIC_TURSO_URL y NEXT_PUBLIC_TURSO_TOKEN</p></div>
  if (!ready) return <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-400"><p>Cargando...</p></div>

  const topScorers = goleadores.slice(0, 5)
  const ultimos = standings.filter(t => t.jj > 0).sort((a, b) => b.pts - a.pts).slice(0, 5)

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Hero */}
        <div className="md:col-span-6 bg-gradient-to-br from-[#00450d] to-[#003308] rounded-xl p-6 text-white relative overflow-hidden min-h-[200px]">
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bcf200] pulse-dot" />
              Temporada Regular
            </span>
            <span className="bg-[#bcf200] text-[#1b1c1c] rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase">
              {stats.jugados}/{stats.total}
            </span>
          </div>
          <div className="space-y-3">
            {todayMatches.length === 0 ? (
              <div className="text-center mt-6">
                <p className="text-white/70 text-sm">No hay partidos programados para hoy</p>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  <Link href="/calendario" className="bg-[#bcf200] text-[#1b1c1c] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded hover:brightness-95 transition-all">
                    Ver Calendario
                  </Link>
                  <Link href="/tabla" className="border border-white/40 text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded hover:bg-white/10 transition-all">
                    Clasificación
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2 mt-8">
                  {todayMatches.map(m => (
                    <div key={m.id} className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-2.5">
                      <div className="flex-1 text-sm font-medium truncate">{m.equipoLocal.nombre}</div>
                      <div className="flex items-center gap-2 mx-3 shrink-0">
                        {m.jugado ? (
                          <span className="text-base font-oswald font-bold">{m.golesLocal} - {m.golesVisitante}</span>
                        ) : (
                          <span className="text-[0.6rem] text-white/50 uppercase tracking-wider">vs</span>
                        )}
                      </div>
                      <div className="flex-1 text-sm font-medium truncate text-right">{m.equipoVisitante.nombre}</div>
                    </div>
                  ))}
                </div>
                <p className="text-[0.55rem] text-white/40 text-center font-oswald tracking-wider uppercase">
                  {(stats.total - stats.jugados) > 0 ? `${stats.total - stats.jugados} partidos pendientes` : 'Temporada completa'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="md:col-span-4 grid grid-cols-3 gap-3 items-stretch">
          <div className="card p-3 flex flex-col items-center justify-center">
            <div className="font-oswald text-xl font-bold text-[#00450d]">{stats.total}</div>
            <div className="text-[0.6rem] text-gray-500 uppercase tracking-wider font-semibold">Partidos</div>
          </div>
          <div className="card p-3 flex flex-col items-center justify-center">
            <div className="font-oswald text-xl font-bold text-[#00450d]">{stats.jugados}</div>
            <div className="text-[0.6rem] text-gray-500 uppercase tracking-wider font-semibold">Jugados</div>
          </div>
          <div className="card p-3 flex flex-col items-center justify-center">
            <div className="font-oswald text-xl font-bold text-[#00450d]">{stats.goles}</div>
            <div className="text-[0.6rem] text-gray-500 uppercase tracking-wider font-semibold">Goles</div>
          </div>
        </div>
        {/* Mini Standings */}
        <div className="md:col-span-4 card p-4">
          <h3 className="text-[0.65rem] font-bold uppercase tracking-wider text-gray-500 mb-3">Clasificación</h3>
          <div className="space-y-2">
            {ultimos.slice(0, 5).map((t, i) => (
                <div key={t.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[0.6rem] font-bold ${i < 6 ? 'bg-[#00450d] text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</span>
                    <span className="truncate">{t.nombre}</span>
                  </div>
                  <span className="font-oswald font-bold text-base">{t.pts}</span>
                </div>
            ))}
            {standings.length > 5 && (
                <Link href="/tabla" className="block text-center text-[0.65rem] font-semibold text-[#00450d] uppercase tracking-wider pt-1 hover:underline">
                  Ver todos ({standings.length})
                </Link>
            )}
          </div>
        </div>

        {/* Top Scorers */}
        <div className="md:col-span-4 card p-4">
          <h3 className="text-[0.65rem] font-bold uppercase tracking-wider text-gray-500 mb-3">Máximos Goleadores</h3>
          {topScorers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Sin datos</p>
          ) : (
            <div className="space-y-3">
              {topScorers.map((p, i) => (
                <div key={p.jugadorId} className="flex items-center gap-3">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[0.65rem] font-bold ${i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-gray-300 text-gray-700' : 'bg-amber-600 text-white'}`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.nombre}</div>
                    <div className="text-[0.6rem] text-gray-400 truncate">{p.numero ? `#${p.numero} · ` : ''}{p.equipoNombre}</div>
                  </div>
                  <span className="font-oswald font-bold text-lg">{p.goles}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
