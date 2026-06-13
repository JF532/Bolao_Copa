import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import type { UserData, UserRanking } from '../types'

export function useRanking() {
  const [ranking, setRanking] = useState<UserRanking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const users = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as UserData[]

      const list: UserRanking[] = users
        .filter((u) => u.name !== 'ADMIN' && u.active !== false)
        .map((u) => ({
          userId: u.id,
          name: u.name,
          totalScore: (u.predictionPoints ?? 0) + (u.manualPoints ?? 0),
        }))
        .sort((a, b) => b.totalScore - a.totalScore || a.name.localeCompare(b.name))

      setRanking(list)
      setLoading(false)
    })

    return unsub
  }, [])

  return { ranking, loading }
}
