import { createClient } from '@libsql/client/web'

let db: ReturnType<typeof createClient> | null = null

const SCHEMA = `
CREATE TABLE IF NOT EXISTS equipos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numero INTEGER UNIQUE NOT NULL,
  nombre TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS partidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha TEXT NOT NULL,
  dia TEXT NOT NULL,
  orden INTEGER NOT NULL,
  equipoLocalId INTEGER NOT NULL,
  equipoVisitanteId INTEGER NOT NULL,
  golesLocal INTEGER,
  golesVisitante INTEGER,
  jugado INTEGER DEFAULT 0,
  FOREIGN KEY (equipoLocalId) REFERENCES equipos(id),
  FOREIGN KEY (equipoVisitanteId) REFERENCES equipos(id)
);

CREATE TABLE IF NOT EXISTS playoffs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ronda TEXT NOT NULL,
  orden INTEGER DEFAULT 0,
  fecha TEXT,
  equipoLocalId INTEGER,
  equipoVisitanteId INTEGER,
  golesLocal INTEGER,
  golesVisitante INTEGER,
  jugado INTEGER DEFAULT 0,
  FOREIGN KEY (equipoLocalId) REFERENCES equipos(id),
  FOREIGN KEY (equipoVisitanteId) REFERENCES equipos(id)
);

CREATE TABLE IF NOT EXISTS jugadores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipoId INTEGER NOT NULL,
  nombre TEXT NOT NULL,
  numero INTEGER,
  posicion TEXT DEFAULT '',
  FOREIGN KEY (equipoId) REFERENCES equipos(id)
);

CREATE TABLE IF NOT EXISTS eventos_partido (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  partidoId INTEGER NOT NULL,
  jugadorId INTEGER NOT NULL,
  equipoId INTEGER NOT NULL,
  tipo TEXT NOT NULL,
  minuto INTEGER,
  FOREIGN KEY (partidoId) REFERENCES partidos(id),
  FOREIGN KEY (jugadorId) REFERENCES jugadores(id),
  FOREIGN KEY (equipoId) REFERENCES equipos(id)
);
`

const EQUIPOS_SEED = [
  { numero: 1, nombre: 'Los chamacos' },
  { numero: 2, nombre: 'Los Magdonals' },
  { numero: 3, nombre: 'Los Líderes' },
  { numero: 4, nombre: 'El Parque' },
  { numero: 5, nombre: 'Los Lobos' },
  { numero: 6, nombre: 'S.F.C (km 11)' },
  { numero: 7, nombre: 'El Galba 21' },
  { numero: 8, nombre: 'Fondo de Biquini' },
  { numero: 9, nombre: 'F.C 21' },
  { numero: 10, nombre: 'P.S.G (km 13)' },
  { numero: 11, nombre: 'Los Acapone' },
  { numero: 12, nombre: 'Capo' },
  { numero: 13, nombre: 'La planta' },
]

