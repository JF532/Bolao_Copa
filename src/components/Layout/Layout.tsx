import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { ToastContainer } from '../ui/Toast'
import { BrazilThemeProvider } from '../theme/BrazilThemeProvider'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <BrazilThemeProvider />
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-gray-400 dark:text-gray-600 py-4 border-t border-gray-100 dark:border-gray-800">
        Bolão Copa 2026 — Feito entre amigos
      </footer>
      <ToastContainer />
    </div>
  )
}
