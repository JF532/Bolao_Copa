import { motion } from 'framer-motion'
import { Clock, Star, Users } from 'lucide-react'
import type { Game, Prediction } from '../../types'
import { formatDateTime } from '../../utils/formatDate'
import { CountryFlag } from '../ui/CountryFlag'
import { Badge } from '../ui/Badge'

interface PredictionHistoryCardProps {
  game: Game
  prediction: Prediction
  onViewPredictions?: (gameId: string) => void
}

function computeHitGrade(prediction: Prediction, game: Game): 'exact' | 'sign' | 'miss' {
  if (game.homeGoals === null || game.awayGoals === null) return 'miss'
  const exact =
    prediction.homeGoals === game.homeGoals && prediction.awayGoals === game.awayGoals
  if (exact) return 'exact'
  const predSign = Math.sign(prediction.homeGoals - prediction.awayGoals)
  const resultSign = Math.sign(game.homeGoals - game.awayGoals)
  if (predSign === resultSign) return 'sign'
  return 'miss'
}

const gradeConfig = {
  exact: {
    border: 'border-amber-400 dark:border-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    points: 'text-amber-600 dark:text-amber-400',
    icon: 'text-amber-400',
  },
  sign: {
    border: 'border-emerald-400 dark:border-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    points: 'text-emerald-600 dark:text-emerald-400',
    icon: 'text-emerald-400',
  },
  miss: {
    border: 'border-gray-200 dark:border-gray-700',
    bg: 'bg-white dark:bg-gray-800',
    badge: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    points: 'text-gray-400 dark:text-gray-500',
    icon: 'text-gray-300 dark:text-gray-600',
  },
}

function formatPoints(points: number | null): string {
  if (points === null || points === undefined) return ''
  if (points === 3) return '+3 pts'
  if (points === 1) return '+1 pt'
  return '0 pts'
}

export function PredictionHistoryCard({ game, prediction, onViewPredictions }: PredictionHistoryCardProps) {
  const hit = computeHitGrade(prediction, game)
  const cfg = gradeConfig[hit]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${cfg.bg} ${cfg.border} rounded-xl border overflow-hidden transition-all duration-300`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={hit === 'exact' ? 'warning' : hit === 'sign' ? 'success' : 'default'}>
              {hit === 'exact' ? '⭐ Placar Exato' : hit === 'sign' ? '✅ Vencedor' : '❌ Errou'}
            </Badge>
          </div>
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
            <div className="flex items-center gap-2">
              <span className={`text-2xl sm:text-3xl font-bold tabular-nums ${hit === 'exact' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-gray-100'}`}>
                {game.homeGoals ?? '-'}
              </span>
              <span className="text-lg text-gray-300 dark:text-gray-600">×</span>
              <span className={`text-2xl sm:text-3xl font-bold tabular-nums ${hit === 'exact' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-gray-100'}`}>
                {game.awayGoals ?? '-'}
              </span>
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
            <span className="text-xs text-gray-500 dark:text-gray-400">Seu palpite:</span>
            <span className={`text-sm font-bold px-2 py-0.5 rounded ${cfg.badge}`}>
              {prediction.homeGoals}×{prediction.awayGoals}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onViewPredictions && (
              <button
                onClick={() => onViewPredictions(game.id)}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1"
              >
                <Users size={14} />
                Ver palpites
              </button>
            )}
            <div className={`flex items-center gap-1 font-bold text-sm ${cfg.points}`}>
              <Star size={14} className={cfg.icon} fill="currentColor" />
              {formatPoints(prediction.points)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