const SCHEDULE: { local: number; visit: number; date: string; dia: string; orden: number }[] = [
  { local: 2, visit: 6, date: '2026-07-01', dia: 'Miércoles', orden: 1 },
  { local: 1, visit: 3, date: '2026-07-01', dia: 'Miércoles', orden: 2 },
  { local: 4, visit: 7, date: '2026-07-02', dia: 'Jueves', orden: 1 },
  { local: 5, visit: 8, date: '2026-07-02', dia: 'Jueves', orden: 2 },
  { local: 9, visit: 10, date: '2026-07-03', dia: 'Viernes', orden: 1 },
  { local: 11, visit: 12, date: '2026-07-03', dia: 'Viernes', orden: 2 },
  { local: 13, visit: 1, date: '2026-07-04', dia: 'Sábado', orden: 1 },
  { local: 2, visit: 4, date: '2026-07-04', dia: 'Sábado', orden: 2 },
  { local: 3, visit: 5, date: '2026-07-06', dia: 'Lunes', orden: 1 },
  { local: 6, visit: 9, date: '2026-07-06', dia: 'Lunes', orden: 2 },
  { local: 7, visit: 10, date: '2026-07-07', dia: 'Martes', orden: 1 },
  { local: 8, visit: 11, date: '2026-07-07', dia: 'Martes', orden: 2 },
  { local: 12, visit: 13, date: '2026-07-08', dia: 'Miércoles', orden: 1 },
  { local: 1, visit: 4, date: '2026-07-08', dia: 'Miércoles', orden: 2 },
  { local: 2, visit: 5, date: '2026-07-09', dia: 'Jueves', orden: 1 },
  { local: 3, visit: 6, date: '2026-07-09', dia: 'Jueves', orden: 2 },
  { local: 7, visit: 8, date: '2026-07-10', dia: 'Viernes', orden: 1 },
  { local: 9, visit: 11, date: '2026-07-10', dia: 'Viernes', orden: 2 },
  { local: 10, visit: 12, date: '2026-07-11', dia: 'Sábado', orden: 1 },
  { local: 1, visit: 13, date: '2026-07-11', dia: 'Sábado', orden: 2 },
  { local: 2, visit: 3, date: '2026-07-13', dia: 'Lunes', orden: 1 },
  { local: 4, visit: 5, date: '2026-07-13', dia: 'Lunes', orden: 2 },
  { local: 6, visit: 7, date: '2026-07-14', dia: 'Martes', orden: 1 },
  { local: 8, visit: 9, date: '2026-07-14', dia: 'Martes', orden: 2 },
  { local: 10, visit: 11, date: '2026-07-15', dia: 'Miércoles', orden: 1 },
  { local: 12, visit: 1, date: '2026-07-15', dia: 'Miércoles', orden: 2 },
  { local: 2, visit: 13, date: '2026-07-16', dia: 'Jueves', orden: 1 },
  { local: 3, visit: 4, date: '2026-07-16', dia: 'Jueves', orden: 2 },
  { local: 5, visit: 6, date: '2026-07-17', dia: 'Viernes', orden: 1 },
  { local: 7, visit: 9, date: '2026-07-17', dia: 'Viernes', orden: 2 },
  { local: 8, visit: 10, date: '2026-07-18', dia: 'Sábado', orden: 1 },
  { local: 11, visit: 1, date: '2026-07-18', dia: 'Sábado', orden: 2 },
  { local: 12, visit: 2, date: '2026-07-20', dia: 'Lunes', orden: 1 },
  { local: 13, visit: 3, date: '2026-07-20', dia: 'Lunes', orden: 2 },
  { local: 4, visit: 6, date: '2026-07-21', dia: 'Martes', orden: 1 },
  { local: 5, visit: 7, date: '2026-07-21', dia: 'Martes', orden: 2 },
  { local: 8, visit: 9, date: '2026-07-22', dia: 'Miércoles', orden: 1 },
  { local: 10, visit: 11, date: '2026-07-22', dia: 'Miércoles', orden: 2 },
  { local: 1, visit: 12, date: '2026-07-23', dia: 'Jueves', orden: 1 },
  { local: 2, visit: 3, date: '2026-07-23', dia: 'Jueves', orden: 2 },
  { local: 4, visit: 13, date: '2026-07-24', dia: 'Viernes', orden: 1 },
  { local: 5, visit: 6, date: '2026-07-24', dia: 'Viernes', orden: 2 },
  { local: 7, visit: 8, date: '2026-07-25', dia: 'Sábado', orden: 1 },
  { local: 9, visit: 10, date: '2026-07-25', dia: 'Sábado', orden: 2 },
  { local: 11, visit: 12, date: '2026-07-27', dia: 'Lunes', orden: 1 },
  { local: 1, visit: 2, date: '2026-07-27', dia: 'Lunes', orden: 2 },
  { local: 3, visit: 13, date: '2026-07-28', dia: 'Martes', orden: 1 },
  { local: 4, visit: 5, date: '2026-07-28', dia: 'Martes', orden: 2 },
  { local: 6, visit: 7, date: '2026-07-29', dia: 'Miércoles', orden: 1 },
  { local: 8, visit: 11, date: '2026-07-29', dia: 'Miércoles', orden: 2 },
  { local: 9, visit: 12, date: '2026-07-30', dia: 'Jueves', orden: 1 },
  { local: 10, visit: 1, date: '2026-07-30', dia: 'Jueves', orden: 2 },
  { local: 2, visit: 13, date: '2026-07-31', dia: 'Viernes', orden: 1 },
  { local: 3, visit: 4, date: '2026-07-31', dia: 'Viernes', orden: 2 },
  { local: 5, visit: 8, date: '2026-08-01', dia: 'Sábado', orden: 1 },
  { local: 6, visit: 9, date: '2026-08-01', dia: 'Sábado', orden: 2 },
  { local: 7, visit: 10, date: '2026-08-03', dia: 'Lunes', orden: 1 },
  { local: 11, visit: 12, date: '2026-08-03', dia: 'Lunes', orden: 2 },
  { local: 1, visit: 13, date: '2026-08-04', dia: 'Martes', orden: 1 },
  { local: 2, visit: 4, date: '2026-08-04', dia: 'Martes', orden: 2 },
  { local: 3, visit: 5, date: '2026-08-05', dia: 'Miércoles', orden: 1 },
  { local: 6, visit: 8, date: '2026-08-05', dia: 'Miércoles', orden: 2 },
  { local: 7, visit: 9, date: '2026-08-06', dia: 'Jueves', orden: 1 },
  { local: 10, visit: 11, date: '2026-08-06', dia: 'Jueves', orden: 2 },
  { local: 12, visit: 1, date: '2026-08-07', dia: 'Viernes', orden: 1 },
  { local: 2, visit: 3, date: '2026-08-07', dia: 'Viernes', orden: 2 },
  { local: 4, visit: 13, date: '2026-08-08', dia: 'Sábado', orden: 1 },
  { local: 5, visit: 6, date: '2026-08-08', dia: 'Sábado', orden: 2 },
  { local: 7, visit: 8, date: '2026-08-10', dia: 'Lunes', orden: 1 },
  { local: 9, visit: 10, date: '2026-08-10', dia: 'Lunes', orden: 2 },
  { local: 11, visit: 12, date: '2026-08-11', dia: 'Martes', orden: 1 },
  { local: 1, visit: 2, date: '2026-08-11', dia: 'Martes', orden: 2 },
  { local: 3, visit: 13, date: '2026-08-12', dia: 'Miércoles', orden: 1 },
  { local: 4, visit: 5, date: '2026-08-12', dia: 'Miércoles', orden: 2 },
  { local: 6, visit: 8, date: '2026-08-13', dia: 'Jueves', orden: 1 },
  { local: 7, visit: 9, date: '2026-08-13', dia: 'Jueves', orden: 2 },
  { local: 10, visit: 11, date: '2026-08-14', dia: 'Viernes', orden: 1 },
  { local: 12, visit: 1, date: '2026-08-14', dia: 'Viernes', orden: 2 },
  { local: 2, visit: 13, date: '2026-08-15', dia: 'Sábado', orden: 1 },
  { local: 3, visit: 4, date: '2026-08-15', dia: 'Sábado', orden: 2 },
]

