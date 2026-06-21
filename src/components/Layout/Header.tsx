import { Link, useLocation } from 'react-router-dom'
import { SoccerIcon } from '../ui/SoccerIcon'
import { useAuth } from '../../hooks/useAuth'
import { Avatar } from '../ui/Avatar'
import { ThemeToggle } from './ThemeToggle'
import { LogOut } from 'lucide-react'
import { useBrazilThemeContext } from '../../hooks/useBrazilThemeContext'

const navLinks = [
  { to: '/', label: 'Jogos' },
  { to: '/ranking', label: 'Ranking' },
  { to: '/profile', label: 'Perfil' },
]

export function Header() {
  const { user, userData, isAdmin, logout } = useAuth()
  const location = useLocation()
  const { active: brazilActive, isLive } = useBrazilThemeContext()

  const links = isAdmin ? [...navLinks, { to: '/admin', label: 'Admin' }] : navLinks

  return (
    <header
      className={`sticky top-0 z-30 backdrop-blur-lg border-b transition-all duration-500 ${
        brazilActive
          ? 'bg-gradient-to-r from-[#0a7e3c] to-[#1a3a6b] dark:from-[#065f2e] dark:to-[#0f2658] border-[#d4a843]/20'
          : 'bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-800'
      }`}
    >
      {brazilActive && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-brazil-shimmer" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative">
        <Link to="/" className="flex items-center gap-2">
          <SoccerIcon />
          {brazilActive ? (
            <span className="font-bold text-lg hidden sm:inline text-white/90">
              {isLive ? '🔴 Brasil ao vivo' : '🇧🇷 Dia de Brasil'}
            </span>
          ) : (
            <span className="font-bold text-lg hidden sm:inline">Bolão Copa 2026</span>
          )}
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? brazilActive
                    ? 'bg-white/15 text-white'
                    : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : brazilActive
                    ? 'text-white/70 hover:bg-white/10 hover:text-white'
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
              <Link to="/profile" className={`hidden sm:flex items-center gap-2 text-sm transition-colors ${
                brazilActive
                  ? 'text-white/70 hover:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}>
                <Avatar name={userData?.name ?? 'U'} size="sm" />
                <span className="hidden md:inline font-medium">{userData?.name}</span>
              </Link>
              <button
                onClick={logout}
                className={`p-2 rounded-lg transition-colors ${
                  brazilActive
                    ? 'text-white/50 hover:text-white hover:bg-white/10'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
