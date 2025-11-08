import React from 'react'
import { cn } from '@/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  startIcon?: React.ComponentType<{ className?: string }>
  endIcon?: React.ComponentType<{ className?: string }>
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    label,
    error,
    fullWidth = true,
    startIcon: StartIcon,
    endIcon: EndIcon,
    ...props
  }, ref) => {
    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {StartIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <StartIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <textarea
            ref={ref}
            className={cn(
              'block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
              'resize-vertical min-h-[80px]',
              StartIcon && 'pl-10',
              EndIcon && 'pr-10',
              error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
              fullWidth && 'w-full',
              className
            )}
            {...props}
          />
          {EndIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <EndIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea