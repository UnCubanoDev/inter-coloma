'use client'

import { PlayoffRow } from '@/lib/use-data'

const rondaLabels: Record<string, string> = {
  cuartos_1: 'Cuartos 1', cuartos_2: 'Cuartos 2',
  semifinal_1: 'Semifinal 1', semifinal_2: 'Semifinal 2',
  final: 'Final',
}

export function PlayoffAdmin({ match }: { match: PlayoffRow }) {
  const localName = match.equipoLocal?.nombre || 'Por definir'
  const visitName = match.equipoVisitante?.nombre || 'Por definir'
  const isReady = match.equipoLocalId !== null && match.equipoVisitanteId !== null

  return (
    <tr className="border-t border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-4 py-3 font-medium text-[0.7rem] text-gray-600">{rondaLabels[match.ronda] || match.ronda}</td>
      <td className={`px-4 py-3 text-sm ${isReady ? 'font-medium' : 'text-gray-400'}`}>{localName}</td>
      <td className="px-4 py-3 text-center">
        {match.jugado ? (
          <span className="font-oswald font-bold text-base">{match.golesLocal} - {match.golesVisitante}</span>
        ) : (
          <span className="text-gray-300 text-[0.6rem] font-semibold uppercase tracking-wider">vs</span>
        )}
      </td>
      <td className={`px-4 py-3 text-sm text-right ${isReady ? 'font-medium' : 'text-gray-400'}`}>{visitName}</td>
      <td className="px-4 py-3 text-center">
        {match.jugado ? <span className="badge-green">Jugado</span> : isReady ? <span className="badge-gray">Pendiente</span> : <span className="badge-gray">Por definir</span>}
      </td>
    </tr>
  )
}
