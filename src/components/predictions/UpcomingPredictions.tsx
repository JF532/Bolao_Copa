import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Clock, Eye, Users } from 'lucide-react'
import type { Game, Prediction } from '../../types'
import { formatDateTime } from '../../utils/formatDate'
import { CountryFlag } from '../ui/CountryFlag'
import { Badge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'

interface UpcomingPredictionsProps {
  games: Game[]
  predictions: Record<string, Prediction>
  onPredict?: (gameId: string) => void
  onViewPredictions?: (gameId: string) => void
}

export function UpcomingPredictions({ games, predictions, onPredict, onViewPredictions }: UpcomingPredictionsProps) {
  const upcoming = useMemo(() => {
    const now = Date.now()
    return games
      .filter((g) => predictions[g.id] && g.status === 'NS' && g.kickoff > now)
      .sort((a, b) => a.kickoff - b.kickoff)
  }, [games, predictions])

  if (upcoming.length === 0) {
    return (
      <EmptyState
        title="Você ainda não enviou palpites"
        description="Navegue até a aba de jogos e envie seu palpite para os próximos jogos."
      />
    )
  }

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {upcoming.map((game) => {
        const pred = predictions[game.id]
        return (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <Badge variant="info">Aberto</Badge>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={12} />
                {formatDateTime(game.kickoff)}
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex-1 text-right min-w-0">
                <div className="flex items-center justify-end gap-2">
                  <span className="font-semibold text-sm sm:text-base truncate">{game.homeTeam}</span>
                  <CountryFlag country={game.homeTeam} size="md" />
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">VS</span>
                </div>
              </div>

              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                  <CountryFlag country={game.awayTeam} size="md" />
                  <span className="font-semibold text-sm sm:text-base truncate">{game.awayTeam}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-blue-500" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Seu palpite: {pred.homeGoals}×{pred.awayGoals}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {onViewPredictions && game.kickoff <= Date.now() && (
                  <button
                    onClick={() => onViewPredictions(game.id)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1"
                  >
                    <Users size={14} />
                    Ver palpites
                  </button>
                )}
                {onPredict && (
                  <button
                    onClick={() => onPredict(game.id)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
                  >
                    {pred ? 'Editar' : 'Palpitar'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
