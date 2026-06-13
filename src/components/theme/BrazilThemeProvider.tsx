import { useEffect, useRef, useState } from 'react'
import { useBrazilThemeContext } from '../../hooks/useBrazilThemeContext'
import { BrazilBackground } from './BrazilBackground'
import { BrazilAudio } from './BrazilAudio'

const COLORS = ['#0a7e3c', '#d4a843', '#1a3a6b', '#ffffff']

interface Confetti {
  id: number
  x: number
  color: string
  delay: number
  size: number
}

export function BrazilThemeProvider() {
  const { active, showVictory } = useBrazilThemeContext()
  const [confetti, setConfetti] = useState<Confetti[]>([])
  const prevActive = useRef(false)

  useEffect(() => {
    const root = document.documentElement
    if (active) {
      root.classList.add('brazil-active')
    } else {
      root.classList.remove('brazil-active')
    }
    return () => root.classList.remove('brazil-active')
  }, [active])

  useEffect(() => {
    if (active && !prevActive.current) {
      const items: Confetti[] = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        size: 5 + Math.random() * 6,
      }))
      setConfetti(items)
      const timer = setTimeout(() => setConfetti([]), 3500)
      prevActive.current = true
      return () => clearTimeout(timer)
    }
    if (!active) {
      prevActive.current = false
      setConfetti([])
    }
  }, [active])

  return (
    <>
      <BrazilAudio />
      <BrazilBackground />
      {confetti.map((c) => (
        <div
          key={c.id}
          className="pointer-events-none fixed top-0 z-50"
          style={{
            left: `${c.x}%`,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            borderRadius: c.size > 7 ? '50%' : '2px',
            animation: `brazilConfetti 3s ease-out ${c.delay}s forwards`,
          }}
        />
      ))}

      {showVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl px-8 py-6 shadow-2xl border border-[#009739]/30 animate-fade-in">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="text-5xl">🎉🇧🇷🎉</span>
              <p className="text-2xl font-bold text-[#009739] dark:text-[#4ade80]">Vitória do Brasil!</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mais uma da seleção canarinho</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
