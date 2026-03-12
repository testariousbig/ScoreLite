import { apiGet } from './apiClient'
import type { CompetitionResponse, MatchesResponse, StandingsResponse } from './footballDataTypes'

export const LALIGA_CODE = 'PD'

export function getCompetition() {
  return apiGet<CompetitionResponse>(`/competitions/${LALIGA_CODE}`)
}

export function getMatches(params?: { matchday?: number; dateFrom?: string; dateTo?: string }) {
  const qs = new URLSearchParams()
  if (params?.matchday) qs.set('matchday', String(params.matchday))
  if (params?.dateFrom) qs.set('dateFrom', params.dateFrom)
  if (params?.dateTo) qs.set('dateTo', params.dateTo)
  const suffix = qs.size ? `?${qs.toString()}` : ''
  return apiGet<MatchesResponse>(`/competitions/${LALIGA_CODE}/matches${suffix}`)
}

export function getStandings() {
  return apiGet<StandingsResponse>(`/competitions/${LALIGA_CODE}/standings`)
}

