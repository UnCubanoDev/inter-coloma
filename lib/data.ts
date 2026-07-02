import { getDb } from './db'

export interface EquipoRow { id: number; numero: number; nombre: string }

export interface PartidoRow {
  id: number; fecha: string; dia: string; orden: number
  equipoLocalId: number; equipoVisitanteId: number
  golesLocal: number | null; golesVisitante: number | null; jugado: number
  equipoLocal: EquipoRow; equipoVisitante: EquipoRow
}

export interface PlayoffRow {
  id: number; ronda: string; orden: number; fecha: string | null
  equipoLocalId: number | null; equipoVisitanteId: number | null
  golesLocal: number | null; golesVisitante: number | null; jugado: number
  equipoLocal: EquipoRow | null; equipoVisitante: EquipoRow | null
}

export interface TeamStanding {
  id: number; nombre: string; numero: number
  jj: number; jg: number; je: number; jp: number
  gf: number; gc: number; dg: number; pts: number
}

export interface JugadorRow {
  id: number; equipoId: number; nombre: string; numero: number | null; posicion: string
}

export interface EventoRow {
  id: number; partidoId: number; jugadorId: number; equipoId: number
  tipo: string; minuto: number | null
  jugadorNombre: string; jugadorNumero: number | null
  equipoNombre: string
}

export interface GoleadorRow {
  jugadorId: number; nombre: string; numero: number | null
  equipoId: number; equipoNombre: string; goles: number
}

export interface AsistidorRow {
  jugadorId: number; nombre: string; numero: number | null
  equipoId: number; equipoNombre: string; asistencias: number
}

export interface TarjetaRow {
  jugadorId: number; nombre: string; numero: number | null
  equipoId: number; equipoNombre: string; amarillas: number; rojas: number
}

export async function getEquipos(): Promise<EquipoRow[]> {
  const client = getDb()
  const r = await client.execute('SELECT * FROM equipos ORDER BY numero')
  return r.rows as any as EquipoRow[]
}

export async function getPartidos(): Promise<PartidoRow[]> {
  const client = getDb()
  const r = await client.execute(`
    SELECT p.*, l.numero as l_num, l.nombre as l_nombre, v.numero as v_num, v.nombre as v_nombre
    FROM partidos p
    JOIN equipos l ON l.id = p.equipoLocalId
    JOIN equipos v ON v.id = p.equipoVisitanteId
    ORDER BY p.fecha ASC
  `)
  return r.rows.map((row: any) => ({
    id: row.id, fecha: row.fecha, dia: row.dia, orden: row.orden,
    equipoLocalId: row.equipoLocalId, equipoVisitanteId: row.equipoVisitanteId,
    golesLocal: row.golesLocal, golesVisitante: row.golesVisitante, jugado: row.jugado,
    equipoLocal: { id: row.equipoLocalId, numero: row.l_num, nombre: row.l_nombre },
    equipoVisitante: { id: row.equipoVisitanteId, numero: row.v_num, nombre: row.v_nombre },
  })) as PartidoRow[]
}

export async function getPlayoffs(): Promise<PlayoffRow[]> {
  const client = getDb()
  const r = await client.execute(`
    SELECT po.*, l.id as l_id, l.numero as l_num, l.nombre as l_nombre,
           v.id as v_id, v.numero as v_num, v.nombre as v_nombre
    FROM playoffs po
    LEFT JOIN equipos l ON l.id = po.equipoLocalId
    LEFT JOIN equipos v ON v.id = po.equipoVisitanteId
    ORDER BY po.id ASC
  `)
  return r.rows.map((row: any) => ({
    id: row.id, ronda: row.ronda, orden: row.orden, fecha: row.fecha,
    equipoLocalId: row.equipoLocalId, equipoVisitanteId: row.equipoVisitanteId,
    golesLocal: row.golesLocal, golesVisitante: row.golesVisitante, jugado: row.jugado,
    equipoLocal: row.l_id ? { id: row.l_id, numero: row.l_num, nombre: row.l_nombre } : null,
    equipoVisitante: row.v_id ? { id: row.v_id, numero: row.v_num, nombre: row.v_nombre } : null,
  })) as PlayoffRow[]
}

