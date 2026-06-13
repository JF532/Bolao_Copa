import { useState, useEffect } from 'react'
import type { Game } from '../../types'

interface BrazilCountdownProps {
  game: Game
}

export function BrazilCountdown({ game }: BrazilCountdownProps) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (game.status === 'LIVE') {
    return (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
          Brasil ao vivo
        </span>
      </div>
    )
  }

  if (game.status === 'FT') {
    const isVictory =
      ((game.homeTeam === 'Brasil' || game.homeTeam === 'Brazil') && (game.homeGoals ?? 0) > (game.awayGoals ?? 0)) ||
      ((game.awayTeam === 'Brasil' || game.awayTeam === 'Brazil') && (game.awayGoals ?? 0) > (game.homeGoals ?? 0))

    if (isVictory) {
      return (
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
          🎉 Vitória do Brasil!
        </span>
      )
    }
    return null
  }

  const diffMs = game.kickoff - now
  if (diffMs < 0) return null

  const totalSeconds = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60

  const pad = (n: number) => n.toString().padStart(2, '0')

  if (days >= 2) return null

  if (days === 1) {
    return (
      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
        📅 1d {pad(hours)}:{pad(minutes)}:{pad(secs)}
      </span>
    )
  }

  const gameDate = new Date(game.kickoff)
  const nowDate = new Date(now)
  const isToday = gameDate.getDate() === nowDate.getDate() &&
    gameDate.getMonth() === nowDate.getMonth() &&
    gameDate.getFullYear() === nowDate.getFullYear()

  if (isToday) {
    const isUrgent = hours < 3
    return (
      <span className={`text-xs font-bold text-[#009739] dark:text-[#4ade80]${isUrgent ? ' animate-pulse' : ''}`}>
        🇧🇷 Hoje! {pad(hours)}:{pad(minutes)}:{pad(secs)}
      </span>
    )
  }

  return (
    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
      🔥 Amanhã! {pad(hours)}:{pad(minutes)}:{pad(secs)}
    </span>
  )
}
