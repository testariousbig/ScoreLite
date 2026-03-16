import { useState, useEffect } from 'react'

const FAVORITE_TEAM_KEY = 'favoriteTeam'

export function useFavoriteTeam() {
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

  return {
    favoriteTeamId,
    setFavoriteTeam,
    toggleFavoriteTeam,
    isFavoriteTeam,
  }
}
