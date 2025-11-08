import React from 'react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  group?: string
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
  onChange?: (value: string | string[]) => void
  onClear?: () => void
  fullWidth?: boolean
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    className,
    label,
    error,
    helperText,
    options,
    placeholder,
    multiple = false,
    searchable = false,
    clearable = false,
    onChange,
    onClear,
    fullWidth = false,
    id,
    value,
    ...props
  }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (multiple) {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value)
        onChange?.(selectedOptions)
      } else {
        onChange?.(event.target.value)
      }
    }

    const groupedOptions = options.reduce((groups, option) => {
      const group = option.group || ''
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(option)
      return groups
    }, {} as Record<string, SelectOption[]>)

    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'input appearance-none pr-10',
              multiple && 'py-2',
              error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
              fullWidth && 'w-full',
              className
            )}
            value={value}
            onChange={handleChange}
            multiple={multiple}
            {...props}
          >
            {placeholder && !multiple && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
              <optgroup key={groupName} label={groupName}>
                {groupOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {!multiple && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
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

Select.displayName = 'Select'

export default Select