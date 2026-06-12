import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  setDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from './useAuth'
import type { Prediction } from '../types'

export function usePredictions() {
  const { user } = useAuth()
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'predictions'),
      where('userId', '==', user.uid)
    )
    const unsub = onSnapshot(q, (snap) => {
      const map: Record<string, Prediction> = {}
      snap.docs.forEach((d) => {
        const data = d.data() as Prediction
        map[data.gameId] = { ...data, id: d.id }
      })
      setPredictions(map)
      setLoading(false)
    })
    return unsub
  }, [user])

  const savePrediction = async (
    gameId: string,
    homeGoals: number,
    awayGoals: number
  ) => {
    if (!user) return

    const existing = Object.values(predictions).find(
      (p) => p.gameId === gameId
    )
    const ref = existing
      ? doc(db, 'predictions', existing.id)
      : doc(collection(db, 'predictions'))

    await setDoc(
      ref,
      {
        id: ref.id,
        userId: user.uid,
        gameId,
        homeGoals,
        awayGoals,
        points: null,
        createdAt: Date.now(),
      },
      { merge: true }
    )
  }

  return { predictions, loading, savePrediction }
}
