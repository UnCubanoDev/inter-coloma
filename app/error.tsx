'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <span className="text-5xl font-oswald font-bold text-red-600">!</span>
      <h1 className="text-xl font-oswald font-bold uppercase tracking-wide mt-2">Algo salió mal</h1>
      <p className="text-sm text-gray-500 mt-1">Ocurrió un error inesperado. Intenta de nuevo.</p>
      <button
        onClick={reset}
        className="mt-5 bg-[#00450d] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded hover:brightness-110 transition-all cursor-pointer"
      >
        Reintentar
      </button>
    </div>
  )
}
