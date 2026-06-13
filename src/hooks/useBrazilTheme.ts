import { useMemo } from 'react'
import type { Game } from '../types'

export interface BrazilState {
  active: boolean
  game: Game | null
  isLive: boolean
  isVictory: boolean
  timeUntil: number | null
}

function isToday(timestamp: number): boolean {
  const now = new Date()
  const date = new Date(timestamp)
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

export function useBrazilTheme(games: Game[]): BrazilState {
  return useMemo(() => {
    const isDevOverride =
      import.meta.env.DEV &&
      typeof window !== 'undefined' &&
      localStorage.getItem('dev_brazil') !== null

    if (isDevOverride) {
      return {
        active: true,
        game: null,
        isLive: false,
        isVictory: false,
        timeUntil: null,
      }
    }

    const brazilGames = games.filter(
      (g) => g.homeTeam === 'Brasil' || g.awayTeam === 'Brasil' || g.homeTeam === 'Brazil' || g.awayTeam === 'Brazil'
    )

    if (brazilGames.length === 0) {
      return { active: false, game: null, isLive: false, isVictory: false, timeUntil: null }
    }

    const liveGame = brazilGames.find((g) => g.status === 'LIVE')
    const todayGame = brazilGames.find((g) => isToday(g.kickoff))
    const finishedGame = brazilGames.find((g) => g.status === 'FT')

    const isVictory =
      finishedGame !== undefined &&
      isToday(finishedGame.kickoff) &&
      (
        ((finishedGame.homeTeam === 'Brasil' || finishedGame.homeTeam === 'Brazil') &&
          (finishedGame.homeGoals ?? 0) > (finishedGame.awayGoals ?? 0)) ||
        ((finishedGame.awayTeam === 'Brasil' || finishedGame.awayTeam === 'Brazil') &&
          (finishedGame.awayGoals ?? 0) > (finishedGame.homeGoals ?? 0))
      )

    const game = (liveGame ?? todayGame ?? null)
    const isLive = liveGame !== undefined
    const timeUntil = todayGame ? todayGame.kickoff - Date.now() : null

    return {
      active: liveGame !== undefined || todayGame !== undefined,
      game,
      isLive,
      isVictory,
      timeUntil,
    }
  }, [games])
}
