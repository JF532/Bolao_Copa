import { Link, useLocation } from 'react-router-dom'
import { Home, Trophy, User, Shield } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { SoccerIcon } from '../ui/SoccerIcon'

const navItems = [
  { to: '/', icon: Home, label: 'Jogos' },
  { to: '/ranking', icon: Trophy, label: 'Ranking' },
  { to: '/profile', icon: User, label: 'Perfil' },
]

export function BottomNav() {
  const { isAdmin } = useAuth()
  const location = useLocation()

  const items = isAdmin
    ? [...navItems, { to: '/admin', icon: Shield, label: 'Admin' }]
    : navItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-around h-16 px-2">
        <Link to="/" className="flex items-center gap-2">
          <SoccerIcon />
        </Link>
        {items.map((item) => {
          const active = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
                active
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
