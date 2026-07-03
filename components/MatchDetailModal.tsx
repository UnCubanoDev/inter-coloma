'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useEventos, useJugadores, PartidoRow, EventoRow } from '@/lib/use-data'
import { addEvento, removeEvento } from '@/lib/data'
import { useAdmin } from './AuthGuard'
import TeamBadge from '@/components/TeamBadge'

interface Props {
  match: PartidoRow
  open: boolean
  onClose: () => void
}

const tipoLabels: Record<string, string> = {
  gol: '⚽ Gol',
  asistencia: '🎯 Asistencia',
  amarilla: '🟡 Amarilla',
  roja: '🔴 Roja',
  autogol: '⚠️ Autogol',
}

const tipoColors: Record<string, string> = {
  gol: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
  asistencia: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
  amarilla: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
  roja: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700',
  autogol: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700',
}

const tipoBg = (tipo: string) => tipoColors[tipo] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function MatchDetailModal({ match, open, onClose }: Props) {
  const admin = useAdmin()
  const { eventos, refresh: refreshEventos } = useEventos(match.id)
  const { jugadores: jugadoresL } = useJugadores(match.equipoLocalId)
  const { jugadores: jugadoresV } = useJugadores(match.equipoVisitanteId)
  const [selectedJugador, setSelectedJugador] = useState('')
  const [selectedTipo, setSelectedTipo] = useState('gol')
  const [selectedEquipo, setSelectedEquipo] = useState<'local' | 'visitante'>('local')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      refreshEventos()
      setSelectedJugador('')
      setSelectedTipo('gol')
      setError('')
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, refreshEventos, handleKeyDown])

  if (!open) return null

  const handleAddEvent = async () => {
    if (!selectedJugador) return
    setSaving(true)
    setError('')
    try {
      const jugadorId = parseInt(selectedJugador)
      const equipoId = selectedEquipo === 'local' ? match.equipoLocalId : match.equipoVisitanteId
      await addEvento(match.id, jugadorId, equipoId, selectedTipo)
      setSelectedJugador('')
      toast.success('Evento agregado')
      await refreshEventos()
    } catch (e: any) {
      setError(e?.message || 'Error al agregar evento')
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveEvent = async (id: number) => {
    await removeEvento(id)
    toast.success('Evento eliminado')
    refreshEventos()
  }

  const isPlayed = match.jugado === 1
  const jugadores = selectedEquipo === 'local' ? jugadoresL : jugadoresV

  const eventosLocal = eventos.filter(e => e.equipoId === match.equipoLocalId)
  const eventosVisit = eventos.filter(e => e.equipoId === match.equipoVisitanteId)

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div onClick={e => e.stopPropagation()}
        className="relative bg-white dark:bg-[#303030] w-full md:max-w-lg md:rounded-xl rounded-t-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
        
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#303030] z-10 px-5 pt-5 pb-3 border-b border-gray-100 dark:border-gray-700 flex items-start justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Detalle del Partido</h2>
            <p className="text-[0.65rem] text-gray-400">{formatDate(match.fecha)} · {match.dia}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Score header */}
          <div className="flex items-center justify-center gap-4 py-3">
            <div className="text-right flex-1">
              <p className="text-sm font-bold truncate"><TeamBadge numero={match.equipoLocal.numero} name={match.equipoLocal.nombre} /></p>
            </div>
            <div className="flex items-center gap-3">
              {isPlayed ? (
                <span className="score-display text-3xl md:text-4xl text-[#1b1c1c] dark:text-white">
                  {match.golesLocal} - {match.golesVisitante}
                </span>
              ) : (
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">vs</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold truncate text-right"><TeamBadge numero={match.equipoVisitante.numero} name={match.equipoVisitante.nombre} reverse /></p>
            </div>
          </div>

          {/* Events by team */}
          {isPlayed && (
            <>
              <EventosSection title={match.equipoLocal.nombre} eventos={eventosLocal} admin={admin} onRemove={handleRemoveEvent} />
              <EventosSection title={match.equipoVisitante.nombre} eventos={eventosVisit} admin={admin} onRemove={handleRemoveEvent} />

              {/* Add event form */}
              {admin && (
                <div className="card p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50">
                  <h3 className="text-[0.6rem] font-bold uppercase tracking-wider text-gray-500">Agregar Evento</h3>
                  <div className="flex flex-wrap gap-2">
                    <select value={selectedEquipo} onChange={e => setSelectedEquipo(e.target.value as any)}
                      className="input-bb text-sm flex-1 min-w-[100px]">
                      <option value="local">{match.equipoLocal.nombre}</option>
                      <option value="visitante">{match.equipoVisitante.nombre}</option>
                    </select>
                    <select value={selectedTipo} onChange={e => setSelectedTipo(e.target.value)}
                      className="input-bb text-sm flex-1 min-w-[80px]">
                      <option value="gol">⚽ Gol</option>
                      <option value="asistencia">🎯 Asistencia</option>
                      <option value="autogol">⚠️ Autogol</option>
                      <option value="amarilla">🟡 Amarilla</option>
                      <option value="roja">🔴 Roja</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select value={selectedJugador} onChange={e => setSelectedJugador(e.target.value)}
                      className="input-bb text-sm flex-1 min-w-[120px]">
                      <option value="">Seleccionar jugador...</option>
                      {jugadores.map(j => (
                        <option key={j.id} value={j.id}>{j.numero ? `#${j.numero} ` : ''}{j.nombre}</option>
                      ))}
                    </select>
                    <button onClick={handleAddEvent} disabled={!selectedJugador || saving}
                      className="btn-primary text-[0.55rem] py-2 px-3 disabled:opacity-40">{saving ? 'Guardando...' : 'Agregar'}</button>
                  </div>
                  {selectedTipo === 'autogol' && (
                    <p className="text-[0.6rem] text-orange-600 dark:text-orange-400 flex items-center gap-1">
                      ⚠️ El autogol se registrará a favor de <strong>{selectedEquipo === 'local' ? match.equipoVisitante.nombre : match.equipoLocal.nombre}</strong>
                    </p>
                  )}
                  {error && <p className="text-[0.6rem] text-red-600">{error}</p>}
                </div>
              )}
            </>
          )}

          {!isPlayed && (
            <div className="text-center py-6 text-gray-400">
              <p className="text-sm">Partido aún no jugado</p>
              <p className="text-[0.65rem] mt-1">Guarda el resultado primero</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EventosSection({ title, eventos, admin, onRemove }: {
  title: string; eventos: EventoRow[]; admin: boolean; onRemove: (id: number) => void
}) {
  if (eventos.length === 0) return null

  const grouped = eventos.reduce<Record<number, { nombre: string; tipos: Record<string, EventoRow[]> }>>((acc, ev) => {
    if (!acc[ev.jugadorId]) acc[ev.jugadorId] = { nombre: ev.jugadorNombre, tipos: {} }
    if (!acc[ev.jugadorId].tipos[ev.tipo]) acc[ev.jugadorId].tipos[ev.tipo] = []
    acc[ev.jugadorId].tipos[ev.tipo].push(ev)
    return acc
  }, {})

  return (
    <div>
      <h3 className="text-[0.6rem] font-bold uppercase tracking-wider text-gray-500 mb-2">{title}</h3>
      <div className="space-y-1.5">
        {Object.entries(grouped).map(([jugadorId, group]) => (
          <div key={jugadorId} className="rounded-lg border border-gray-100 dark:border-gray-700/50 overflow-hidden">
            <p className="text-sm font-bold px-3 pt-2 pb-1 bg-gray-50 dark:bg-gray-800/40">{group.nombre}</p>
            <div className="px-3 pb-2 space-y-1">
              {Object.entries(group.tipos).map(([tipo, evs]) => (
                admin ? (
                  evs.map(ev => (
                    <div key={ev.id} className={`flex items-center justify-between gap-2 px-2 py-1 rounded text-sm ${tipoBg(tipo)}`}>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="shrink-0">{tipoLabels[tipo] || tipo}</span>
                        {tipo === 'autogol' && (
                          <span className="text-[0.5rem] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-600 px-1 py-0.5 rounded">En contra</span>
                        )}
                      </div>
                      <button onClick={() => onRemove(ev.id)} className="text-[0.55rem] font-bold uppercase tracking-wider text-red-600 shrink-0 hover:underline">Eliminar</button>
                    </div>
                  ))
                ) : (
                  <div key={tipo} className="flex items-center gap-1.5 text-sm px-2 py-0.5">
                    <span className="shrink-0">{tipoLabels[tipo] || tipo}</span>
                    {tipo === 'autogol' && (
                      <span className="text-[0.5rem] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-600 px-1 py-0.5 rounded">En contra</span>
                    )}
                    {evs.length > 1 && (
                      <span className="text-[0.55rem] font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">×{evs.length}</span>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
