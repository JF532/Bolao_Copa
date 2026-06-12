import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  className?: string
}

export function StatCard({ icon, label, value, className = '' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-xl font-bold tabular-nums mt-0.5">{value}</p>
        </div>
      </div>
    </motion.div>
  )
}
