export type CompetitionResponse = {
  id: number
  name: string
  code: string
  emblem?: string
  currentSeason?: {
    startDate: string
    endDate: string
    currentMatchday?: number
  }
}

export type MatchesResponse = {
  competition?: { id: number; name: string; code?: string; emblem?: string }
  filters?: Record<string, unknown>
  resultSet?: { count: number; first?: string; last?: string; played?: number }
  matches: Match[]
}

export type Match = {
  id: number
  utcDate: string
  status: 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'SUSPENDED' | 'CANCELLED'
  matchday?: number | null
  stage?: string
  homeTeam: { id: number; name: string; shortName?: string; tla?: string; crest?: string }
  awayTeam: { id: number; name: string; shortName?: string; tla?: string; crest?: string }
  score?: {
    fullTime?: { home?: number | null; away?: number | null }
    halfTime?: { home?: number | null; away?: number | null }
    winner?: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null
  }
}

export type StandingsResponse = {
  competition?: { id: number; name: string; code?: string; emblem?: string }
  season?: { startDate?: string; endDate?: string; currentMatchday?: number }
  standings: StandingGroup[]
}

export type StandingGroup = {
  stage?: string
  type: 'TOTAL' | 'HOME' | 'AWAY'
  group?: string | null
  table: StandingRow[]
}

export type StandingRow = {
  position: number
  team: { id: number; name: string; shortName?: string; tla?: string; crest?: string }
  playedGames: number
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  form?: string | null
}

