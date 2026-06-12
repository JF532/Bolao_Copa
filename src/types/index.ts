export type GameStatus = 'NS' | 'LIVE' | 'FT'

export interface Game {
  id: string
  homeTeam: string
  awayTeam: string
  kickoff: number
  status: GameStatus
  homeGoals: number | null
  awayGoals: number | null
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
