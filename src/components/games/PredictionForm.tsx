import { useState, type FormEvent } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { CountryFlag } from '../ui/CountryFlag'
import type { Game } from '../../types'
import { isValidScore } from '../../utils/validators'

interface PredictionFormProps {
  game: Game
  initialHome?: number
  initialAway?: number
  open: boolean
  onClose: () => void
  onSave: (homeGoals: number, awayGoals: number) => Promise<void>
}

export function PredictionForm({ game, initialHome, initialAway, open, onClose, onSave }: PredictionFormProps) {
  const [home, setHome] = useState(String(initialHome ?? ''))
  const [away, setAway] = useState(String(initialAway ?? ''))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isValidScore(home) || !isValidScore(away)) {
      setError('Insira números inteiros de 0 a 99')
      return
    }

    setSaving(true)
    try {
      await onSave(Number(home), Number(away))
      onClose()
    } catch {
      setError('Erro ao salvar palpite. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Seu palpite">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <CountryFlag country={game.homeTeam} size="sm" />
              {game.homeTeam}
            </label>
            <Input
              type="number"
              min={0}
              max={99}
              value={home}
              onChange={(e) => setHome(e.target.value)}
              placeholder="0"
              disabled={saving}
            />
          </div>
          <span className="text-lg font-bold pt-6">×</span>
          <div className="flex-1 space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <CountryFlag country={game.awayTeam} size="sm" />
              {game.awayTeam}
            </label>
            <Input
              type="number"
              min={0}
              max={99}
              value={away}
              onChange={(e) => setAway(e.target.value)}
              placeholder="0"
              disabled={saving}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
