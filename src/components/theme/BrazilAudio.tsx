import { useEffect, useRef, useState } from 'react'
import { useBrazilThemeContext } from '../../hooks/useBrazilThemeContext'
import { useAudio } from '../../hooks/useAudio'
import { Volume2, VolumeX } from 'lucide-react'

export function BrazilAudio() {
  const { active, showVictory } = useBrazilThemeContext()
  const { isPlaying, play, toggle, stop } = useAudio()
  const prevActive = useRef(false)
  const prevVictory = useRef(false)
  const [userMuted, setUserMuted] = useState(false)

  useEffect(() => {
    if (active && !prevActive.current) {
      play()
    }
    if (!active && prevActive.current) {
      stop()
      setUserMuted(false)
    }
    prevActive.current = active
  }, [active, play, stop])

  useEffect(() => {
    if (showVictory && !prevVictory.current) {
      if (!isPlaying) play()
    }
    prevVictory.current = showVictory
  }, [showVictory, isPlaying, play])

  useEffect(() => {
    const handler = () => {
      if (active && !isPlaying && !userMuted) {
        play()
      }
    }
    window.addEventListener('click', handler, { once: true })
    return () => window.removeEventListener('click', handler)
  }, [active, isPlaying, play, userMuted])

  useEffect(() => {
    return () => stop()
  }, [stop])

  const handleToggle = () => {
    if (isPlaying) setUserMuted(true)
    toggle()
  }

  if (!active) return null

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <button
        onClick={handleToggle}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all active:scale-95"
        title={isPlaying ? 'Desligar música' : 'Ligar música'}
      >
        {isPlaying ? (
          <Volume2 size={18} className="text-[#009739]" />
        ) : (
          <VolumeX size={18} className="text-gray-400" />
        )}
      </button>
    </div>
  )
}
