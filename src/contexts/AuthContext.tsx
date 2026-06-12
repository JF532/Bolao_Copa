import { createContext, useEffect, useState, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import type { UserData } from '../types'

const ADMIN_EMAIL = 'admintesteteste@gmail.com'

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData)
        }
      } else {
        setUserData(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const isAdmin = user?.email === ADMIN_EMAIL

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const register = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    const userData: UserData = {
      id: cred.user.uid,
      name,
      email,
      createdAt: Date.now(),
      active: true,
    }
    await setDoc(doc(db, 'users', cred.user.uid), userData)
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
