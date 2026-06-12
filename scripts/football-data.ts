const API_BASE = 'https://api.football-data.org/v4'

export type FDStatus = 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'FINISHED'
export type GameStatus = 'NS' | 'LIVE' | 'FT'

export interface FDTeam {
  name: string
}

export interface FDScore {
  fullTime: {
    home: number | null
    away: number | null
  }
}

export interface FDMatch {
  id: number
  utcDate: string
  status: FDStatus
  homeTeam: FDTeam
  awayTeam: FDTeam
  score: FDScore
}

export interface FDMatchesResponse {
  matches: FDMatch[]
}

export function mapStatus(status: FDStatus): GameStatus {
  switch (status) {
    case 'IN_PLAY':
    case 'PAUSED':
      return 'LIVE'
    case 'FINISHED':
      return 'FT'
    default:
      return 'NS'
  }
}

async function fetchFromAPI(endpoint: string) {
  const token = process.env.FOOTBALL_DATA_TOKEN

  if (!token) {
    throw new Error('FOOTBALL_DATA_TOKEN environment variable is required.')
  }

  const res = await fetch(`${API_BASE}/${endpoint}`, {
    headers: { 'X-Auth-Token': token },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Football-Data API error: ${res.status} ${res.statusText} — ${body}`)
  }

  return res.json()
}

export async function getWorldCupMatches(): Promise<FDMatchesResponse> {
  return fetchFromAPI('competitions/WC/matches') as Promise<FDMatchesResponse>
}

export async function getFinishedWorldCupMatches(): Promise<FDMatchesResponse> {
  return fetchFromAPI('competitions/WC/matches?status=FINISHED') as Promise<FDMatchesResponse>
}

export async function getScheduledWorldCupMatches(): Promise<FDMatchesResponse> {
  return fetchFromAPI('competitions/WC/matches?status=SCHEDULED') as Promise<FDMatchesResponse>
}

export async function getCompetition(): Promise<unknown> {
  return fetchFromAPI('competitions/WC')
}
