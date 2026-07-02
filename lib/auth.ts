'use client'

const SESSION_KEY = 'liga2026_admin_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24h

function getAdminPassword(): string {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return process.env.NEXT_PUBLIC_ADMIN_PASSWORD
  }
  return 'admin2026'
}

export function checkPassword(password: string): boolean {
  return password === getAdminPassword()
}

export function login(password: string): boolean {
  if (!checkPassword(password)) return false
  const session = {
    authenticated: true,
    timestamp: Date.now(),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  window.dispatchEvent(new Event('auth-change'))
  return true
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
  window.dispatchEvent(new Event('auth-change'))
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return false
  try {
    const session = JSON.parse(raw)
    if (!session.authenticated) return false
    if (Date.now() - session.timestamp > SESSION_DURATION) {
      localStorage.removeItem(SESSION_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}
