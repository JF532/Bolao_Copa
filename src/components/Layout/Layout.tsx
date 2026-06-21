import { useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { ToastContainer } from '../ui/Toast'
import { BrazilThemeProvider } from '../theme/BrazilThemeProvider'

export function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <BrazilThemeProvider />
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 pb-24 lg:pb-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </main>
      <footer className="text-center text-xs text-gray-400 dark:text-gray-600 py-4 pb-20 lg:pb-4 border-t border-gray-100 dark:border-gray-800">
        Bolão Copa 2026 — Feito entre amigos
      </footer>
      <BottomNav />
      <ToastContainer />
    </div>
  )
}
