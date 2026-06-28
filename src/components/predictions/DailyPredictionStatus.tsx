import { useMemo, useState, useEffect } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { Avatar } from '../ui/Avatar'
import { Skeleton } from '../ui/Skeleton'
import { Modal } from '../ui/Modal'
import { Users, ChevronRight } from 'lucide-react'
import type { Game, Prediction, UserRanking } from '../../types'

interface UserStatus {
  userId: string
  name: string
  completed: number
  total: number
}

function sameDay(a: number, b: number): boolean {
  const da = new Date(a)
  const db = new Date(b)
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  )
}

function isOpenForPredictions(game: Game): boolean {
  return game.status === 'NS' && game.kickoff > Date.now()
}

function computeStatuses(
  users: { userId: string; name: string }[],
  todayGames: Game[],
  todayPredictions: Prediction[]
): UserStatus[] {
  const todayGameIds = new Set(todayGames.map((g) => g.id))
  const total = todayGames.length

  if (total === 0) return []

  return users.map((user) => {
    const userPreds = todayPredictions.filter(
      (p) => p.userId === user.userId && todayGameIds.has(p.gameId)
    )
    return {
      userId: user.userId,
      name: user.name,
      completed: userPreds.length,
      total,
    }
  })
}

function StatusIcon({ completed, total }: { completed: number; total: number }) {
  if (completed === total) return <span className="text-lg">✅</span>
  if (completed === 0) return <span className="text-lg">❌</span>
  return <span className="text-lg">🟡</span>
}

function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  return (
    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          pct === 100
            ? 'bg-emerald-500'
            : pct > 0
              ? 'bg-amber-400'
              : 'bg-gray-300 dark:bg-gray-600'
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function UserCard({ status }: { status: UserStatus }) {
  const isComplete = status.completed === status.total
  const isZero = status.completed === 0
  const missing = status.total - status.completed

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
        isComplete
          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
          : isZero
            ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
            : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
      }`}
    >
      <Avatar name={status.name} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold truncate">{status.name}</span>
          <StatusIcon completed={status.completed} total={status.total} />
        </div>
        <div className="mt-1.5">
          <ProgressBar completed={status.completed} total={status.total} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {status.completed}/{status.total} jogos
        </p>
        <p className="text-xs font-medium mt-0.5">
          {isComplete ? (
            <span className="text-emerald-600 dark:text-emerald-400">🏆 Todos os palpites enviados</span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400">Faltam {missing} palpite{missing > 1 ? 's' : ''}</span>
          )}
        </p>
      </div>
    </div>
  )
}

interface DailyPredictionStatusProps {
  games: Game[]
  ranking: UserRanking[]
}

export function DailyPredictionStatus({ games, ranking }: DailyPredictionStatusProps) {
  const [todayPredictions, setTodayPredictions] = useState<Prediction[]>([])
  const [predsLoading, setPredsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const todayGames = useMemo(
    () => games.filter((g) => sameDay(g.kickoff, Date.now()) && isOpenForPredictions(g)),
    [games]
  )

  const todayGameIds = useMemo(
    () => todayGames.map((g) => g.id),
    [todayGames]
  )

  const users = useMemo(
    () => ranking.map((r) => ({ userId: r.userId, name: r.name })),
    [ranking]
  )

  useEffect(() => {
    if (todayGameIds.length === 0) {
      setTodayPredictions([])
      setPredsLoading(false)
      return
    }

    setPredsLoading(true)
    const q = query(
      collection(db, 'predictions'),
      where('gameId', 'in', todayGameIds)
    )
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Prediction))
      setTodayPredictions(list)
      setPredsLoading(false)
    })
    return unsub
  }, [todayGameIds])

  const statuses = useMemo(
    () => computeStatuses(users, todayGames, todayPredictions),
    [users, todayGames, todayPredictions]
  )

  const loading = predsLoading

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
          <Users size={16} />
          Quem já palpitou hoje
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Skeleton className="h-28 w-72 shrink-0" count={3} />
        </div>
      </div>
    )
  }

  if (todayGames.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
          <Users size={16} />
          Quem já palpitou hoje
        </div>
        {(statuses.length > 4) && (
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
          >
            Ver todos
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {statuses.slice(0, 4).map((s) => (
          <UserCard key={s.userId} status={s} />
        ))}
      </div>

      <div className="flex sm:hidden gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {statuses.slice(0, 4).map((s) => (
          <div key={s.userId} className="w-72 shrink-0">
            <UserCard status={s} />
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Quem já palpitou hoje">
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {statuses
            .sort((a, b) => b.completed / b.total - a.completed / a.total)
            .map((s) => (
              <UserCard key={s.userId} status={s} />
            ))}
        </div>
      </Modal>
    </div>
  )
}
