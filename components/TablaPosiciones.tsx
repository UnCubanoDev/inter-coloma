'use client'

import { useStandings } from '@/lib/use-data'

export default function TablaPosiciones({ highlightTop6 = true }: { highlightTop6?: boolean }) {
  const { standings, loading } = useStandings()

  if (loading) return <div className="text-center py-12 text-gray-400"><p className="text-sm">Cargando...</p></div>
  if (standings.length === 0) return <div className="text-center py-12 text-gray-400"><p className="text-sm">No hay datos disponibles</p><p className="text-xs mt-1">Los resultados aparecerán cuando se jueguen partidos</p></div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-3 py-3 text-left text-[0.6rem] font-bold uppercase tracking-wider text-gray-500">#</th>
            <th className="px-3 py-3 text-left text-[0.6rem] font-bold uppercase tracking-wider text-gray-500">Equipo</th>
            <th className="px-3 py-3 text-center text-[0.6rem] font-bold uppercase tracking-wider text-gray-500">PJ</th>
            <th className="px-3 py-3 text-center text-[0.6rem] font-bold uppercase tracking-wider text-gray-500">G</th>
            <th className="px-3 py-3 text-center text-[0.6rem] font-bold uppercase tracking-wider text-gray-500">E</th>
            <th className="px-3 py-3 text-center text-[0.6rem] font-bold uppercase tracking-wider text-gray-500">P</th>
            <th className="px-3 py-3 text-center text-[0.6rem] font-bold uppercase tracking-wider text-gray-500">GF</th>
            <th className="px-3 py-3 text-center text-[0.6rem] font-bold uppercase tracking-wider text-gray-500">GC</th>
            <th className="px-3 py-3 text-center text-[0.6rem] font-bold uppercase tracking-wider text-gray-500">DG</th>
            <th className="px-3 py-3 text-center text-[0.6rem] font-bold uppercase tracking-wider text-[#00450d]">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => {
            const isTop6 = index < 6
            return (
              <tr key={team.id} className={`border-b border-gray-100 dark:border-gray-700/50 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${isTop6 && highlightTop6 ? 'bg-[#00450d]/[0.02]' : ''}`}>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[0.6rem] font-bold ${isTop6 ? 'bg-[#00450d] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{index + 1}</span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm">{team.nombre}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-center font-medium">{team.jj}</td>
                <td className="px-3 py-3 text-center font-medium text-green-700 dark:text-green-400">{team.jg}</td>
                <td className="px-3 py-3 text-center font-medium text-yellow-600 dark:text-yellow-400">{team.je}</td>
                <td className="px-3 py-3 text-center font-medium text-red-600 dark:text-red-400">{team.jp}</td>
                <td className="px-3 py-3 text-center font-medium">{team.gf}</td>
                <td className="px-3 py-3 text-center text-gray-500">{team.gc}</td>
                <td className={`px-3 py-3 text-center font-bold ${team.dg > 0 ? 'text-green-600' : team.dg < 0 ? 'text-red-600' : 'text-gray-500'}`}>{team.dg > 0 ? '+' : ''}{team.dg}</td>
                <td className="px-3 py-3 text-center font-oswald font-bold text-lg text-[#00450d]">{team.pts}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-2">
        <span className="w-3 h-3 rounded bg-[#00450d] inline-block" />
        <span className="text-[0.6rem] text-gray-500 font-semibold uppercase tracking-wider">Clasificados a playoffs (Top 6)</span>
      </div>
    </div>
  )
}
