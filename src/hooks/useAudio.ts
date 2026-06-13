import { useCallback, useEffect, useRef, useState } from 'react'

const SRC = '/sounds/brazil-theme.mp3'
const START_OFFSET = 2

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(SRC)
      audio.loop = true
      audio.currentTime = START_OFFSET
      audio.preload = 'auto'
      audioRef.current = audio
    }

    const audio = audioRef.current

    const onEnd = () => setIsPlaying(false)
    const onPause = () => setIsPlaying(false)
    const onPlay = () => setIsPlaying(true)

    audio.addEventListener('ended', onEnd)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('play', onPlay)

    return () => {
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('play', onPlay)
    }
  }, [])

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = START_OFFSET
    audio.play().catch(() => {})
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const toggle = useCallback(() => {
    if (audioRef.current?.paused) {
      play()
    } else {
      pause()
    }
  }, [play, pause])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = START_OFFSET
      setIsPlaying(false)
    }
  }, [])

  return { isPlaying, play, pause, toggle, stop }
}
