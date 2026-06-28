import { motion } from 'framer-motion'
import { Clock, Eye, Star, Users } from 'lucide-react'
import type { Game, Prediction } from '../../types'
import { formatDateTime } from '../../utils/formatDate'
import { CountryFlag } from '../ui/CountryFlag'
import { Badge } from '../ui/Badge'
import { BrazilCountdown } from '../ui/BrazilCountdown'

interface GameCardProps {
  game: Game
  prediction: Prediction | null
  onPredict: () => void
  onViewPredictions?: () => void
}

function formatPoints(points: number | null): string {
  if (points === null || points === undefined) return ''
  if (points > 0) return `+${points}`
  return '0'
}

const gradeConfig = {
  3: { text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300', icon: 'text-amber-400' },
  1: { text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300', icon: 'text-emerald-400' },
  0: { text: 'text-gray-400 dark:text-gray-500', badge: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400', icon: 'text-gray-300 dark:text-gray-600' },
}

function isBrazilGame(team: string): boolean {
  return team === 'Brasil' || team === 'Brazil'
}

function isSameDay(a: number, b: number): boolean {
  const da = new Date(a)
  const db = new Date(b)
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate()
}

export function GameCard({ game, prediction, onPredict, onViewPredictions }: GameCardProps) {
  const isPast = game.kickoff < Date.now()
  const hasKickedOff = game.kickoff <= Date.now()
  const canPredict = !isPast && game.status === 'NS'
  const isFinished = game.status === 'FT'
  const isBrazil = isBrazilGame(game.homeTeam) || isBrazilGame(game.awayTeam)
  const isBrazilToday = isBrazil && isSameDay(game.kickoff, Date.now())
  const brazilTeam = isBrazilGame(game.homeTeam) ? 'home' : isBrazilGame(game.awayTeam) ? 'away' : null

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
      className={`relative bg-white dark:bg-gray-800 rounded-xl border overflow-hidden transition-all duration-300 ${
        isBrazilToday
          ? 'brazil-bg-light dark:bg-gray-800 hover:brazil-glow hover:scale-[1.02]'
          : isBrazil
            ? 'border-gray-200 dark:border-gray-700 hover:shadow-md'
            : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
      }`}
    >
      {isBrazilToday && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#009739]/[0.04] via-[#FFDF00]/[0.02] to-[#002776]/[0.01] pointer-events-none" />
      )}
      {isBrazilToday && (
        <div className="absolute left-0 top-0 bottom-0 w-[9px] bg-gradient-to-b from-[#009739] via-[#FFDF00] to-[#002776] rounded-l-xl" />
      )}

      {isBrazil && !isBrazilToday && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#009739]/[0.18] to-[#FFDF00]/[0.10] pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#009739]/[0.6] rounded-l-xl" />
        </>
      )}

      <div className="p-4 relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={config.variant}>{config.label}</Badge>
            {isBrazilToday && (
              <span className="text-xs font-bold text-white bg-[#009739] px-2 py-0.5 rounded-full">
                🇧🇷 Brasil
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={12} />
            {formatDateTime(game.kickoff)}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex-1 text-right min-w-0">
            <div className="flex items-center justify-end gap-2">
              <span className={`font-semibold text-sm sm:text-base truncate ${brazilTeam === 'home' && isBrazilToday ? 'text-[#009739] dark:text-[#4ade80] font-bold' : ''}`}>
                {game.homeTeam}
              </span>
              <CountryFlag country={game.homeTeam} size="md" />
            </div>
          </div>

          <div className="flex-shrink-0">
            {game.homeGoals !== null && game.awayGoals !== null ? (
              <div className="flex items-center gap-2">
                <span className={`text-2xl sm:text-3xl font-bold tabular-nums ${brazilTeam === 'home' && isFinished && isBrazilToday ? 'text-[#009739] dark:text-[#4ade80] drop-shadow-[0_0_6px_rgba(255,223,0,0.3)]' : 'text-gray-900 dark:text-gray-100'}`}>
                  {game.homeGoals}
                </span>
                <span className="text-lg text-gray-300 dark:text-gray-600">×</span>
                <span className={`text-2xl sm:text-3xl font-bold tabular-nums ${brazilTeam === 'away' && isFinished && isBrazilToday ? 'text-[#009739] dark:text-[#4ade80] drop-shadow-[0_0_6px_rgba(255,223,0,0.3)]' : 'text-gray-900 dark:text-gray-100'}`}>
                  {game.awayGoals}
                </span>
              </div>
            ) : (
              <div className={`flex items-center gap-2 px-3 py-1.5 ${isBrazilToday ? 'bg-[#FFDF00]/[0.15] dark:bg-[#FFDF00]/[0.1] rounded-lg' : ''}`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${isBrazilToday ? 'text-[#b8860b] dark:text-[#f0d060]' : 'text-gray-400'}`}>VS</span>
              </div>
            )}
          </div>

          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2">
              <CountryFlag country={game.awayTeam} size="md" />
              <span className={`font-semibold text-sm sm:text-base truncate ${brazilTeam === 'away' && isBrazilToday ? 'text-[#009739] dark:text-[#4ade80] font-bold' : ''}`}>
                {game.awayTeam}
              </span>
            </div>
          </div>
        </div>

        {game.status === 'LIVE' && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Transmitindo</span>
          </div>
        )}

        {isBrazil && !isPast && (
          <div className="mt-2 flex justify-center">
            <BrazilCountdown game={game} />
          </div>
        )}

        {isBrazilToday && isFinished && (
          <div className="mt-2 flex justify-center">
            <BrazilCountdown game={game} />
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <div>
            {isFinished && prediction && (
              (() => {
                const pts = prediction.points ?? -1
                const grade = [6, 3].includes(pts) ? 3 : [2, 1].includes(pts) ? 1 : 0
                const cfg = gradeConfig[grade]
                return (
                  <span className={`text-sm font-medium ${cfg.text} flex items-center gap-1.5`}>
                    <span className={`text-xs ${cfg.badge} px-2 py-0.5 rounded-full font-bold`}>
                      {prediction.homeGoals}×{prediction.awayGoals}
                    </span>
                    <span className="flex items-center gap-0.5">
                      {grade === 3 && <Star size={14} className={cfg.icon} fill="currentColor" />}
                      {formatPoints(prediction.points)} pts
                    </span>
                  </span>
                )
              })()
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
          <div className="flex items-center gap-2">
            {hasKickedOff && (prediction || isFinished) && (
              <button
                onClick={onViewPredictions}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1"
              >
                <Users size={14} />
                Ver palpites
              </button>
            )}
            {canPredict && (
              <button
                onClick={onPredict}
                className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors text-white ${
                  isBrazilToday
                    ? 'bg-[#009739] hover:bg-[#007a2f]'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {prediction ? 'Editar' : 'Palpitar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
