import { useEffect, useState } from 'react'
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import type { UserData } from '../types'

export function useAdmin() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as UserData[]
      setUsers(list.sort((a, b) => a.name.localeCompare(b.name)))
      setLoading(false)
    })
    return unsub
  }, [])

  const updatePoints = async (userId: string, points: number) => {
    await updateDoc(doc(db, 'users', userId), { manualPoints: points })
  }

  const toggleActive = async (userId: string, active: boolean) => {
    await updateDoc(doc(db, 'users', userId), { active })
  }

  return { users, loading, updatePoints, toggleActive }
}
