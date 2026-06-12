import { useMemo, useState, useCallback } from 'react'
import type { Game, Prediction } from '../types'

export type FilterType = 'all' | 'today' | 'tomorrow' | 'week' | 'finished' | 'live' | 'open' | 'date' | 'mine'

export interface GroupedGames {
  dateKey: string
  dateLabel: string
  games: Game[]
}

function getDateKey(ts: number): string {
  return new Date(ts).toLocaleDateString('pt-BR')
}

function getISODate(ts: number): string {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function sameDay(a: number, b: number): boolean {
  return getDateKey(a) === getDateKey(b)
}

function isThisWeek(ts: number): boolean {
  const now = Date.now()
  const end = now + 7 * 86400000
  return ts >= now && ts <= end
}

export interface UseGameFiltersReturn {
  filter: FilterType
  customDate: string
  setFilter: (f: FilterType) => void
  setCustomDate: (d: string) => void
  prevDay: () => void
  nextDay: () => void
  filtered: Game[]
  grouped: GroupedGames[]
  counts: Record<FilterType, number>
}

export function useGameFilters(games: Game[], predictions: Record<string, Prediction> = {}): UseGameFiltersReturn {
  const [filter, setFilter] = useState<FilterType>('all')
  const [customDate, setCustomDate] = useState('')

  const counts = useMemo(() => {
    const now = Date.now()
    const c: Record<string, number> = {}
    for (const g of games) {
      if (g.status === 'FT') c.finished = (c.finished ?? 0) + 1
      if (g.status === 'LIVE') c.live = (c.live ?? 0) + 1
      if (g.status === 'NS') c.open = (c.open ?? 0) + 1
      if (sameDay(g.kickoff, now)) c.today = (c.today ?? 0) + 1
      if (sameDay(g.kickoff, now + 86400000)) c.tomorrow = (c.tomorrow ?? 0) + 1
      if (isThisWeek(g.kickoff)) c.week = (c.week ?? 0) + 1
      if (predictions[g.id]) c.mine = (c.mine ?? 0) + 1
    }
    return {
      all: games.length,
      today: c.today ?? 0,
      tomorrow: c.tomorrow ?? 0,
      week: c.week ?? 0,
      finished: c.finished ?? 0,
      live: c.live ?? 0,
      open: c.open ?? 0,
      mine: c.mine ?? 0,
      date: 0,
    } as Record<FilterType, number>
  }, [games, predictions])

  const filtered = useMemo(() => {
    const now = Date.now()
    switch (filter) {
      case 'today':
        return games.filter((g) => sameDay(g.kickoff, now))
      case 'tomorrow':
        return games.filter((g) => sameDay(g.kickoff, now + 86400000))
      case 'week':
        return games.filter((g) => isThisWeek(g.kickoff))
      case 'finished':
        return games.filter((g) => g.status === 'FT')
      case 'live':
        return games.filter((g) => g.status === 'LIVE')
      case 'open':
        return games.filter((g) => g.status === 'NS')
      case 'mine':
        return games.filter((g) => predictions[g.id] != null)
      case 'date':
        if (!customDate) return games
        return games.filter((g) => getISODate(g.kickoff) === customDate)
      default:
        return games
    }
  }, [games, filter, customDate, predictions])

  const grouped = useMemo(() => {
    const map = new Map<string, Game[]>()
    for (const g of filtered) {
      const dk = getDateKey(g.kickoff)
      const list = map.get(dk)
      if (list) list.push(g)
      else map.set(dk, [g])
    }
    const result: GroupedGames[] = []
    for (const [dateKey, gamesList] of map) {
      const [d, m, y] = dateKey.split('/')
      const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
      const dateLabel = `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}`
      result.push({ dateKey, dateLabel, games: gamesList })
    }
    result.sort((a, b) => {
      const [da, ma, ya] = a.dateKey.split('/')
      const [db, mb, yb] = b.dateKey.split('/')
      return new Date(+ya, +ma - 1, +da).getTime() - new Date(+yb, +mb - 1, +db).getTime()
    })
    return result
  }, [filtered, filter, predictions])

  const prevDay = useCallback(() => {
    if (!customDate) {
      const d = new Date()
      d.setDate(d.getDate() - 1)
      setCustomDate(getISODate(d.getTime()))
    } else {
      const d = new Date(customDate + 'T12:00:00')
      d.setDate(d.getDate() - 1)
      setCustomDate(getISODate(d.getTime()))
    }
    setFilter('date')
  }, [customDate])

  const nextDay = useCallback(() => {
    if (!customDate) {
      const d = new Date()
      d.setDate(d.getDate() + 1)
      setCustomDate(getISODate(d.getTime()))
    } else {
      const d = new Date(customDate + 'T12:00:00')
      d.setDate(d.getDate() + 1)
      setCustomDate(getISODate(d.getTime()))
    }
    setFilter('date')
  }, [customDate])

  return {
    filter,
    customDate,
    setFilter,
    setCustomDate,
    prevDay,
    nextDay,
    filtered,
    grouped,
    counts,
  }
}
