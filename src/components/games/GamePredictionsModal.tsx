import { useRanking } from '../../hooks/useRanking'
import { useGamePredictions } from '../../hooks/useGamePredictions'
import { Modal } from '../ui/Modal'
import { Avatar } from '../ui/Avatar'
import { Spinner } from '../ui/Spinner'
import { CountryFlag } from '../ui/CountryFlag'
import { Star } from 'lucide-react'
import type { Game, Prediction } from '../../types'

interface GamePredictionsModalProps {
  game: Game
  open: boolean
  onClose: () => void
}

function formatPoints(points: number | null): string {
  if (points === null) return ''
  if (points === 3) return '+3'
  if (points === 1) return '+1'
  return '0'
}

function computeHitGrade(prediction: Prediction, game: Game): 'exact' | 'sign' | 'miss' | 'pending' {
  if (game.homeGoals === null || game.awayGoals === null) return 'pending'
  const exact =
    prediction.homeGoals === game.homeGoals && prediction.awayGoals === game.awayGoals
  if (exact) return 'exact'
  const predSign = Math.sign(prediction.homeGoals - prediction.awayGoals)
  const resultSign = Math.sign(game.homeGoals - game.awayGoals)
  if (predSign === resultSign) return 'sign'
  return 'miss'
}

const gradeStyle = {
  exact: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  sign: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
  miss: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700',
  pending: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
}

const pointsStyle = {
  exact: 'text-amber-600 dark:text-amber-400',
  sign: 'text-emerald-600 dark:text-emerald-400',
  miss: 'text-gray-400 dark:text-gray-500',
  pending: 'text-gray-400 dark:text-gray-500',
}

function PredictionRow({ prediction, name, hit }: { prediction: Prediction; name: string; hit: 'exact' | 'sign' | 'miss' | 'pending' }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${gradeStyle[hit]} transition-colors`}>
      <Avatar name={name} size="sm" />
      <span className="text-sm font-semibold flex-1 min-w-0 truncate">{name}</span>
      <span className="text-sm font-bold tabular-nums">{prediction.homeGoals}×{prediction.awayGoals}</span>
      {hit !== 'pending' && (
        <span className={`flex items-center gap-0.5 text-xs font-bold ${pointsStyle[hit]}`}>
          <Star size={12} fill="currentColor" />
          {formatPoints(prediction.points)}
        </span>
      )}
    </div>
  )
}

export function GamePredictionsModal({ game, open, onClose }: GamePredictionsModalProps) {
  const { predictions, loading } = useGamePredictions(open ? game.id : null)
  const { ranking } = useRanking()

  const userMap = new Map(ranking.map((r) => [r.userId, r.name]))

  const sorted = [...predictions].sort((a, b) => {
    if (game.status === 'FT') {
      const hitA = computeHitGrade(a, game)
      const hitB = computeHitGrade(b, game)
      const order = { exact: 0, sign: 1, miss: 2, pending: 3 }
      return order[hitA] - order[hitB]
    }
    return (a.createdAt ?? 0) - (b.createdAt ?? 0)
  })

  return (
    <Modal open={open} onClose={onClose} title="Palpites">
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700/50">
          <CountryFlag country={game.homeTeam} size="sm" />
          <span className="text-sm font-semibold">{game.homeTeam}</span>
          <span className="text-xs text-gray-400">×</span>
          <CountryFlag country={game.awayTeam} size="sm" />
          <span className="text-sm font-semibold">{game.awayTeam}</span>
          {game.homeGoals !== null && game.awayGoals !== null && (
            <span className="ml-auto text-sm font-bold tabular-nums">
              {game.homeGoals}×{game.awayGoals}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : sorted.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Ninguém palpitou nesse jogo ainda.</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {sorted.map((p) => {
              const name = userMap.get(p.userId) ?? 'Desconhecido'
              const hit = computeHitGrade(p, game)
              return (
                <PredictionRow
                  key={p.id}
                  prediction={p}
                  name={name}
                  hit={hit}
                />
              )
            })}
          </div>
        )}
      </div>
    </Modal>
  )
}
