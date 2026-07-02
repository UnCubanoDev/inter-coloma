'use client'

import { useState } from 'react'
import { login } from '@/lib/auth'

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(false)
    const ok = login(password)
    if (ok) {
      onClose()
    } else {
      setError(true)
    }
    setBusy(false)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-oswald font-bold uppercase tracking-wide text-gray-800 dark:text-gray-100 mb-1">Acceso Admin</h2>
        <p className="text-xs text-gray-500 mb-5">Ingresa la contraseña para administrar el torneo</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false) }}
              placeholder="Contraseña"
              autoFocus
              className="input-bb w-full text-base"
            />
            {error && <p className="text-xs text-red-600 mt-1">Contraseña incorrecta</p>}
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded text-xs font-bold uppercase tracking-wider text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={busy || !password}
              className="flex-1 py-2.5 rounded text-xs font-bold uppercase tracking-wider bg-[#00450d] text-white hover:brightness-110 transition-all disabled:opacity-50">
              {busy ? 'Validando...' : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
