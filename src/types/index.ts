export type GameStatus = 'NS' | 'LIVE' | 'FT'
export type GameDuration = 'REGULAR' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT'

export interface Game {
  id: string
  homeTeam: string
  awayTeam: string
  kickoff: number
  status: GameStatus
  homeGoals: number | null
  awayGoals: number | null
  stage: string
  duration: GameDuration
  extraTimeHome: number | null
  extraTimeAway: number | null
  penaltiesHome: number | null
  penaltiesAway: number | null
}

export interface Prediction {
  id: string
  userId: string
  gameId: string
  homeGoals: number
  awayGoals: number
  points: number | null
  createdAt: number
}

export interface UserData {
  id: string
  name: string
  email: string
  createdAt: number
  points?: number
  predictionPoints?: number
  manualPoints?: number
  active?: boolean
}

export interface UserRanking {
  userId: string
  name: string
  totalScore: number
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}
