import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminRoute } from './AdminRoute'
import { Spinner } from '../components/ui/Spinner'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'

const Dashboard = lazy(() => import('../pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Ranking = lazy(() => import('../pages/Ranking').then((m) => ({ default: m.Ranking })))
const Profile = lazy(() => import('../pages/Profile').then((m) => ({ default: m.Profile })))
const Admin = lazy(() => import('../pages/Admin').then((m) => ({ default: m.Admin })))

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Spinner size="lg" />}>{children}</Suspense>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <SuspenseWrapper>
                <Dashboard />
              </SuspenseWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="ranking"
          element={
            <ProtectedRoute>
              <SuspenseWrapper>
                <Ranking />
              </SuspenseWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <SuspenseWrapper>
                <Profile />
              </SuspenseWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <SuspenseWrapper>
                  <Admin />
                </SuspenseWrapper>
              </AdminRoute>
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
