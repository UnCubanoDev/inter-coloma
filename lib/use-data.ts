'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { initSchema, ensureSeedData } from './db'
import * as data from './data'

export type PartidoRow = data.PartidoRow
export type PlayoffRow = data.PlayoffRow
export type TeamStanding = data.TeamStanding
export type EquipoRow = data.EquipoRow
export type JugadorRow = data.JugadorRow
export type EventoRow = data.EventoRow
export type GoleadorRow = data.GoleadorRow
export type AsistidorRow = data.AsistidorRow
export type TarjetaRow = data.TarjetaRow

let dbReady = false
let dbInitPromise: Promise<void> | null = null

function ensureDbReady(): Promise<void> {
  if (dbReady) return Promise.resolve()
  if (dbInitPromise) return dbInitPromise
  dbInitPromise = initSchema()
    .then(() => ensureSeedData())
    .then(() => { dbReady = true })
  return dbInitPromise
}

export function useInit() {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ensureDbReady()
      .then(() => setReady(true))
      .catch(e => setError(e.message))
  }, [])

  return { ready, error }
}

export function usePartidos() {
  const [partidos, setPartidos] = useState<PartidoRow[]>([])
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    await ensureDbReady()
    if (!mounted.current) return
    const p = await data.getPartidos()
    if (!mounted.current) return
    setPartidos(p)
    setLoading(false)
  }, [])

  useEffect(() => {
    mounted.current = true
    refresh()
    return () => { mounted.current = false }
  }, [refresh])
  return { partidos, loading, refresh }
}

export function useStandings() {
  const [standings, setStandings] = useState<TeamStanding[]>([])
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    await ensureDbReady()
    if (!mounted.current) return
    const s = await data.getStandings()
    if (!mounted.current) return
    setStandings(s)
    setLoading(false)
  }, [])

  useEffect(() => {
    mounted.current = true
    refresh()
    return () => { mounted.current = false }
  }, [refresh])
  return { standings, loading, refresh }
}

export function usePlayoffs() {
  const [playoffs, setPlayoffs] = useState<PlayoffRow[]>([])
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    await ensureDbReady()
    if (!mounted.current) return
    const p = await data.getPlayoffs()
    if (!mounted.current) return
    setPlayoffs(p)
    setLoading(false)
  }, [])

  useEffect(() => {
    mounted.current = true
    refresh()
    return () => { mounted.current = false }
  }, [refresh])
  return { playoffs, loading, refresh }
}

export function useStats() {
  const [stats, setStats] = useState({ total: 0, jugados: 0, goles: 0, eventos: 0 })
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    await ensureDbReady()
    if (!mounted.current) return
    const [c, g, ev] = await Promise.all([data.getPartidosCount(), data.getTotalGoles(), data.getEventosCount()])
    if (!mounted.current) return
    setStats({ total: c.total, jugados: c.jugados, goles: g, eventos: ev })
    setLoading(false)
  }, [])

  useEffect(() => {
    mounted.current = true
    refresh()
    return () => { mounted.current = false }
  }, [refresh])
  return { stats, loading, refresh }
}

// ── Jugadores hooks ──────────────────────────────────
export function useJugadores(equipoId?: number) {
  const [jugadores, setJugadores] = useState<JugadorRow[]>([])
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    await ensureDbReady()
    if (!mounted.current) return
    const j = await data.getJugadores(equipoId)
    if (!mounted.current) return
    setJugadores(j)
    setLoading(false)
  }, [equipoId])

  useEffect(() => {
    mounted.current = true
    refresh()
    return () => { mounted.current = false }
  }, [refresh])
  return { jugadores, loading, refresh }
}

export function useJugadoresByEquipos() {
  const [data_, setData_] = useState<{ equipo: EquipoRow; jugadores: JugadorRow[] }[]>([])
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    await ensureDbReady()
    if (!mounted.current) return
    const d = await data.getJugadoresByEquipos()
    if (!mounted.current) return
    setData_(d)
    setLoading(false)
  }, [])

  useEffect(() => {
    mounted.current = true
    refresh()
    return () => { mounted.current = false }
  }, [refresh])
  return { equipos: data_, loading, refresh }
}

export function useEventos(partidoId: number | null) {
  const [eventos, setEventos] = useState<EventoRow[]>([])
  const [loading, setLoading] = useState(false)
  const mounted = useRef(true)

  const refresh = useCallback(async () => {
    if (partidoId === null) { setEventos([]); return }
    setLoading(true)
    await ensureDbReady()
    if (!mounted.current) return
    const e = await data.getEventosByPartido(partidoId)
    if (!mounted.current) return
    setEventos(e)
    setLoading(false)
  }, [partidoId])

  useEffect(() => {
    mounted.current = true
    refresh()
    return () => { mounted.current = false }
  }, [refresh])
  return { eventos, loading, refresh }
}

export function useGoleadores() {
  const [data_, setData_] = useState<GoleadorRow[]>([])
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    await ensureDbReady()
    if (!mounted.current) return
    const g = await data.getGoleadores()
    if (!mounted.current) return
    setData_(g)
    setLoading(false)
  }, [])

  useEffect(() => {
    mounted.current = true
    refresh()
    return () => { mounted.current = false }
  }, [refresh])
  return { goleadores: data_, loading, refresh }
}

export function useAsistidores() {
  const [data_, setData_] = useState<AsistidorRow[]>([])
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    await ensureDbReady()
    if (!mounted.current) return
    const a = await data.getAsistidores()
    if (!mounted.current) return
    setData_(a)
    setLoading(false)
  }, [])

  useEffect(() => {
    mounted.current = true
    refresh()
    return () => { mounted.current = false }
  }, [refresh])
  return { asistidores: data_, loading, refresh }
}

export function useTarjetas() {
  const [data_, setData_] = useState<TarjetaRow[]>([])
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    await ensureDbReady()
    if (!mounted.current) return
    const t = await data.getTarjetas()
    if (!mounted.current) return
    setData_(t)
    setLoading(false)
  }, [])

  useEffect(() => {
    mounted.current = true
    refresh()
    return () => { mounted.current = false }
  }, [refresh])
  return { tarjetas: data_, loading, refresh }
}
