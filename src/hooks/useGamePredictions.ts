import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Prediction } from '../types'

export function useGamePredictions(gameId: string | null) {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!gameId) {
      setPredictions([])
      return
    }

    setLoading(true)
    const q = query(
      collection(db, 'predictions'),
      where('gameId', '==', gameId)
    )
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Prediction))
      setPredictions(list)
      setLoading(false)
    })
    return unsub
  }, [gameId])

  return { predictions, loading }
}
