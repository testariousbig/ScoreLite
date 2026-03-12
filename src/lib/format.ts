export function formatKickoff(utcIso: string) {
  const dt = new Date(utcIso)
  const date = new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(dt)
  const time = new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dt)
  return { date, time }
}

export function formatScore(score?: { home?: number | null; away?: number | null }) {
  const home = score?.home
  const away = score?.away
  if (home == null || away == null) return '—'
  return `${home} - ${away}`
}

