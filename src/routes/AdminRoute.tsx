import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth()

  if (loading) return null
  if (!isAdmin) return <Navigate to="/" replace />

  return <>{children}</>
}
