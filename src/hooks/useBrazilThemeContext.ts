import { useContext } from 'react'
import { BrazilThemeContext } from '../contexts/BrazilThemeContext'

export function useBrazilThemeContext() {
  const ctx = useContext(BrazilThemeContext)
  if (!ctx) throw new Error('useBrazilThemeContext must be used inside BrazilThemeProvider')
  return ctx
}
