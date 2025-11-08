import React from 'react'
import { cn } from '@/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  startIcon?: React.ComponentType<{ className?: string }>
  endIcon?: React.ComponentType<{ className?: string }>
  fullWidth?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    label,
    error,
    helperText,
    startIcon: StartIcon,
    endIcon: EndIcon,
    fullWidth = false,
    id,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {StartIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <StartIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'input',
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

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input