export function getDb() {
  if (!db) {
    const url = process.env.NEXT_PUBLIC_TURSO_URL
    if (!url) throw new Error('Falta NEXT_PUBLIC_TURSO_URL en .env')
    db = createClient({
      url,
      authToken: process.env.NEXT_PUBLIC_TURSO_TOKEN || '',
    })
  }
  return db
}

export async function initSchema() {
  const client = getDb()
  const statements = SCHEMA.split(';').filter(s => s.trim())
  for (const stmt of statements) {
    await client.execute(stmt + ';')
  }
}

export async function ensureSeedData() {
  const client = getDb()
  const result = await client.execute('SELECT COUNT(*) as count FROM equipos')
  if ((result.rows[0] as any).count > 0) return

  for (const eq of EQUIPOS_SEED) {
    await client.execute({
      sql: 'INSERT INTO equipos (numero, nombre) VALUES (?, ?)',
      args: [eq.numero, eq.nombre],
    })
  }

  const equipos = await client.execute('SELECT id, numero FROM equipos')
  const eqMap = new Map<number, number>()
  for (const row of equipos.rows) {
    eqMap.set((row as any).numero, (row as any).id)
  }

  for (const m of SCHEDULE) {
    await client.execute({
      sql: 'INSERT INTO partidos (fecha, dia, orden, equipoLocalId, equipoVisitanteId) VALUES (?, ?, ?, ?, ?)',
      args: [m.date, m.dia, m.orden, eqMap.get(m.local)!, eqMap.get(m.visit)!],
    })
  }

  for (const ronda of ['cuartos_1', 'cuartos_2', 'semifinal_1', 'semifinal_2', 'final']) {
    await client.execute({
      sql: 'INSERT INTO playoffs (ronda, orden) VALUES (?, ?)',
      args: [ronda, 1],
    })
  }
}
