'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { resetPartido, deletePartido } from '@/lib/data'
import { useAdmin } from '@/components/AuthGuard'
import { PartidoRow } from '@/lib/use-data'
import TeamBadge from '@/components/TeamBadge'

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

export function AdminMatchRow({ match, onUpdate }: { match: PartidoRow; onUpdate: () => void }) {
  const admin = useAdmin()
  const [busy, setBusy] = useState(false)

  const handleReset = async () => {
    if (!admin) return
    if (!confirm('¿Resetear este partido?')) return
    setBusy(true)
    await resetPartido(match.id)
    toast.success('Partido reseteado')
    onUpdate()
    setBusy(false)
  }

  const handleDelete = async () => {
    if (!admin) return
    if (!confirm('¿Eliminar este partido permanentemente?')) return
    setBusy(true)
    await deletePartido(match.id)
    toast.success('Partido eliminado')
    onUpdate()
    setBusy(false)
  }

  return (
    <tr className="border-t border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-3 py-3 text-gray-600 dark:text-gray-400 text-[0.7rem] whitespace-nowrap">
        {formatDate(match.fecha)} <span className="text-gray-300">#{match.orden}</span>
      </td>
      <td className="px-2 py-3 text-sm min-w-[5rem]"><TeamBadge numero={match.equipoLocal.numero} name={match.equipoLocal.nombre} /></td>
      <td className="px-2 py-3 text-center whitespace-nowrap">
        {match.jugado ? (
          <span className="font-oswald font-bold text-base">{match.golesLocal} - {match.golesVisitante}</span>
        ) : (
          <span className="text-gray-300 text-[0.6rem] font-semibold uppercase tracking-wider">vs</span>
        )}
      </td>
      <td className="px-2 py-3 text-sm text-right min-w-[5rem]"><TeamBadge numero={match.equipoVisitante.numero} name={match.equipoVisitante.nombre} reverse /></td>
      <td className="px-2 py-3 text-center">
        {match.jugado ? <span className="badge-green">Jugado</span> : <span className="badge-gray">Pendiente</span>}
      </td>
      <td className="px-2 py-3 text-center">
        {admin ? (
          <div className="flex items-center justify-center gap-1">
            <button onClick={handleReset} disabled={!match.jugado || busy}
              className={`px-2.5 py-1.5 rounded text-[0.55rem] font-bold uppercase tracking-wider transition-colors ${match.jugado ? 'text-amber-700 border border-amber-200 hover:bg-amber-50' : 'text-gray-300 cursor-not-allowed'}`}>
              Reset
            </button>
            <button onClick={handleDelete} disabled={busy}
              className="px-2.5 py-1.5 rounded text-[0.55rem] font-bold uppercase tracking-wider text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
              Eliminar
            </button>
          </div>
        ) : (
          <span className="text-[0.5rem] text-gray-300 uppercase tracking-wider font-semibold">---</span>
        )}
      </td>
    </tr>
  )
}
