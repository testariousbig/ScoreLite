import { useQuery } from '@tanstack/react-query'
import { getStandings } from '../lib/footballDataApi'
import { useFavoriteTeam } from '../hooks/useFavoriteTeam'

interface TeamSelectorProps {
  className?: string
}

export function TeamSelector({ className = '' }: TeamSelectorProps) {
  const { favoriteTeamId, setFavoriteTeam } = useFavoriteTeam()

  const standingsQuery = useQuery({
    queryKey: ['standings', 'PD'],
    queryFn: getStandings,
    staleTime: 1000 * 60 * 30, // 30 minutos
  })

  const teams = standingsQuery.data?.standings[0]?.table ?? []

  const selectedTeam = teams.find(team => team.team.id === favoriteTeamId)

  const handleTeamSelect = (teamId: string) => {
    const id = parseInt(teamId, 10)
    setFavoriteTeam(Number.isNaN(id) ? null : id)
  }

  if (standingsQuery.isLoading) {
    return (
      <div className={`bg-slate-900/50 rounded-xl p-6 border border-white/10 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded mb-4"></div>
          <div className="h-10 bg-slate-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (standingsQuery.isError) {
    return (
      <div className={`bg-red-900/20 border border-red-500/30 rounded-xl p-4 ${className}`}>
        <p className="text-red-400 text-sm">Error al cargar los equipos</p>
      </div>
    )
  }

  return (
    <div className={`bg-slate-900/50 rounded-xl p-6 border border-white/10 ${className}`}>
      <h3 className="text-xl font-semibold text-white mb-4">Equipo Favorito</h3>
      
      <div className="relative">
        <select
          value={favoriteTeamId?.toString() || ''}
          onChange={(e) => handleTeamSelect(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition appearance-none cursor-pointer"
        >
          <option value="">Selecciona tu equipo favorito</option>
          {teams.map((team) => (
            <option key={team.team.id} value={team.team.id.toString()}>
              {team.position} - {team.team.name}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {selectedTeam && (
        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-white/5 mt-3">
          {selectedTeam.team.crest && (
            <img
              src={selectedTeam.team.crest}
              alt={selectedTeam.team.name}
              className="h-8 w-8 shrink-0"
            />
          )}
          <div className="flex-1">
            <div className="text-white font-medium">{selectedTeam.team.name}</div>
            <div className="text-slate-400 text-sm">
              Posición: {selectedTeam.position} • Puntos: {selectedTeam.points}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
