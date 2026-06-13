import { useMemo } from 'react'
import type { Game, Prediction } from '../../types'
import { EmptyState } from '../ui/EmptyState'
import { PredictionHistoryCard } from './PredictionHistoryCard'

interface FinishedPredictionsProps {
  games: Game[]
  predictions: Record<string, Prediction>
  onViewPredictions?: (gameId: string) => void
}

export function FinishedPredictions({ games, predictions, onViewPredictions }: FinishedPredictionsProps) {
  const finished = useMemo(() => {
    return games
      .filter((g) => predictions[g.id] && g.status === 'FT')
      .sort((a, b) => b.kickoff - a.kickoff)
  }, [games, predictions])

  if (finished.length === 0) {
    return (
      <EmptyState
        title="Nenhum palpite encerrado ainda"
        description="Seus palpites aparecerão aqui depois que os jogos terminarem."
      />
    )
  }

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {finished.map((game) => (
        <PredictionHistoryCard
          key={game.id}
          game={game}
          prediction={predictions[game.id]}
          onViewPredictions={onViewPredictions}
        />
      ))}
    </div>
  )
}
