'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useInit, usePartidos, PartidoRow } from '@/lib/use-data'
import { MatchCard } from './MatchCard'
import { WeekNav } from './WeekNav'

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getWeekNumber(dateStr: string, startStr: string): number {
  const diff = new Date(dateStr + 'T12:00:00').getTime() - new Date(startStr + 'T12:00:00').getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1
}

function CalendarContent() {
  const { ready, error } = useInit()
  const { partidos, refresh: refreshPartidos } = usePartidos()
  const searchParams = useSearchParams()
  const selectedWeek = parseInt(searchParams.get('semana') || '1')

  if (error) return <div className="max-w-6xl mx-auto px-4 py-12 text-center"><p className="text-red-600 font-semibold">Error: {error}</p><p className="text-sm text-gray-500 mt-2">Verifica NEXT_PUBLIC_TURSO_URL y NEXT_PUBLIC_TURSO_TOKEN</p></div>
  if (!ready) return <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-400"><p>Cargando...</p></div>

  const torneoStart = '2026-07-01'
  const weeks: { number: number; days: { date: string; dia: string; matches: PartidoRow[] }[] }[] = []
  const daysMap = new Map<string, { date: string; dia: string; matches: PartidoRow[] }>()

  for (const p of partidos) {
    const dateStr = p.fecha.split('T')[0]
    if (!daysMap.has(dateStr)) {
      daysMap.set(dateStr, { date: dateStr, dia: p.dia, matches: [] })
    }
    daysMap.get(dateStr)!.matches.push(p)
  }

  for (const [_, day] of daysMap) {
    const weekNum = getWeekNumber(day.date, torneoStart)
    let week = weeks.find(w => w.number === weekNum)
    if (!week) { week = { number: weekNum, days: [] }; weeks.push(week) }
    week.days.push(day)
  }

  weeks.sort((a, b) => a.number - b.number)
  weeks.forEach(w => w.days.sort((a, b) => a.date.localeCompare(b.date)))

  const currentWeek = weeks.find(w => w.number === selectedWeek) || weeks[0]
  const totalJornadas = weeks.length

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-oswald font-bold uppercase tracking-wide text-[#1b1c1c] dark:text-white">Calendario de Partidos</h1>
          <p className="text-[0.75rem] text-gray-500 mt-0.5">Temporada Regular · 13 Equipos · Round Robin</p>
        </div>
      </div>

      <WeekNav currentWeek={selectedWeek} totalJornadas={totalJornadas} />

      <div className="space-y-4 mt-4">
        {currentWeek?.days.map(day => (
          <div key={day.date}>
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-[0.7rem] font-bold uppercase tracking-wider text-gray-500">{day.dia}</h3>
              <span className="text-[0.65rem] text-gray-400">{formatDate(day.date)}</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {day.matches.map(match => (
                <MatchCard key={match.id} match={match} onUpdate={refreshPartidos} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CalendarioPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-400"><p>Cargando...</p></div>}>
      <CalendarContent />
    </Suspense>
  )
}
