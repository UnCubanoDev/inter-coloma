'use client'

import { useState } from 'react'
import { setupPlayoffs } from '@/lib/data'

export function SetupPlayoffs({ needsSetup, onSetup }: { needsSetup: boolean; onSetup: () => void }) {
  const [busy, setBusy] = useState(false)

  if (!needsSetup) return null

  const handleClick = async () => {
    setBusy(true)
    await setupPlayoffs()
    onSetup()
    setBusy(false)
  }

  return (
    <button onClick={handleClick} disabled={busy}
      className="btn-primary text-xs px-5 py-2.5">
      {busy ? 'Configurando...' : 'Configurar Playoffs'}
    </button>
  )
}
