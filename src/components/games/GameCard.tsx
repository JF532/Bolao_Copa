import { motion } from 'framer-motion'
import { Clock, Eye } from 'lucide-react'
import type { Game, Prediction } from '../../types'
import { formatDateTime } from '../../utils/formatDate'
import { CountryFlag } from '../ui/CountryFlag'
import { Badge } from '../ui/Badge'

interface GameCardProps {
  game: Game
  prediction: Prediction | null
  onPredict: () => void
}

function formatPoints(points: number | null): string {
  if (points === null || points === undefined) return ''
  if (points === 3) return '+3 pts'
  if (points === 1) return '+1 pt'
  return '0 pts'
}

export function GameCard({ game, prediction, onPredict }: GameCardProps) {
  const isPast = game.kickoff < Date.now()
  const canPredict = !isPast && game.status === 'NS'
  const isFinished = game.status === 'FT'

  const statusConfig = {
    NS: { label: 'Aberto', variant: 'info' as const },
    LIVE: { label: 'Ao Vivo', variant: 'success' as const },
    FT: { label: 'Encerrado', variant: 'default' as const },
  }

  const config = statusConfig[game.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge variant={config.variant}>{config.label}</Badge>
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
            {isFinished || isPast ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
                  {game.homeGoals ?? '-'}
                </span>
                <span className="text-lg text-gray-300 dark:text-gray-600">×</span>
                <span className="text-2xl sm:text-3xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
                  {game.awayGoals ?? '-'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">VS</span>
              </div>
            )}
          </div>

          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2">
              <CountryFlag country={game.awayTeam} size="md" />
              <span className="font-semibold text-sm sm:text-base truncate">{game.awayTeam}</span>
            </div>
          </div>
        </div>

        {game.status === 'LIVE' && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Transmitindo</span>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <div>
            {isFinished && prediction && (
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  {prediction.homeGoals}×{prediction.awayGoals}
                </span>
                {formatPoints(prediction.points)}
              </span>
            )}
            {isFinished && !prediction && (
              <span className="text-xs text-gray-400">Sem palpite</span>
            )}
            {!isFinished && prediction && (
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Eye size={14} />
                Seu palpite: {prediction.homeGoals}×{prediction.awayGoals}
              </span>
            )}
          </div>
          {canPredict && (
            <button
              onClick={onPredict}
              className="text-sm px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {prediction ? 'Editar' : 'Palpitar'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
