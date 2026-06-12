import { PackageOpen } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-gray-300 dark:text-gray-600 mb-4">
        {icon ?? <PackageOpen size={48} />}
      </div>
      <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs mb-4">{description}</p>
      )}
      {action}
    </div>
  )
}
