import { Link, useLocation } from 'react-router-dom'
import { SoccerIcon } from '../ui/SoccerIcon'
import { useAuth } from '../../hooks/useAuth'
import { Avatar } from '../ui/Avatar'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Home, Trophy, User, Shield } from 'lucide-react'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  links: { to: string; label: string }[]
}

const icons: Record<string, React.ReactNode> = {
  Jogos: <Home size={18} />,
  Ranking: <Trophy size={18} />,
  Perfil: <User size={18} />,
  Admin: <Shield size={18} />,
}

export function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  const { userData } = useAuth()
  const location = useLocation()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 lg:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <SoccerIcon />
                <span className="font-bold">Bolão Copa 2026</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
            </div>

            {userData && (
              <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
                <Avatar name={userData.name} size="md" />
                <div>
                  <p className="font-medium text-sm">{userData.name}</p>
                  <p className="text-xs text-gray-400">{userData.email}</p>
                </div>
              </div>
            )}

            <nav className="p-3 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {icons[link.label]}
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
