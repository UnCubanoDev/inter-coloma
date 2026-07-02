'use client'

import { useState } from 'react'
import { updatePlayoff, advancePlayoff, resetPlayoff } from '@/lib/data'
import { useAdmin } from '@/components/AuthGuard'
import { PlayoffRow } from '@/lib/use-data'

export function PlayoffMatch({ match, onUpdate }: { match: PlayoffRow; onUpdate: () => void }) {
  const admin = useAdmin()
  const [gL, setGL] = useState(match.golesLocal ?? '')
  const [gV, setGV] = useState(match.golesVisitante ?? '')
  const [saving, setSaving] = useState(false)

  const isReady = match.equipoLocalId !== null && match.equipoVisitanteId !== null
  const isPlayed = match.jugado === 1

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!admin) return
    const gl = parseInt(gL as string); const gv = parseInt(gV as string)
    if (isNaN(gl) || isNaN(gv)) return
    setSaving(true)
    await updatePlayoff(match.id, gl, gv)
    setSaving(false)
    onUpdate()
  }

  const handleAdvance = async () => { if (admin) { await advancePlayoff(match.id); onUpdate() } }
  const handleReset = async () => { if (admin) { await resetPlayoff(match.id); setGL(''); setGV(''); onUpdate() } }

  if (!isReady) {
    return (
      <div className="text-center py-4">
        <div className="text-xs text-gray-400 mb-2">Esperando rival...</div>
        {match.equipoLocal && <div className="text-sm font-semibold text-gray-600">{match.equipoLocal.nombre}</div>}
        {match.equipoVisitante && <div className="text-xs text-gray-400 mt-1">vs {match.equipoVisitante.nombre}</div>}
      </div>
    )
  }

  const inputClass = `w-9 h-9 text-center rounded border text-sm font-oswald font-bold outline-none transition-colors ${
    isPlayed
      ? 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100'
      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 focus:border-[#00450d]'
  } ${!admin ? 'opacity-70 cursor-not-allowed' : ''}`

  return (
    <form onSubmit={handleSubmit}>
      {!admin && <div className="text-center mb-2"><span className="text-[0.5rem] font-semibold uppercase tracking-wider text-gray-300 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">Solo lectura</span></div>}

      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex-1 text-right min-w-0">
          <div className="flex items-center justify-end gap-1">
            <span className="text-xs md:text-sm font-semibold truncate">{match.equipoLocal!.nombre}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <input type="number" value={gL} onChange={e => setGL(e.target.value)} min={0} max={99}
            className={inputClass} required disabled={!admin} readOnly={!admin} />
          <span className="text-gray-400 font-oswald">-</span>
          <input type="number" value={gV} onChange={e => setGV(e.target.value)} min={0} max={99}
            className={inputClass} required disabled={!admin} readOnly={!admin} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-xs md:text-sm font-semibold truncate">{match.equipoVisitante!.nombre}</span>
          </div>
        </div>
      </div>

      {admin && (
        <div className="flex gap-1.5">
          <button type="submit" disabled={saving}
            className={`flex-1 py-2 rounded text-[0.55rem] font-bold uppercase tracking-wider transition-all active:scale-[0.98] ${isPlayed ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 hover:bg-gray-300' : 'bg-[#bcf200] text-[#1b1c1c] hover:brightness-95'}`}>
            {saving ? '...' : isPlayed ? 'Actualizar' : 'Guardar'}
          </button>
          {isPlayed && (
            <>
              <button type="button" onClick={handleAdvance}
                className="px-2.5 py-2 rounded text-[0.55rem] font-bold uppercase tracking-wider text-blue-700 border border-blue-200 hover:bg-blue-50 transition-colors active:scale-[0.98]">Avanzar</button>
              <button type="button" onClick={handleReset}
                className="px-2.5 py-2 rounded text-[0.55rem] font-bold uppercase tracking-wider text-red-600 border border-red-200 hover:bg-red-50 transition-colors active:scale-[0.98]">↺</button>
            </>
          )}
        </div>
      )}
    </form>
  )
}
