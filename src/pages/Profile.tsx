import { useAuth } from '../hooks/useAuth'
import { useRanking } from '../hooks/useRanking'
import { usePredictions } from '../hooks/usePredictions'
import { useMemo } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { Avatar } from '../components/ui/Avatar'
import { StatCard } from '../components/ui/StatCard'
import { Card } from '../components/ui/Card'
import { Trophy, Target, TrendingUp, Mail, Calendar, User } from 'lucide-react'

export function Profile() {
  const { user, userData } = useAuth()
  const { ranking } = useRanking()
  const { predictions } = usePredictions()

  const stats = useMemo(() => {
    const userRankIdx = ranking.findIndex((r) => r.userId === user?.uid)
    const allPreds = Object.values(predictions)
    const totalPredictions = allPreds.length
    const scored = allPreds.filter((p) => p.points !== null)
    const totalScore = userRankIdx >= 0 ? ranking[userRankIdx].totalScore : 0

    return {
      position: userRankIdx >= 0 ? userRankIdx + 1 : null,
      totalScore,
      totalPredictions,
      scoredPredictions: scored.length,
    }
  }, [ranking, predictions, user])

  return (
    <div className="space-y-6">
      <PageHeader title="Perfil" description="Suas informações e estatísticas" />

      <Card>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <Avatar name={userData?.name ?? 'U'} size="lg" />
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold">{userData?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 justify-center sm:justify-start mt-1">
              <Mail size={14} />
              {userData?.email}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 justify-center sm:justify-start mt-1">
              <Calendar size={14} />
              Cadastrado em {new Date(userData?.createdAt ?? Date.now()).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={<Trophy size={20} />}
          label="Pontuação"
          value={stats.totalScore}
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Posição"
          value={stats.position ? `#${stats.position}` : '-'}
        />
        <StatCard
          icon={<Target size={20} />}
          label="Palpites"
          value={stats.totalPredictions}
        />
        <StatCard
          icon={<User size={20} />}
          label="Pontuados"
          value={stats.scoredPredictions}
        />
      </div>
    </div>
  )
}
