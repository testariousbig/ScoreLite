import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCompetition, getMatches } from '../lib/footballDataApi'
import type { Match } from '../lib/footballDataTypes'
import { formatKickoff } from '../lib/format'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'

export function MatchesPage() {
  const competitionQuery = useQuery({
    queryKey: ['competition', 'PD'],
    queryFn: getCompetition,
    staleTime: 1000 * 60 * 10,
  })

  const [matchday, setMatchday] = useState<number | null>(null)

  const effectiveMatchday = competitionQuery.data?.currentSeason?.currentMatchday
    ? Math.min(matchday ?? competitionQuery.data.currentSeason.currentMatchday, competitionQuery.data.currentSeason.currentMatchday)
    : matchday ?? 1

  const matchesQuery = useQuery({
    queryKey: ['matches', 'PD', { matchday: effectiveMatchday }],
    queryFn: () => getMatches({ matchday: effectiveMatchday }),
    enabled: competitionQuery.isSuccess,
    staleTime: 1000 * 60,
  })

  const matchdayMax = competitionQuery.data?.currentSeason?.currentMatchday ?? 38
  const matchesByDate = useMemo(() => groupMatchesByLocalDate(matchesQuery.data?.matches ?? []), [matchesQuery.data])

  return (
    <section className="space-y-4">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Partidos</h1>
          <div className="mt-1 text-sm text-slate-300">
            {competitionQuery.isLoading && (
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" />
                <span>Cargando competición…</span>
              </span>
            )}
            {competitionQuery.isError && 'Error cargando competición'}
            {competitionQuery.isSuccess && `${competitionQuery.data.name} (${competitionQuery.data.code})`}
          </div>
        </div>

        <div className="flex justify-center items-center gap-2">
          <label className="text-sm text-slate-300" htmlFor="matchday">
            Jornada
          </label>
          <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-1 py-1">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() =>
                setMatchday((prev) => {
                  const base = (prev ?? effectiveMatchday) - 1
                  return base < 1 ? 1 : base
                })
              }
              disabled={effectiveMatchday <= 1}
            >
              ‹
            </button>
            <input
              id="matchday"
              className="w-12 border-none bg-transparent text-center text-sm text-white outline-none"
              type="number"
              min={1}
              max={matchdayMax}
              value={effectiveMatchday}
              onChange={(e) => {
                const v = Number(e.target.value)
                if (Number.isNaN(v)) return
                const clamped = Math.min(Math.max(1, v), matchdayMax)
                setMatchday(clamped)
              }}
            />
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() =>
                setMatchday((prev) => {
                  const base = (prev ?? effectiveMatchday) + 1
                  return base > matchdayMax ? matchdayMax : base
                })
              }
              disabled={effectiveMatchday >= matchdayMax}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {competitionQuery.isError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm">
          No se pudo cargar la competición. Revisa el token y el límite de peticiones.
        </div>
      )}

      {competitionQuery.isSuccess && matchesQuery.isLoading && (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      )}

      {matchesQuery.isError && (
        <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm">
          No se pudieron cargar los partidos de la jornada {effectiveMatchday}.
        </div>
      )}

      {matchesQuery.isSuccess && matchesQuery.data.matches.length === 0 && (
        <div className="text-sm text-slate-300">No hay partidos para esta jornada.</div>
      )}

      {matchesQuery.isSuccess && matchesQuery.data.matches.length > 0 && (
        <div className="grid gap-4">
          {matchesByDate.map(([dateLabel, ms]) => (
            <Card key={dateLabel}>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-100">{dateLabel}</div>
                <div className="text-xs text-slate-400">
                  {ms.length} partido{ms.length !== 1 ? 's' : ''}
                </div>
              </div>
              <ul className="divide-y divide-white/10">
                {ms.map((m) => (
                  <li
                    key={m.id}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3 max-[680px]:grid-cols-[auto_minmax(0,1fr)] max-[680px]:gap-y-2"
                  >
                    <div className="text-sm tabular-nums text-slate-300">
                      {formatKickoff(m.utcDate).time}
                    </div>
                    <div className="min-w-0">
                      <div className="w-1/2 mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-lg">
                        {/* Local alineado a la izquierda */}
                        <div className="flex min-w-0 items-center justify-start gap-1.5">
                          {m.homeTeam.crest && (
                            <img
                              src={m.homeTeam.crest}
                              alt={m.homeTeam.name}
                              className="h-5 w-5 shrink-0 rounded-full border border-white/20 bg-slate-900 object-contain"
                            />
                          )}
                          <span
                            className={`truncate text-left ${
                              getOutcome(m) === 'home'
                                ? 'font-semibold text-emerald-300'
                                : getOutcome(m) === 'away'
                                  ? 'text-slate-400'
                                  : 'font-semibold text-slate-100'
                            }`}
                          >
                            {m.homeTeam.shortName ?? m.homeTeam.name}
                          </span>
                        </div>

                        {/* Marcador centrado */}
                        <div className="flex items-center justify-center gap-2 tabular-nums">
                          {renderScore(m)}
                        </div>

                        {/* Visitante alineado a la derecha */}
                        <div className="flex min-w-0 items-center justify-end gap-1.5">
                          <span
                            className={`truncate text-right ${
                              getOutcome(m) === 'away'
                                ? 'font-semibold text-emerald-300'
                                : getOutcome(m) === 'home'
                                  ? 'text-slate-400'
                                  : 'font-semibold text-slate-100'
                            }`}
                          >
                            {m.awayTeam.shortName ?? m.awayTeam.name}
                          </span>
                          {m.awayTeam.crest && (
                            <img
                              src={m.awayTeam.crest}
                              alt={m.awayTeam.name}
                              className="h-5 w-5 shrink-0 rounded-full border border-white/20 bg-slate-900 object-contain"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end max-[680px]:col-span-2">
                      <StatusBadge status={m.status} />
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}

function StatusBadge({ status }: { status: Match['status'] }) {
  switch (status) {
    case 'IN_PLAY':
    case 'PAUSED':
      return <Badge variant="live">En juego</Badge>
    case 'FINISHED':
      return <Badge variant="finished">Finalizado</Badge>
    case 'SCHEDULED':
    case 'TIMED':
      return <Badge variant="muted">Programado</Badge>
    case 'POSTPONED':
      return <Badge variant="muted">Aplazado</Badge>
    case 'SUSPENDED':
      return <Badge variant="muted">Suspendido</Badge>
    case 'CANCELLED':
      return <Badge variant="muted">Cancelado</Badge>
    default:
      return <Badge variant="muted">{status}</Badge>
  }
}

function renderScore(m: Match) {
  const ft = m.score?.fullTime
  const home = ft?.home
  const away = ft?.away

  if (m.status !== 'FINISHED' || home == null || away == null) {
    return <span className="text-slate-300">-</span>
  }

  let homeClass = 'font-semibold'
  let awayClass = 'font-semibold'

  if (home > away) {
    homeClass += ' text-emerald-300'
    awayClass += ' text-slate-300'
  } else if (away > home) {
    awayClass += ' text-emerald-300'
    homeClass += ' text-slate-300'
  } else {
    homeClass += ' text-slate-100'
    awayClass += ' text-slate-100'
  }

  return (
    <>
      <span className={homeClass}>{home}</span>
      <span className="text-slate-400">-</span>
      <span className={awayClass}>{away}</span>
    </>
  )
}

function getOutcome(m: Match): 'home' | 'away' | 'draw' | null {
  const ft = m.score?.fullTime
  const home = ft?.home
  const away = ft?.away

  if (m.status !== 'FINISHED' || home == null || away == null) return null
  if (home > away) return 'home'
  if (away > home) return 'away'
  return 'draw'
}

function groupMatchesByLocalDate(matches: Match[]) {
  const map = new Map<number, { label: string; matches: Match[] }>()

  for (const m of matches) {
    const dt = new Date(m.utcDate)
    const dayStart = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime()
    const label = formatKickoff(m.utcDate).date

    const bucket = map.get(dayStart) ?? { label, matches: [] }
    bucket.matches.push(m)
    map.set(dayStart, bucket)
  }

  const entries = Array.from(map.entries()).sort((a, b) => a[0] - b[0])
  return entries.map(([, v]) => {
    v.matches.sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
    return [v.label, v.matches] as const
  })
}

