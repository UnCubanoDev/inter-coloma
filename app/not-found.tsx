import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <span className="text-6xl font-oswald font-bold text-[#00450d]">404</span>
      <h1 className="text-xl font-oswald font-bold uppercase tracking-wide mt-2">Página no encontrada</h1>
      <p className="text-sm text-gray-500 mt-1">La página que buscas no existe o fue movida</p>
      <Link
        href="/"
        className="mt-5 bg-[#00450d] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded hover:brightness-110 transition-all"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
