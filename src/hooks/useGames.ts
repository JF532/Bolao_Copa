import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Game } from '../types'

function toMillis(val: unknown): number {
  if (typeof val === 'number') return val
  if (val && typeof (val as { toMillis: () => number }).toMillis === 'function') {
    return (val as { toMillis: () => number }).toMillis()
  }
  return Date.now()
}

export function useGames() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'games'), orderBy('kickoff', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          kickoff: toMillis(data.kickoff),
        } as Game
      })
      setGames(list)
      setLoading(false)
    })
    return unsub
  }, [])

  return { games, loading }
}
