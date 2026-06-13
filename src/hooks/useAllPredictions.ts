import { useEffect, useState } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Prediction } from '../types'

export function useAllPredictions() {
  const [allPredictions, setAllPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'predictions'))
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Prediction))
      setAllPredictions(list)
      setLoading(false)
    })
    return unsub
  }, [])

  return { allPredictions, loading }
}