export async function getPartidosCount(): Promise<{ total: number; jugados: number }> {
  const client = getDb()
  const t = await client.execute('SELECT COUNT(*) as c FROM partidos')
  const j = await client.execute('SELECT COUNT(*) as c FROM partidos WHERE jugado = 1')
  return { total: (t.rows[0] as any).c, jugados: (j.rows[0] as any).c }
}

export async function getTotalGoles(): Promise<number> {
  const client = getDb()
  const r = await client.execute('SELECT COALESCE(SUM(golesLocal), 0) + COALESCE(SUM(golesVisitante), 0) as total FROM partidos WHERE jugado = 1')
  return (r.rows[0] as any).total
}

export async function updatePartido(id: number, golesLocal: number, golesVisitante: number) {
  const client = getDb()
  await client.execute({
    sql: 'UPDATE partidos SET golesLocal = ?, golesVisitante = ?, jugado = 1 WHERE id = ?',
    args: [golesLocal, golesVisitante, id],
  })
}

export async function resetPartido(id: number) {
  const client = getDb()
  await client.execute({ sql: 'DELETE FROM eventos_partido WHERE partidoId = ?', args: [id] })
  await client.execute({
    sql: 'UPDATE partidos SET golesLocal = NULL, golesVisitante = NULL, jugado = 0 WHERE id = ?',
    args: [id],
  })
}

export async function deletePartido(id: number) {
  const client = getDb()
  await client.execute({ sql: 'DELETE FROM eventos_partido WHERE partidoId = ?', args: [id] })
  await client.execute({ sql: 'DELETE FROM partidos WHERE id = ?', args: [id] })
}

export async function resetAllData() {
  const client = getDb()
  await client.execute('DELETE FROM eventos_partido')
  await client.execute('UPDATE partidos SET golesLocal = NULL, golesVisitante = NULL, jugado = 0')
  await client.execute('UPDATE playoffs SET golesLocal = NULL, golesVisitante = NULL, jugado = 0, equipoLocalId = NULL, equipoVisitanteId = NULL')
}

// ── Jugadores ──────────────────────────────────────────
export async function getJugadores(equipoId?: number): Promise<JugadorRow[]> {
  const client = getDb()
  const sql = equipoId
    ? { sql: 'SELECT * FROM jugadores WHERE equipoId = ? ORDER BY numero', args: [equipoId] }
    : { sql: 'SELECT * FROM jugadores ORDER BY equipoId, numero', args: [] }
  const r = await client.execute(sql)
  return r.rows as any as JugadorRow[]
}

export async function getJugadoresByEquipos(): Promise<{ equipo: EquipoRow; jugadores: JugadorRow[] }[]> {
  const [equipos, jugadores] = await Promise.all([getEquipos(), getJugadores()])
  return equipos.map(eq => ({
    equipo: eq,
    jugadores: jugadores.filter(j => j.equipoId === eq.id),
  }))
}

export async function addJugador(equipoId: number, nombre: string, numero?: number, posicion?: string) {
  const client = getDb()
  await client.execute({
    sql: 'INSERT INTO jugadores (equipoId, nombre, numero, posicion) VALUES (?, ?, ?, ?)',
    args: [equipoId, nombre, numero ?? null, posicion ?? ''],
  })
}

export async function updateJugador(id: number, nombre: string, numero?: number, posicion?: string) {
  const client = getDb()
  await client.execute({
    sql: 'UPDATE jugadores SET nombre = ?, numero = ?, posicion = ? WHERE id = ?',
    args: [nombre, numero ?? null, posicion ?? '', id],
  })
}

export async function deleteJugador(id: number) {
  const client = getDb()
  await client.execute({ sql: 'DELETE FROM eventos_partido WHERE jugadorId = ?', args: [id] })
  await client.execute({ sql: 'DELETE FROM jugadores WHERE id = ?', args: [id] })
}

// ── Eventos ────────────────────────────────────────────
export async function addEvento(partidoId: number, jugadorId: number, equipoId: number, tipo: string, minuto?: number) {
  const client = getDb()
  await client.execute({
    sql: 'INSERT INTO eventos_partido (partidoId, jugadorId, equipoId, tipo, minuto) VALUES (?, ?, ?, ?, ?)',
    args: [partidoId, jugadorId, equipoId, tipo, minuto ?? null],
  })
}

