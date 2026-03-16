import { useState, useEffect } from 'react'
import { useFavoriteTeam } from '../hooks/useFavoriteTeam'
import { getTeamMatches } from '../lib/footballDataApi'
import type { Match } from '../lib/footballDataTypes'
import { formatKickoff } from '../lib/format'

interface FavoriteTeamSummaryProps {
  className?: string
}

export function FavoriteTeamSummary({ className = '' }: FavoriteTeamSummaryProps) {
  const { favoriteTeamId } = useFavoriteTeam()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!favoriteTeamId) return

    const fetchTeamMatches = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Obtener partidos de los últimos 2 meses y próximos 2 meses
        const today = new Date()
        const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate())
        const twoMonthsLater = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate())
        
        const dateFrom = twoMonthsAgo.toISOString().split('T')[0]
        const dateTo = twoMonthsLater.toISOString().split('T')[0]

        const response = await getTeamMatches(favoriteTeamId, { 
          dateFrom, 
          dateTo,
          limit: 20 // Limitar para obtener suficientes partidos
        })
        
        setMatches(response.matches)
      } catch (err) {
        setError('Error al cargar los partidos del equipo')
        console.error('Error fetching team matches:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMatches()
  }, [favoriteTeamId])

  if (!favoriteTeamId) {
    return null
  }

  if (loading) {
    return (
      <div className={`bg-slate-900/50 rounded-xl p-6 border border-white/10 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-red-900/20 border border-red-500/30 rounded-xl p-4 ${className}`}>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  // Separar partidos pasados y futuros
  const now = new Date()
  const pastMatches = matches
    .filter(match => new Date(match.utcDate) < now && match.status === 'FINISHED')
    .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
    .slice(0, 5)

  const upcomingMatches = matches
    .filter(match => new Date(match.utcDate) > now && match.status !== 'FINISHED')
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
    .slice(0, 3)

  const getOutcome = (match: Match): 'home' | 'away' | 'draw' | null => {
    const ft = match.score?.fullTime
    const home = ft?.home
    const away = ft?.away

    if (match.status !== 'FINISHED' || home == null || away == null) return null
    if (home > away) return 'home'
    if (away > home) return 'away'
    return 'draw'
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

  return (
    <div className={`bg-slate-900/50 rounded-xl p-6 border border-white/10 ${className}`}>
      <h3 className="text-xl font-semibold text-white mb-6">Resumen de tu equipo favorito</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Últimos 5 partidos */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            Últimos 5 partidos
          </h4>
          <div className="space-y-2">
            {pastMatches.length > 0 ? (
              pastMatches.map((match) => {
                return (
                  <div key={match.id} className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
                    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6">
                      <div className="text-sm tabular-nums text-slate-300">
                        {formatKickoff(match.utcDate).date} - {formatKickoff(match.utcDate).time}
                      </div>
                      <div className="min-w-0">
                        <div className="w-full mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-lg">
                          {/* Local alineado a la izquierda */}
                          <div className="flex min-w-0 items-center justify-start gap-1.5">
                            {match.homeTeam.crest && (
                              <img
                                src={match.homeTeam.crest}
                                alt={match.homeTeam.name}
                                className="h-7 w-7 shrink-0"
                              />
                            )}
                            <span
                              className={`truncate text-left ${
                                getOutcome(match) === 'home'
                                  ? 'font-semibold text-emerald-300'
                                  : getOutcome(match) === 'away'
                                    ? 'text-slate-400'
                                    : 'font-semibold text-slate-100'
                              }`}
                            >
                              {match.homeTeam.tla}
                            </span>
                          </div>

                          {/* Marcador centrado */}
                          <div className="flex items-center justify-center gap-2 tabular-nums">
                            {renderScore(match)}
                          </div>

                          {/* Visitante alineado a la derecha */}
                          <div className="flex min-w-0 items-center justify-end gap-1.5">
                            <span
                              className={`truncate text-right ${
                                getOutcome(match) === 'away'
                                  ? 'font-semibold text-emerald-300'
                                  : getOutcome(match) === 'home'
                                    ? 'text-slate-400'
                                    : 'font-semibold text-slate-100'
                              }`}
                            >
                              {match.awayTeam.tla}
                            </span>
                            {match.awayTeam.crest && (
                              <img
                                src={match.awayTeam.crest}
                                alt={match.awayTeam.name}
                                className="h-7 w-7 shrink-0"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-slate-400 text-sm">No hay partidos recientes</p>
            )}
          </div>
        </div>

        {/* Próximos 3 partidos */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
            Próximos 3 partidos
          </h4>
          <div className="space-y-2">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((match) => {
                return (
                  <div key={match.id} className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
                    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6">
                      <div className="text-sm tabular-nums text-slate-300">
                        {formatKickoff(match.utcDate).date} - {formatKickoff(match.utcDate).time}
                      </div>
                      <div className="min-w-0">
                        <div className="w-3/4 mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-lg">
                          {/* Local alineado a la izquierda */}
                          <div className="flex min-w-0 items-center justify-start gap-1.5">
                            {match.homeTeam.crest && (
                              <img
                                src={match.homeTeam.crest}
                                alt={match.homeTeam.name}
                                className="h-7 w-7 shrink-0"
                              />
                            )}
                            <span className="truncate text-left font-semibold text-slate-100">
                              {match.homeTeam.tla}
                            </span>
                          </div>

                          {/* Marcador centrado */}
                          <div className="flex items-center justify-center gap-2 tabular-nums">
                            <span className="text-slate-300">-</span>
                          </div>

                          {/* Visitante alineado a la derecha */}
                          <div className="flex min-w-0 items-center justify-end gap-1.5">
                            <span className="truncate text-right font-semibold text-slate-100">
                              {match.awayTeam.tla}
                            </span>
                            {match.awayTeam.crest && (
                              <img
                                src={match.awayTeam.crest}
                                alt={match.awayTeam.name}
                                className="h-7 w-7 shrink-0"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-slate-400 text-sm">No hay próximos partidos programados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
