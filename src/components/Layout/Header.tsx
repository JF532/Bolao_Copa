import { Link, useLocation } from 'react-router-dom'
import { SoccerIcon } from '../ui/SoccerIcon'
import { useAuth } from '../../hooks/useAuth'
import { Avatar } from '../ui/Avatar'
import { ThemeToggle } from './ThemeToggle'
import { Menu, LogOut } from 'lucide-react'
import { useState } from 'react'
import { MobileMenu } from './MobileMenu'

const navLinks = [
  { to: '/', label: 'Jogos' },
  { to: '/ranking', label: 'Ranking' },
  { to: '/profile', label: 'Perfil' },
]

export function Header() {
  const { user, userData, isAdmin, logout } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = isAdmin ? [...navLinks, { to: '/admin', label: 'Admin' }] : navLinks

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <SoccerIcon />
              <span className="font-bold text-lg hidden sm:inline">Bolão Copa 2026</span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user && (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  <Avatar name={userData?.name ?? 'U'} size="sm" />
                  <span className="hidden md:inline font-medium">{userData?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Sair"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={links} />
    </>
  )
}
