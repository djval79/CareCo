import React, { useState, forwardRef } from 'react'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import { format, parseISO, isValid } from 'date-fns'
import { cn } from '@/utils'

interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  helperText?: string
  value?: string | Date
  onChange?: (date: string | null) => void
  placeholder?: string
  dateFormat?: string
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  fullWidth?: boolean
  variant?: 'outlined' | 'filled'
  size?: 'sm' | 'md' | 'lg'
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({
    className = '',
    label,
    error,
    helperText,
    value,
    onChange,
    placeholder = 'Select date',
    dateFormat = 'yyyy-MM-dd',
    minDate,
    maxDate,
    disabledDates = [],
    fullWidth = false,
    variant = 'outlined',
    size = 'md',
    id,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const inputId = id || `datepicker-${Math.random().toString(36).substr(2, 9)}`

    // Parse the value to Date object
    const parseValue = (val: string | Date | undefined): Date | null => {
      if (!val) return null
      if (val instanceof Date) return val
      const parsed = parseISO(val)
      return isValid(parsed) ? parsed : null
    }

    const selectedDate = parseValue(value)

    // Format display value
    const displayValue = selectedDate ? format(selectedDate, 'PPP') : ''

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      if (inputValue === '') {
        onChange?.(null)
      } else {
        // Try to parse the input
        try {
          const parsed = parseISO(inputValue)
          if (isValid(parsed)) {
            onChange?.(format(parsed, dateFormat))
          }
        } catch (error) {
          // Invalid date, ignore
        }
      }
    }

    const handleDateSelect = (date: Date) => {
      onChange?.(format(date, dateFormat))
      setIsOpen(false)
    }

    const isDateDisabled = (date: Date): boolean => {
      if (minDate && date < minDate) return true
      if (maxDate && date > maxDate) return true
      return disabledDates.some(disabledDate =>
        date.toDateString() === disabledDate.toDateString()
      )
    }

    const isDateSelected = (date: Date): boolean => {
      return selectedDate?.toDateString() === date.toDateString()
    }

    const isToday = (date: Date): boolean => {
      const today = new Date()
      return date.toDateString() === today.toDateString()
    }

    const generateCalendarDays = () => {
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()

      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())

      const days = []
      const currentDate = new Date(startDate)

      for (let i = 0; i < 42; i++) {
        const day = new Date(currentDate)
        const isCurrentMonth = day.getMonth() === month
        const isDisabled = isDateDisabled(day)
        const isSelected = isDateSelected(day)
        const isTodayDate = isToday(day)

        days.push({
          date: day,
          isCurrentMonth,
          isDisabled,
          isSelected,
          isToday: isTodayDate,
        })

        currentDate.setDate(currentDate.getDate() + 1)
      }

      return days
    }

    const calendarDays = generateCalendarDays()

    const navigateMonth = (direction: 'prev' | 'next') => {
      setCurrentMonth(prev => {
        const newMonth = new Date(prev)
        if (direction === 'prev') {
          newMonth.setMonth(newMonth.getMonth() - 1)
        } else {
          newMonth.setMonth(newMonth.getMonth() + 1)
        }
        return newMonth
      })
    }

    const baseClasses = 'relative'

    return (
      <div className={cn(baseClasses, fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={cn(
              'input pr-10 cursor-pointer',
              error && 'border-red-500 focus:ring-red-500',
              fullWidth && 'w-full'
            )}
            onClick={() => setIsOpen(!isOpen)}
            readOnly
            {...props}
          />

          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {(error || helperText) && (
          <p className={cn(
            'mt-1 text-sm',
            error ? 'text-red-600' : 'text-gray-500'
          )}>
            {error || helperText}
          </p>
        )}

        {/* Calendar Dropdown */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Calendar */}
            <div className="absolute z-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => navigateMonth('prev')}
                  className="p-1 hover:bg-gray-100 rounded-md"
                >
                  <span className="sr-only">Previous month</span>
                  ‹
                </button>

                <h3 className="text-lg font-semibold text-gray-900">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>

                <button
                  type="button"
                  onClick={() => navigateMonth('next')}
                  className="p-1 hover:bg-gray-100 rounded-md"
                >
                  <span className="sr-only">Next month</span>
                  ›
                </button>
              </div>

              {/* Days of week */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => !day.isDisabled && handleDateSelect(day.date)}
                    disabled={day.isDisabled}
                    className={cn(
                      'w-8 h-8 text-sm rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500',
                      day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                      day.isSelected && 'bg-primary-600 text-white hover:bg-primary-700',
                      day.isToday && !day.isSelected && 'bg-gray-100 text-gray-900',
                      day.isDisabled && 'text-gray-300 cursor-not-allowed hover:bg-transparent'
                    )}
                  >
                    {day.date.getDate()}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange?.(null)
                    setIsOpen(false)
                  }}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                >
                  Clear
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'

// Date Range Picker Component
interface DateRange {
  start: string | null
  end: string | null
}

interface DateRangePickerProps {
  label?: string
  error?: string
  helperText?: string
  value?: DateRange
  onChange?: (range: DateRange) => void
  placeholder?: { start: string; end: string }
  dateFormat?: string
  minDate?: Date
  maxDate?: Date
  fullWidth?: boolean
}

export function DateRangePicker({
  label,
  error,
  helperText,
  value = { start: null, end: null },
  onChange,
  placeholder = { start: 'Start date', end: 'End date' },
  dateFormat = 'yyyy-MM-dd',
  minDate,
  maxDate,
  fullWidth = false,
}: DateRangePickerProps) {
  const handleStartChange = (date: string | null) => {
    onChange?.({ ...value, start: date })
  }

  const handleEndChange = (date: string | null) => {
    onChange?.({ ...value, end: date })
  }

  return (
    <div className={cn('space-y-2', fullWidth && 'w-full')}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className={cn('flex gap-2', fullWidth && 'w-full')}>
        <div className={cn('flex-1', fullWidth && 'w-full')}>
          <DatePicker
            value={value.start || undefined}
            onChange={handleStartChange}
            placeholder={placeholder.start}
            dateFormat={dateFormat}
            minDate={minDate}
            maxDate={value.end ? new Date(value.end) : maxDate}
            fullWidth
          />
        </div>

        <div className="flex items-center text-gray-400">
          <span>to</span>
        </div>

        <div className={cn('flex-1', fullWidth && 'w-full')}>
          <DatePicker
            value={value.end || undefined}
            onChange={handleEndChange}
            placeholder={placeholder.end}
            dateFormat={dateFormat}
            minDate={value.start ? new Date(value.start) : minDate}
            maxDate={maxDate}
            fullWidth
          />
        </div>
      </div>

      {(error || helperText) && (
        <p className={cn(
          'text-sm',
          error ? 'text-red-600' : 'text-gray-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}

// Time Picker Component
interface TimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  helperText?: string
  value?: string
  onChange?: (time: string) => void
  fullWidth?: boolean
  showSeconds?: boolean
}

export function TimePicker({
  className = '',
  label,
  error,
  helperText,
  value,
  onChange,
  fullWidth = false,
  showSeconds = false,
  id,
  ...props
}: TimePickerProps) {
  const inputId = id || `timepicker-${Math.random().toString(36).substr(2, 9)}`

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

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

      <input
        id={inputId}
        type="time"
        value={value}
        onChange={handleChange}
        className={cn(
          'input',
          error && 'border-red-500 focus:ring-red-500',
          fullWidth && 'w-full'
        )}
        step={showSeconds ? 1 : 60}
        {...props}
      />

      {(error || helperText) && (
        <p className={cn(
          'mt-1 text-sm',
          error ? 'text-red-600' : 'text-gray-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}