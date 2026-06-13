import { createContext, useState, useEffect, type ReactNode } from 'react'
import { useGames } from '../hooks/useGames'
import { useBrazilTheme, type BrazilState } from '../hooks/useBrazilTheme'
import type { Game } from '../types'

export interface BrazilThemeContextType extends BrazilState {
  showVictory: boolean
  dismissVictory: () => void
  selectedGame: Game | null
  setSelectedGame: (g: Game | null) => void
}

export const BrazilThemeContext = createContext<BrazilThemeContextType | null>(null)

export function BrazilThemeProvider({ children }: { children: ReactNode }) {
  const { games } = useGames()
  const brazil = useBrazilTheme(games)
  const [showVictory, setShowVictory] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)

  useEffect(() => {
    if (brazil.isVictory) {
      setShowVictory(true)
      const timer = setTimeout(() => setShowVictory(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [brazil.isVictory])

  const dismissVictory = () => setShowVictory(false)

  return (
    <BrazilThemeContext.Provider
      value={{ ...brazil, showVictory, dismissVictory, selectedGame, setSelectedGame }}
    >
      {children}
    </BrazilThemeContext.Provider>
  )
}
