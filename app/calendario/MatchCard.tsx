'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updatePartido, resetPartido } from '@/lib/data'
import { useAdmin } from '@/components/AuthGuard'
import MatchDetailModal from '@/components/MatchDetailModal'
import TeamBadge from '@/components/TeamBadge'
import type { PartidoRow } from '@/lib/use-data'

export function MatchCard({ match, onUpdate }: { match: PartidoRow; onUpdate: () => void }) {
  const admin = useAdmin()
  const [gL, setGL] = useState(match.golesLocal ?? '')
  const [gV, setGV] = useState(match.golesVisitante ?? '')
  const [saving, setSaving] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const isPlayed = match.jugado === 1

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!admin) return
    const gl = parseInt(gL as string); const gv = parseInt(gV as string)
    if (isNaN(gl) || isNaN(gv)) return
    setSaving(true)
    await updatePartido(match.id, gl, gv)
    setSaving(false)
    toast.success(isPlayed ? 'Resultado actualizado' : 'Resultado guardado')
    onUpdate()
  }

  const handleReset = async () => {
    if (!admin) return
    await resetPartido(match.id)
    setGL(''); setGV('')
    toast.success('Resultado revertido')
    onUpdate()
  }

  const inputClass = `w-10 h-10 text-center rounded border text-sm font-oswald font-bold outline-none transition-colors ${
    isPlayed
      ? 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100'
      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 focus:border-[#00450d]'
  } ${!admin ? 'opacity-70 cursor-not-allowed' : ''}`

  return (
    <>
      <div className={`match-card p-3 ${isPlayed ? 'border-l-4 border-l-[#00450d]' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[0.55rem] font-semibold uppercase tracking-wider text-gray-400">Partido #{match.orden}</span>
            {!admin && <span className="text-[0.5rem] font-semibold uppercase tracking-wider text-gray-300 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">Solo lectura</span>}
          </div>
          {isPlayed && <span className="badge-green">Finalizado</span>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-3">
            <div className="flex-1 text-right min-w-0">
              <div className="flex items-center justify-end gap-1">
                <TeamBadge numero={match.equipoLocal.numero} name={match.equipoLocal.nombre} />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <input type="number" value={gL} onChange={e => setGL(e.target.value)} min={0} max={99}
                className={inputClass} required disabled={!admin} readOnly={!admin} />
              <span className="text-gray-400 font-oswald text-lg">-</span>
              <input type="number" value={gV} onChange={e => setGV(e.target.value)} min={0} max={99}
                className={inputClass} required disabled={!admin} readOnly={!admin} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <TeamBadge numero={match.equipoVisitante.numero} name={match.equipoVisitante.nombre} reverse />
              </div>
            </div>
          </div>

          {admin && (
            <div className="flex gap-2 mt-3">
              <button type="submit" disabled={saving}
                className={`flex-1 py-2.5 rounded text-[0.6rem] font-bold uppercase tracking-wider transition-all active:scale-[0.98] ${
                  isPlayed ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 hover:bg-gray-300' : 'bg-[#bcf200] text-[#1b1c1c] hover:brightness-95'
                }`}>
                {saving ? 'Guardando...' : isPlayed ? 'Actualizar' : 'Guardar Resultado'}
              </button>
              {isPlayed && (
                <button type="button" onClick={handleReset}
                  className="px-3 py-2.5 rounded text-[0.6rem] font-bold uppercase tracking-wider text-red-600 border border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors active:scale-[0.98]">
                  Revertir
                </button>
              )}
            </div>
          )}
        </form>

        {isPlayed && (
          <button type="button" onClick={() => setDetailOpen(true)}
            className="w-full mt-2 py-2 rounded text-[0.55rem] font-bold uppercase tracking-wider text-gray-500 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:scale-[0.98]">
            📋 Ver Detalle
          </button>
        )}
      </div>

      <MatchDetailModal match={match} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </>
  )
}
