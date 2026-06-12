import { useToast } from '../../hooks/useToast'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

const icons = {
  success: <CheckCircle size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
}

const colors = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={`${colors[toast.type]} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3`}
          >
            <span className="flex-shrink-0">{icons[toast.type]}</span>
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
