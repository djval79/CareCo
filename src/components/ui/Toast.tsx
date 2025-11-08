import React from 'react'
import { createPortal } from 'react-dom'
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  onClose?: (id: string) => void
  action?: {
    label: string
    onClick: () => void
  }
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 4000,
  onClose,
  action,
}) => {
  const [isVisible, setIsVisible] = React.useState(true)
  const [isLeaving, setIsLeaving] = React.useState(false)

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.(id)
    }, 300)
  }

  if (!isVisible) return null

  const icons = {
    success: CheckCircleIcon,
    error: ExclamationCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  }

  const Icon = icons[type]

  return createPortal(
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 transition-all duration-300',
        isLeaving ? 'opacity-0 transform translate-x-full' : 'opacity-100 transform translate-x-0',
        colors[type]
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={cn('h-6 w-6', iconColors[type])} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {title && (
              <p className="text-sm font-medium text-gray-900">
                {title}
              </p>
            )}
            <p className="text-sm text-gray-700 mt-1">
              {message}
            </p>
            {action && (
              <div className="mt-3">
                <button
                  type="button"
                  className="text-sm font-medium underline hover:no-underline"
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-md p-1"
              onClick={handleClose}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// Toast Container Component
interface ToastContainerProps {
  toasts: ToastProps[]
  onRemove: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            top: `${16 + index * 80}px`,
            right: '16px',
          }}
          className="fixed z-50"
        >
          <Toast {...toast} onClose={onRemove} />
        </div>
      ))}
    </>
  )
}

// Toast Hook
interface ToastOptions {
  title?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  success: (message: string, options?: ToastOptions) => void
  error: (message: string, options?: ToastOptions) => void
  warning: (message: string, options?: ToastOptions) => void
  info: (message: string, options?: ToastOptions) => void
  remove: (id: string) => void
  clear: () => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const addToast = (type: ToastProps['type'], message: string, options: ToastOptions = {}) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const toast: ToastProps = {
      id,
      type,
      message,
      ...options,
    }

    setToasts(prev => [...prev, toast])

    // Auto remove after duration
    if (options.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, options.duration || 4000)
    }
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const clearToasts = () => {
    setToasts([])
  }

  const value: ToastContextType = {
    success: (message, options) => addToast('success', message, options),
    error: (message, options) => addToast('error', message, options),
    warning: (message, options) => addToast('warning', message, options),
    info: (message, options) => addToast('info', message, options),
    remove: removeToast,
    clear: clearToasts,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export default Toast