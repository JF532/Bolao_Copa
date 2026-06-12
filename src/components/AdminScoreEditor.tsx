import { useState, type KeyboardEvent } from 'react'

interface AdminScoreEditorProps {
  id: string
  currentPoints: number
  onSave: (id: string, points: number) => Promise<void>
}

export function AdminScoreEditor({ id, currentPoints, onSave }: AdminScoreEditorProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(String(currentPoints))
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    const num = Number(value)
    if (Number.isNaN(num) || num < 0 || num > 99) return
    setSaving(true)
    try {
      await onSave(id, num)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          max={99}
          className="w-16 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-center"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          onBlur={handleSave}
          disabled={saving}
          autoFocus
        />
        {saving && <span className="text-xs text-gray-400">...</span>}
      </div>
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="px-3 py-1 text-sm font-mono rounded hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
    >
      {currentPoints !== null && currentPoints !== undefined ? currentPoints : '-'}
    </button>
  )
}
