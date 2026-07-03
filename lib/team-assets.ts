function getBase(): string {
  if (typeof document === 'undefined') return ''
  return document.documentElement.getAttribute('data-basepath') || ''
}

export function getTeamLogo(numero: number): string {
  return `${getBase()}/assets/logos/${numero}.svg`
}

export function getTeamLogoPng(numero: number): string {
  return `${getBase()}/assets/logos/${numero}.png`
}
