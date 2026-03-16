import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

const FAVORITE_TEAM_KEY = 'favoriteTeam'

interface FavoriteTeamContextType {
  favoriteTeamId: number | null
  setFavoriteTeam: (teamId: number | null) => void
  toggleFavoriteTeam: (teamId: number) => void
  isFavoriteTeam: (teamId: number) => boolean
}

const FavoriteTeamContext = createContext<FavoriteTeamContextType | undefined>(undefined)

export function FavoriteTeamProvider({ children }: { children: ReactNode }) {
  const [favoriteTeamId, setFavoriteTeamId] = useState<number | null>(null)

  // Cargar desde localStorage al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITE_TEAM_KEY)
      if (stored) {
        const teamId = parseInt(stored, 10)
        if (!Number.isNaN(teamId)) {
          setFavoriteTeamId(teamId)
        }
      }
    } catch (error) {
      console.warn('Error loading favorite team from localStorage:', error)
    }
  }, [])

  // Guardar en localStorage cuando cambia
  const setFavoriteTeam = (teamId: number | null) => {
    setFavoriteTeamId(teamId)
    try {
      if (teamId === null) {
        localStorage.removeItem(FAVORITE_TEAM_KEY)
      } else {
        localStorage.setItem(FAVORITE_TEAM_KEY, teamId.toString())
      }
    } catch (error) {
      console.warn('Error saving favorite team to localStorage:', error)
    }
  }

  const toggleFavoriteTeam = (teamId: number) => {
    setFavoriteTeam(teamId === favoriteTeamId ? null : teamId)
  }

  const isFavoriteTeam = (teamId: number) => {
    return teamId === favoriteTeamId
  }

  return (
    <FavoriteTeamContext.Provider
      value={{
        favoriteTeamId,
        setFavoriteTeam,
        toggleFavoriteTeam,
        isFavoriteTeam,
      }}
    >
      {children}
    </FavoriteTeamContext.Provider>
  )
}

export function useFavoriteTeam() {
  const context = useContext(FavoriteTeamContext)
  if (context === undefined) {
    throw new Error('useFavoriteTeam must be used within a FavoriteTeamProvider')
  }
  return context
}
