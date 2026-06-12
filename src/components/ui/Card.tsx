import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 ${
        hover ? 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600' : ''
      } transition-all duration-200 ${className}`}
    >
      {children}
    </motion.div>
  )
}