export async function removeEvento(id: number) {
  const client = getDb()
  await client.execute({ sql: 'DELETE FROM eventos_partido WHERE id = ?', args: [id] })
}

export async function getEventosByPartido(partidoId: number): Promise<EventoRow[]> {
  const client = getDb()
  const r = await client.execute({
    sql: `SELECT e.*, j.nombre as jugadorNombre, j.numero as jugadorNumero, eq.nombre as equipoNombre
          FROM eventos_partido e
          JOIN jugadores j ON j.id = e.jugadorId
          JOIN equipos eq ON eq.id = e.equipoId
          WHERE e.partidoId = ?
          ORDER BY e.id`,
    args: [partidoId],
  })
  return r.rows as any as EventoRow[]
}

// ── Estadísticas ──────────────────────────────────────
export async function getGoleadores(): Promise<GoleadorRow[]> {
  const client = getDb()
  const r = await client.execute(`
    SELECT j.id as jugadorId, j.nombre, j.numero, eq.id as equipoId, eq.nombre as equipoNombre,
           COUNT(*) as goles
    FROM eventos_partido e
    JOIN jugadores j ON j.id = e.jugadorId
    JOIN equipos eq ON eq.id = e.equipoId
    WHERE e.tipo = 'gol'
    GROUP BY j.id
    ORDER BY goles DESC
  `)
  return r.rows as any as GoleadorRow[]
}

export async function getAsistidores(): Promise<AsistidorRow[]> {
  const client = getDb()
  const r = await client.execute(`
    SELECT j.id as jugadorId, j.nombre, j.numero, eq.id as equipoId, eq.nombre as equipoNombre,
           COUNT(*) as asistencias
    FROM eventos_partido e
    JOIN jugadores j ON j.id = e.jugadorId
    JOIN equipos eq ON eq.id = e.equipoId
    WHERE e.tipo = 'asistencia'
    GROUP BY j.id
    ORDER BY asistencias DESC
  `)
  return r.rows as any as AsistidorRow[]
}

export async function getTarjetas(): Promise<TarjetaRow[]> {
  const client = getDb()
  const r = await client.execute(`
    SELECT j.id as jugadorId, j.nombre, j.numero, eq.id as equipoId, eq.nombre as equipoNombre,
           SUM(CASE WHEN e.tipo = 'amarilla' THEN 1 ELSE 0 END) as amarillas,
           SUM(CASE WHEN e.tipo = 'roja' THEN 1 ELSE 0 END) as rojas
    FROM eventos_partido e
    JOIN jugadores j ON j.id = e.jugadorId
    JOIN equipos eq ON eq.id = e.equipoId
    WHERE e.tipo IN ('amarilla', 'roja')
    GROUP BY j.id
    ORDER BY rojas DESC, amarillas DESC
  `)
  return r.rows as any as TarjetaRow[]
}

export async function getEventosCount(): Promise<number> {
  const client = getDb()
  const r = await client.execute('SELECT COUNT(*) as c FROM eventos_partido')
  return (r.rows[0] as any).c
}

export async function getStandings(): Promise<TeamStanding[]> {
  const [partidos, equipos] = await Promise.all([getPartidos(), getEquipos()])
  const jugados = partidos.filter(p => p.jugado)

  return equipos.map(eq => {
    const s = { id: eq.id, nombre: eq.nombre, numero: eq.numero, jj: 0, jg: 0, je: 0, jp: 0, gf: 0, gc: 0, dg: 0, pts: 0 }
    for (const p of jugados) {
      if (p.equipoLocalId === eq.id) {
        s.jj++; s.gf += p.golesLocal!; s.gc += p.golesVisitante!
        if (p.golesLocal! > p.golesVisitante!) { s.jg++; s.pts += 3 }
        else if (p.golesLocal! === p.golesVisitante!) { s.je++; s.pts += 1 }
        else { s.jp++ }
      } else if (p.equipoVisitanteId === eq.id) {
        s.jj++; s.gf += p.golesVisitante!; s.gc += p.golesLocal!
        if (p.golesVisitante! > p.golesLocal!) { s.jg++; s.pts += 3 }
        else if (p.golesVisitante! === p.golesLocal!) { s.je++; s.pts += 1 }
        else { s.jp++ }
      }
    }
    s.dg = s.gf - s.gc
    return s
  }).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts
    if (b.dg !== a.dg) return b.dg - a.dg
    return b.gf - a.gf
  })
}

