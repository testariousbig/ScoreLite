import { useQuery } from '@tanstack/react-query'
import { getScorers, getCompetition } from '../lib/footballDataApi'
import { useFavoriteTeam } from '../hooks/useFavoriteTeam'
import { Card } from '../components/ui/Card'
import { Table } from '../components/ui/Table'
import { Spinner } from '../components/ui/Spinner'

export function StatisticsPage() {
  const { isFavoriteTeam } = useFavoriteTeam()

  const competitionQuery = useQuery({
    queryKey: ['competition', 'PD'],
    queryFn: getCompetition,
    staleTime: 1000 * 60 * 10,
  })

  const scorersQuery = useQuery({
    queryKey: ['scorers', 'PD'],
    queryFn: getScorers,
    staleTime: 1000 * 60 * 5,
  })

  return (
    <section className="space-y-4">
      <Card>
        <div className="text-xl font-semibold tracking-tight">
          {competitionQuery.isLoading && (
            <span className="inline-flex items-center gap-2">
              <Spinner size="sm" />
              <span>Cargando competición…</span>
            </span>
          )}
          {competitionQuery.isError && 'Error cargando competición'}
          {competitionQuery.isSuccess && `${competitionQuery.data.name} · Estadísticas`}
        </div>
      </Card>

      {scorersQuery.isLoading && (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      )}

      {scorersQuery.isError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm">
          No se pudieron cargar las estadísticas. Revisa el token y el límite de peticiones.
        </div>
      )}

      {scorersQuery.isSuccess && scorersQuery.data.scorers.length === 0 && (
        <div className="text-sm text-slate-300">No hay estadísticas disponibles.</div>
      )}

      {scorersQuery.isSuccess && scorersQuery.data.scorers.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-300">
              {scorersQuery.data.scorers[0]?.goals || 0}
            </div>
            <div className="text-sm text-slate-400 mt-1">
              Máximo goleador
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {scorersQuery.data.scorers[0]?.player.name || 'N/A'}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-300">
              {scorersQuery.data.scorers[1]?.goals || 0}
            </div>
            <div className="text-sm text-slate-400 mt-1">
              Segundo goleador
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {scorersQuery.data.scorers[1]?.player.name || 'N/A'}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-300">
              {scorersQuery.data.scorers[2]?.goals || 0}
            </div>
            <div className="text-sm text-slate-400 mt-1">
              Tercer goleador
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {scorersQuery.data.scorers[2]?.player.name || 'N/A'}
            </div>
          </div>
        </Card>
      </div>
      )}

      {scorersQuery.isSuccess && scorersQuery.data.scorers.length > 0 && (
        <div className="space-y-6">
          {/* Máximos Goleadores */}
          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">Máximos Goleadores</h2>
              <p className="text-sm text-slate-400 mt-1">
                Temporada {competitionQuery.data?.currentSeason?.startDate?.split('-')[0] || '2024'}-{(competitionQuery.data?.currentSeason?.endDate?.split('-')[0] || '2025').slice(-2)}
              </p>
            </div>
            <Table>
              <thead className="sticky top-0 bg-slate-950/70 backdrop-blur">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Jugador</th>
                  <th className="px-4 py-3">Equipo</th>
                  <th className="px-4 py-3 text-right">PJ</th>
                  <th className="px-4 py-3 text-right">Goles</th>
                  <th className="px-4 py-3 text-right">Asist.</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {scorersQuery.data.scorers.map((scorer, index) => (
                  <tr 
                    key={`scorer-${scorer.id || index}-${scorer.player.id || index}`} 
                    className={`border-t border-white/10 hover:bg-white/5 transition-colors ${
                      isFavoriteTeam(scorer.team.id)
                        ? 'bg-yellow-400/5'
                        : ''
                    }`}
                  >
                    <td className="px-4 py-3 tabular-nums text-slate-200 font-semibold">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-semibold text-white">
                            {scorer.player.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {scorer.player.nationality || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {scorer.team.crest && (
                          <img
                            src={scorer.team.crest}
                            alt={scorer.team.name}
                            className="h-5 w-5 shrink-0 rounded-full border border-white/20 bg-slate-900 object-contain"
                          />
                        )}
                        <span className={`text-sm ${
                          isFavoriteTeam(scorer.team.id) ? 'text-yellow-300 font-semibold' : 'text-slate-200'
                        }`}>
                          {scorer.team.shortName ?? scorer.team.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-200">
                      {scorer.playedMatches}
                    </td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums text-emerald-300">
                      {scorer.goals}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-200">
                      {scorer.assists || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </div>
      )}
    </section>
  )
}
