'use client'

import { useRouter } from 'next/navigation'

export function WeekNav({ currentWeek, totalJornadas }: { currentWeek: number; totalJornadas: number }) {
  const router = useRouter()

  const handleWeekChange = (week: number) => {
    router.push(`/calendario?semana=${week}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-gray-500">Seleccionar Jornada</span>
        <span className="text-[0.6rem] font-semibold text-gray-400">Jornada {currentWeek} de {totalJornadas}</span>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {Array.from({ length: totalJornadas }, (_, i) => i + 1).map(week => (
          <button
            key={week}
            onClick={() => handleWeekChange(week)}
            className={`flex-shrink-0 px-4 py-2 rounded text-[0.7rem] font-semibold uppercase tracking-wider transition-all ${
              week === currentWeek
                ? 'bg-[#bcf200] text-[#1b1c1c]'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            J{week}
          </button>
        ))}
      </div>
    </div>
  )
}
