import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Target, Trophy, Star, CheckCircle } from 'lucide-react'
import type { Game, Prediction } from '../../types'
import { UpcomingPredictions } from './UpcomingPredictions'
import { LivePredictions } from './LivePredictions'
import { FinishedPredictions } from './FinishedPredictions'

interface MyPredictionsTabsProps {
  games: Game[]
  predictions: Record<string, Prediction>
  onPredict?: (gameId: string) => void
  onViewPredictions?: (gameId: string) => void
}

interface PredictionStats {
  total: number
  finished: number
  points: number
  exactHits: number
}

function computeStats(games: Game[], predictions: Record<string, Prediction>): PredictionStats {
  const preds = Object.values(predictions)
  const total = preds.length
  const finished = preds.filter((p) => {
    const game = games.find((g) => g.id === p.gameId)
    return game?.status === 'FT'
  }).length
  const points = preds.reduce((sum, p) => sum + (p.points ?? 0), 0)
  const exactHits = preds.filter((p) => p.points === 3).length

  return { total, finished, points, exactHits }
}

type Tab = 'upcoming' | 'live' | 'finished'

export function MyPredictionsTabs({ games, predictions, onPredict, onViewPredictions }: MyPredictionsTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming')

  const stats = useMemo(() => computeStats(games, predictions), [games, predictions])

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'upcoming', label: 'Próximos', count: games.filter((g) => predictions[g.id] && g.status === 'NS' && g.kickoff > Date.now()).length },
    { key: 'live', label: 'Em Andamento', count: games.filter((g) => predictions[g.id] && g.status === 'LIVE').length },
    { key: 'finished', label: 'Encerrados', count: games.filter((g) => predictions[g.id] && g.status === 'FT').length },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Target size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total de palpites</p>
              <p className="text-xl font-bold tabular-nums mt-0.5">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Encerrados</p>
              <p className="text-xl font-bold tabular-nums mt-0.5">{stats.finished}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Trophy size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pontos acumulados</p>
              <p className="text-xl font-bold tabular-nums mt-0.5">{stats.points}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Star size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acertos exatos</p>
              <p className="text-xl font-bold tabular-nums mt-0.5">{stats.exactHits}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative pb-3 px-4 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`ml-1.5 text-xs rounded-full px-1.5 py-0.5 ${
                  activeTab === tab.key
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {tab.count}
              </span>
            )}
            {activeTab === tab.key && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'upcoming' ? (
          <UpcomingPredictions games={games} predictions={predictions} onPredict={onPredict} onViewPredictions={onViewPredictions} />
        ) : activeTab === 'live' ? (
          <LivePredictions games={games} predictions={predictions} onViewPredictions={onViewPredictions} />
        ) : (
          <FinishedPredictions games={games} predictions={predictions} onViewPredictions={onViewPredictions} />
        )}
      </motion.div>
    </div>
  )
}
