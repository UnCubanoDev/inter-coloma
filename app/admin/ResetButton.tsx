'use client'

import { useState } from 'react'
import { resetAllData } from '@/lib/data'

export function ResetButton({ onReset }: { onReset: () => void }) {
  const [busy, setBusy] = useState(false)

  const handleReset = async () => {
    if (!confirm('¿Reiniciar TODO el torneo? Se eliminarán todos los resultados de partidos y playoffs.')) return
    if (!confirm('⚠️ CONFIRMACIÓN FINAL: Esta acción NO se puede deshacer.')) return
    setBusy(true)
    await resetAllData()
    onReset()
    setBusy(false)
  }

  return (
    <button onClick={handleReset} disabled={busy}
      className="px-4 py-2.5 rounded-lg text-[0.6rem] font-bold uppercase tracking-wider bg-red-600 text-white hover:bg-red-500 transition-all active:scale-[0.98] disabled:opacity-50">
      {busy ? 'Reiniciando...' : 'Reiniciar Torneo'}
    </button>
  )
}
