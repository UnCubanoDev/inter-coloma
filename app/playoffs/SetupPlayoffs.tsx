'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { setupPlayoffs } from '@/lib/data'

export function SetupPlayoffs({ needsSetup, onSetup }: { needsSetup: boolean; onSetup: () => void }) {
  const [busy, setBusy] = useState(false)

  if (!needsSetup) return null

  const handleClick = async () => {
    setBusy(true)
    await setupPlayoffs()
    toast.success('Playoffs configurados')
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
