import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Spinner } from '../components/ui/Spinner'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <Spinner size="lg" />
  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}
