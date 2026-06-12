import { type FilterType } from '../../hooks/useGameFilters'
import { ChevronLeft, ChevronRight, Calendar, FileText } from 'lucide-react'

interface QuickFilter {
  type: FilterType
  label: string
}

const quickFilters: QuickFilter[] = [
  { type: 'all', label: 'Todos' },
  { type: 'today', label: 'Hoje' },
  { type: 'tomorrow', label: 'Amanhã' },
  { type: 'week', label: 'Esta Semana' },
  { type: 'finished', label: 'Encerrados' },
  { type: 'live', label: 'Ao Vivo' },
  { type: 'open', label: 'Abertos' },
]

interface GameFiltersProps {
  filter: FilterType
  customDate: string
  counts: Record<FilterType, number>
  onFilterChange: (f: FilterType) => void
  onCustomDateChange: (d: string) => void
  onPrevDay: () => void
  onNextDay: () => void
}

function formatDisplayDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function GameFilters({
  filter,
  customDate,
  counts,
  onFilterChange,
  onCustomDateChange,
  onPrevDay,
  onNextDay,
}: GameFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 -mx-4 px-4 sm:mx-0 sm:px-0">
        {quickFilters.map(({ type, label }) => {
          const count = counts[type] ?? 0
          const isActive = filter === type && filter !== 'date'
          return (
            <button
              key={type}
              onClick={() => onFilterChange(type)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {label}
              {count > 0 && (
                <span
                  className={`text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex justify-center pt-1 pb-1">
        <button
          onClick={() => onFilterChange('mine')}
          className={`flex items-center justify-between w-full py-2 px-4 rounded-lg text-sm font-medium bg-gray-50 dark:bg-gray-800/50 border transition-colors ${
            filter === 'mine'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500'
          }`}
        >
          <span className="flex items-center gap-2">
            <FileText size={16} className="text-gray-400 shrink-0" />
            Meus Palpites
          </span>
          {(counts.mine ?? 0) > 0 && (
            <span
              className={`text-xs rounded-full px-2 py-0.5 min-w-[1.5rem] text-center ${
                filter === 'mine'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {counts.mine}
            </span>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrevDay}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
          title="Dia anterior"
        >
          <ChevronLeft size={16} />
        </button>

        <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer relative py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
          <Calendar size={16} className="text-gray-400 shrink-0" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {customDate ? formatDisplayDate(customDate) : 'Selecionar data'}
          </span>
          <input
            type="date"
            value={customDate}
            onChange={(e) => {
              const val = e.target.value
              onCustomDateChange(val)
              if (val) onFilterChange('date')
            }}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>

        <button
          onClick={onNextDay}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
          title="Próximo dia"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
