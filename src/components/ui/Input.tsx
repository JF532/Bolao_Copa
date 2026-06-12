import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors disabled:opacity-50 ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-500">{error}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
