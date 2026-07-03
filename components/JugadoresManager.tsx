'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useJugadoresByEquipos } from '@/lib/use-data'
import { addJugador, updateJugador, deleteJugador } from '@/lib/data'
import { useAdmin } from './AuthGuard'
import TeamBadge from '@/components/TeamBadge'

export function JugadoresManager() {
  const admin = useAdmin()
  const { equipos, refresh } = useJugadoresByEquipos()
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null)
  const [addName, setAddName] = useState('')
  const [addNum, setAddNum] = useState('')
  const [addPos, setAddPos] = useState('')
  const [editing, setEditing] = useState<{ id: number; nombre: string; numero: string; posicion: string } | null>(null)

  const handleAdd = async (equipoId: number) => {
    if (!addName.trim()) return
    await addJugador(equipoId, addName.trim(), addNum ? parseInt(addNum) : undefined, addPos.trim() || undefined)
    setAddName(''); setAddNum(''); setAddPos('')
    toast.success(`${addName.trim()} agregado`)
    refresh()
  }

  const handleEdit = async (id: number) => {
    if (!editing || !editing.nombre.trim()) return
    await updateJugador(id, editing.nombre.trim(), editing.numero ? parseInt(editing.numero) : undefined, editing.posicion.trim() || undefined)
    setEditing(null)
    toast.success('Jugador actualizado')
    refresh()
  }

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar a ${nombre}?`)) return
    await deleteJugador(id)
    toast.success(`${nombre} eliminado`)
    refresh()
  }

  return (
    <div className="space-y-4">
      {equipos.map(({ equipo, jugadores }) => (
        <div key={equipo.id} className="card overflow-hidden">
          <button onClick={() => setExpandedTeam(expandedTeam === equipo.id ? null : equipo.id)}
            className="w-full flex items-center justify-between px-4 md:px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center gap-2">
              <TeamBadge numero={equipo.numero} name={equipo.nombre} />
              <span className="badge-gray text-[0.5rem]">{jugadores.length} jugadores</span>
            </div>
            <span className={`text-gray-400 transition-transform ${expandedTeam === equipo.id ? 'rotate-180' : ''}`}>▾</span>
          </button>

          {expandedTeam === equipo.id && (
            <div className="px-4 md:px-5 pb-4">
              <div className="space-y-1.5 mb-4">
                {jugadores.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Sin jugadores registrados</p>}
                {jugadores.map(j => (
                  <div key={j.id} className="flex items-center justify-between gap-2 py-1.5 border-b border-gray-100 dark:border-gray-700/30 last:border-0">
                    {editing && editing.id === j.id ? (
                      <div className="flex-1 flex flex-wrap gap-2">
                        <input value={editing.nombre} onChange={e => setEditing({ ...editing, nombre: e.target.value })}
                          className="input-bb flex-1 min-w-[100px] text-sm" placeholder="Nombre" />
                        <input value={editing.numero} onChange={e => setEditing({ ...editing, numero: e.target.value })}
                          className="input-bb w-12 text-sm text-center" placeholder="#" type="number" />
                        <input value={editing.posicion} onChange={e => setEditing({ ...editing, posicion: e.target.value })}
                          className="input-bb w-20 text-sm" placeholder="Posición" />
                        <button onClick={() => handleEdit(j.id)} className="text-[0.55rem] font-bold uppercase tracking-wider text-green-700 px-2">Guardar</button>
                        <button onClick={() => setEditing(null)} className="text-[0.55rem] font-bold uppercase tracking-wider text-gray-400 px-2">Cancelar</button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-xs font-oswald font-bold text-gray-400 w-6 shrink-0">{j.numero || '-'}</span>
                          <span className="text-sm truncate">{j.nombre}</span>
                          {j.posicion && <span className="text-[0.5rem] text-gray-400 uppercase tracking-wider shrink-0">{j.posicion}</span>}
                        </div>
                        {admin && (
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => setEditing({ id: j.id, nombre: j.nombre, numero: String(j.numero ?? ''), posicion: j.posicion })}
                              className="text-[0.5rem] font-bold uppercase tracking-wider text-blue-600 px-1.5 py-0.5 rounded hover:bg-blue-50 transition-colors">Editar</button>
                            <button onClick={() => handleDelete(j.id, j.nombre)}
                              className="text-[0.5rem] font-bold uppercase tracking-wider text-red-600 px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors">Eliminar</button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>

              {admin && (
                <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-gray-100 dark:border-gray-700/30">
                  <input value={addName} onChange={e => setAddName(e.target.value)} placeholder="Nombre del jugador"
                    className="input-bb flex-1 min-w-[120px] text-sm" />
                  <input value={addNum} onChange={e => setAddNum(e.target.value)} placeholder="#" type="number"
                    className="input-bb w-12 text-sm text-center" min={1} max={99} />
                  <input value={addPos} onChange={e => setAddPos(e.target.value)} placeholder="Posición"
                    className="input-bb w-20 text-sm" />
                  <button onClick={() => handleAdd(equipo.id)} disabled={!addName.trim()}
                    className="btn-primary text-[0.55rem] py-2 px-3 disabled:opacity-40">Agregar</button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