export async function setupPlayoffs() {
  const standings = await getStandings()
  if (standings.length < 6) return
  const playoffs = await getPlayoffs()
  const client = getDb()

  if (playoffs.length >= 2) {
    await client.execute({
      sql: 'UPDATE playoffs SET equipoLocalId = ?, equipoVisitanteId = ? WHERE id = ?',
      args: [standings[2].id, standings[5].id, playoffs[0].id],
    })
    await client.execute({
      sql: 'UPDATE playoffs SET equipoLocalId = ?, equipoVisitanteId = ? WHERE id = ?',
      args: [standings[3].id, standings[4].id, playoffs[1].id],
    })
  }
  if (playoffs.length >= 4) {
    await client.execute({
      sql: 'UPDATE playoffs SET equipoLocalId = ? WHERE id = ?',
      args: [standings[1].id, playoffs[2].id],
    })
    await client.execute({
      sql: 'UPDATE playoffs SET equipoLocalId = ? WHERE id = ?',
      args: [standings[0].id, playoffs[3].id],
    })
  }
}

export async function updatePlayoff(id: number, golesLocal: number, golesVisitante: number) {
  const client = getDb()
  await client.execute({
    sql: 'UPDATE playoffs SET golesLocal = ?, golesVisitante = ?, jugado = 1 WHERE id = ?',
    args: [golesLocal, golesVisitante, id],
  })
}

export async function advancePlayoff(playoffId: number) {
  const client = getDb()
  const matchR = await client.execute({
    sql: 'SELECT * FROM playoffs WHERE id = ?',
    args: [playoffId],
  })
  const match = matchR.rows[0] as any
  if (!match || !match.jugado || match.golesLocal === null || match.golesVisitante === null) return

  const winnerId = match.golesLocal > match.golesVisitante ? match.equipoLocalId : match.equipoVisitanteId
  const playoffs = (await client.execute('SELECT * FROM playoffs ORDER BY id')).rows as any[]
  const matchIdx = playoffs.findIndex((p: any) => p.id === playoffId)

  if (matchIdx === 0 && playoffs.length >= 3) {
    await client.execute({ sql: 'UPDATE playoffs SET equipoVisitanteId = ? WHERE id = ?', args: [winnerId, playoffs[2].id] })
  } else if (matchIdx === 1 && playoffs.length >= 4) {
    await client.execute({ sql: 'UPDATE playoffs SET equipoVisitanteId = ? WHERE id = ?', args: [winnerId, playoffs[3].id] })
  } else if ((matchIdx === 2 || matchIdx === 3) && playoffs.length >= 5) {
    const otherIdx = matchIdx === 2 ? 3 : 2
    const otherR = await client.execute({ sql: 'SELECT * FROM playoffs WHERE id = ?', args: [playoffs[otherIdx].id] })
    const other = otherR.rows[0] as any
    if (other?.jugado && other.golesLocal !== null && other.golesVisitante !== null) {
      const otherWinner = other.golesLocal > other.golesVisitante ? other.equipoLocalId : other.equipoVisitanteId
      const [localId, visitId] = matchIdx === 2 ? [winnerId, otherWinner] : [otherWinner, winnerId]
      await client.execute({
        sql: 'UPDATE playoffs SET equipoLocalId = ?, equipoVisitanteId = ? WHERE id = ?',
        args: [localId, visitId, playoffs[4].id],
      })
    }
  }
}

export async function resetPlayoff(id: number) {
  const client = getDb()
  await client.execute({
    sql: 'UPDATE playoffs SET golesLocal = NULL, golesVisitante = NULL, jugado = 0 WHERE id = ?',
    args: [id],
  })

  const playoffs = (await client.execute('SELECT * FROM playoffs ORDER BY id')).rows as any[]
  const idx = playoffs.findIndex((p: any) => p.id === id)
  if ((idx === 2 || idx === 3) && playoffs.length >= 5) {
    await client.execute({
      sql: 'UPDATE playoffs SET equipoLocalId = NULL, equipoVisitanteId = NULL WHERE id = ?',
      args: [playoffs[4].id],
    })
  }
}
