import { useAuth } from '../hooks/useAuth'
import { useGames } from '../hooks/useGames'
import { usePredictions } from '../hooks/usePredictions'
import { useRanking } from '../hooks/useRanking'
import { useGameFilters } from '../hooks/useGameFilters'
import { useState, useMemo } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { Skeleton } from '../components/ui/Skeleton'
import { GameFilters } from '../components/games/GameFilters'
import { GameList } from '../components/games/GameList'
import { PredictionForm } from '../components/games/PredictionForm'
import { GamePredictionsModal } from '../components/games/GamePredictionsModal'
import { DailyPredictionStatus } from '../components/predictions/DailyPredictionStatus'
import { MyPredictionsTabs } from '../components/predictions/MyPredictionsTabs'
import { Calendar, Trophy, Target, TrendingUp } from 'lucide-react'
import type { Game } from '../types'

export function Dashboard() {
  const { user } = useAuth()
  const { games, loading: gamesLoading } = useGames()
  const { predictions, savePrediction } = usePredictions()
  const { ranking } = useRanking()
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [gameForPredictions, setGameForPredictions] = useState<Game | null>(null)

  const {
    filter,
    customDate,
    setFilter,
    setCustomDate,
    prevDay,
    nextDay,
    grouped,
    counts,
  } = useGameFilters(games, predictions)

  const userRanking = useMemo(() => {
    const idx = ranking.findIndex((r) => r.userId === user?.uid)
    return idx >= 0 ? { position: idx + 1, score: ranking[idx].totalScore } : null
  }, [ranking, user])

  const predictionCount = useMemo(
    () => Object.values(predictions).length,
    [predictions]
  )

  if (gamesLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-24" count={4} />
        </div>
        <Skeleton className="h-40" count={3} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral da sua participação no Bolão"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={<Trophy size={20} />}
          label="Minha pontuação"
          value={userRanking?.score ?? 0}
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Posição no ranking"
          value={userRanking ? `#${userRanking.position}` : '-'}
        />
        <StatCard
          icon={<Target size={20} />}
          label="Meus palpites"
          value={predictionCount}
        />
        <StatCard
          icon={<Calendar size={20} />}
          label="Total de jogos"
          value={games.length}
        />
      </div>

      <DailyPredictionStatus games={games} ranking={ranking} />

      <GameFilters
        filter={filter}
        customDate={customDate}
        counts={counts}
        onFilterChange={setFilter}
        onCustomDateChange={setCustomDate}
        onPrevDay={prevDay}
        onNextDay={nextDay}
      />

      {filter === 'mine' ? (
        <MyPredictionsTabs
          games={games}
          predictions={predictions}
          onPredict={(gameId) => {
            const game = games.find((g) => g.id === gameId)
            if (game) setSelectedGame(game)
          }}
          onViewPredictions={(gameId) => {
            const game = games.find((g) => g.id === gameId)
            if (game) setGameForPredictions(game)
          }}
        />
      ) : (
        <GameList
          grouped={grouped}
          predictions={predictions}
          onPredict={(gameId) => {
            const game = games.find((g) => g.id === gameId)
            if (game) setSelectedGame(game)
          }}
          onViewPredictions={(gameId) => {
            const game = games.find((g) => g.id === gameId)
            if (game) setGameForPredictions(game)
          }}
        />
      )}

      {selectedGame && (
        <PredictionForm
          game={selectedGame}
          initialHome={predictions[selectedGame.id]?.homeGoals}
          initialAway={predictions[selectedGame.id]?.awayGoals}
          open={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          onSave={async (h, a) => {
            await savePrediction(selectedGame.id, h, a)
          }}
        />
      )}

      {gameForPredictions && (
        <GamePredictionsModal
          game={gameForPredictions}
          open={!!gameForPredictions}
          onClose={() => setGameForPredictions(null)}
        />
      )}
    </div>
  )
}
