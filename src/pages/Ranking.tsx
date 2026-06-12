import { useRanking } from '../hooks/useRanking'
import { useAuth } from '../hooks/useAuth'
import { PageHeader } from '../components/ui/PageHeader'
import { Skeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Avatar } from '../components/ui/Avatar'
import { motion } from 'framer-motion'
import { Trophy, Medal, Award } from 'lucide-react'

const podiumIcons = [
  <Trophy size={18} className="text-yellow-500" />,
  <Medal size={18} className="text-slate-400" />,
  <Award size={18} className="text-amber-600" />,
]

const podiumColors = [
  'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800',
  'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-600',
  'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800',
]

export function Ranking() {
  const { ranking, loading } = useRanking()
  const { user } = useAuth()

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12" count={5} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ranking"
        description="Classificação geral dos participantes"
      />

      {ranking.length === 0 ? (
        <EmptyState title="Nenhum participante" description="Aguardando usuários se cadastrarem." />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50">
                  <th className="py-3 px-4 text-left font-medium text-gray-400 w-12">#</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-400">Participante</th>
                  <th className="py-3 px-4 text-right font-medium text-gray-400">Pontos</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((entry, idx) => {
                  const isMe = entry.userId === user?.uid
                  const isPodium = idx < 3

                  return (
                    <motion.tr
                      key={entry.userId}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`border-b border-gray-100 dark:border-gray-700/30 last:border-0 transition-colors ${
                        isMe ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                      } ${isPodium ? podiumColors[idx] : ''} hover:bg-gray-50 dark:hover:bg-gray-700/30`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {isPodium ? (
                            podiumIcons[idx]
                          ) : (
                            <span className="text-gray-400 font-medium">{idx + 1}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={entry.name} size="sm" />
                          <div>
                            <span className={`font-medium ${isMe ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                              {entry.name}
                            </span>
                            {isMe && (
                              <span className="ml-2 text-xs text-blue-500 font-medium">(você)</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-bold tabular-nums text-lg ${
                          isPodium
                            ? 'text-gray-900 dark:text-gray-100'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {entry.totalScore}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
