interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl' }

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const bgColors = [
  'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-orange-500', 'bg-teal-500',
]

function color(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return bgColors[Math.abs(hash) % bgColors.length]
}

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={`${sizes[size]} ${color(name)} rounded-full flex items-center justify-center text-white font-bold ${className}`}
      title={name}
    >
      {initials(name)}
    </div>
  )
}
