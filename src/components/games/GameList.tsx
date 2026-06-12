import { type GroupedGames } from '../../hooks/useGameFilters'
import { GameCard } from './GameCard'
import type { Prediction } from '../../types'
import { EmptyState } from '../ui/EmptyState'
import { Calendar } from 'lucide-react'

interface GameListProps {
  grouped: GroupedGames[]
  predictions: Record<string, Prediction>
  onPredict: (gameId: string) => void
}

export function GameList({ grouped, predictions, onPredict }: GameListProps) {
  if (grouped.length === 0) {
    return (
      <EmptyState
        title="Nenhum jogo encontrado"
        description="Não há jogos para os filtros selecionados. Tente alterar o filtro ou selecionar outra data."
      />
    )
  }

  return (
    <div className="space-y-6">
      {grouped.map(({ dateKey, dateLabel, games }) => (
        <section key={dateKey}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Calendar size={14} />
              {dateLabel}
            </div>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                prediction={predictions[game.id] ?? null}
                onPredict={() => onPredict(game.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
