export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
