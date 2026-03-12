import { useQuery } from '@tanstack/react-query'
import { getStandings } from '../lib/footballDataApi'
import { Card } from '../components/ui/Card'
import { Table } from '../components/ui/Table'
import { Spinner } from '../components/ui/Spinner'

export function StandingsPage() {
  const standingsQuery = useQuery({
    queryKey: ['standings', 'PD'],
    queryFn: getStandings,
    staleTime: 1000 * 60 * 2,
  })

  const total = standingsQuery.data?.standings?.find((s) => s.type === 'TOTAL')

  return (
    <section className="space-y-4">
      <Card>
        <div className="text-xl font-semibold tracking-tight">LaLiga · Clasificación</div>
      </Card>

      {standingsQuery.isLoading && (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      )}

      {standingsQuery.isError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm">
          No se pudo cargar la clasificación. Revisa el token y el límite de peticiones.
        </div>
      )}

      {standingsQuery.isSuccess && !total && (
        <div className="text-sm text-slate-300">No hay tabla disponible.</div>
      )}

      {standingsQuery.isSuccess && total && (
        <Table>
          <thead className="sticky top-0 bg-slate-950/70 backdrop-blur">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Equipo</th>
              <th className="px-4 py-3 text-right">PJ</th>
              <th className="px-4 py-3 text-right">G</th>
              <th className="px-4 py-3 text-right">E</th>
              <th className="px-4 py-3 text-right">P</th>
              <th className="px-4 py-3 text-right">DG</th>
              <th className="px-4 py-3 text-right">Pts</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {total.table.map((row) => (
              <tr key={row.team.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 tabular-nums text-slate-200">{row.position}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {row.team.crest && (
                      <img
                        src={row.team.crest}
                        alt={row.team.name}
                        className="h-7 w-7 shrink-0 rounded-full border border-white/20 bg-slate-900 object-contain"
                      />
                    )}
                    <span className="font-semibold text-white">
                      {row.team.shortName ?? row.team.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-200">{row.playedGames}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-200">{row.won}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-200">{row.draw}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-200">{row.lost}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-200">{row.goalDifference}</td>
                <td className="px-4 py-3 text-right font-extrabold tabular-nums text-white">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </section>
  )
}

