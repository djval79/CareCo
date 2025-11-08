import React, { useState } from 'react'
import { useForm, UseFormReturn, FieldValues, SubmitHandler, Path, FieldError } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from './Button'
import Input from './Input'
import { cn } from '@/utils'

// Form Context
interface FormContextValue<T extends FieldValues = any> {
  form: UseFormReturn<T>
}

const FormContext = React.createContext<FormContextValue | null>(null)

export function useFormContext<T extends FieldValues = any>(): FormContextValue<T> {
  const context = React.useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a Form component')
  }
  return context
}

// Main Form Component
interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>
  onSubmit: SubmitHandler<T>
  children: React.ReactNode
  className?: string
}

export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: FormProps<T>) {
  return (
    <FormContext.Provider value={{ form }}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

// Form Field Component
interface FormFieldProps<T extends FieldValues> {
  name: Path<T>
  children: (field: any) => React.ReactNode
}

export function FormField<T extends FieldValues>({ name, children }: FormFieldProps<T>) {
  const { form } = useFormContext<T>()
  const field = form.register(name)
  const error = form.formState.errors[name] as FieldError | undefined

  return (
    <div className="space-y-1">
      {children({ field, error })}
    </div>
  )
}

// Form Item Component
interface FormItemProps {
  children: React.ReactNode
  className?: string
}

export function FormItem({ children, className }: FormItemProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  )
}

// Form Label Component
interface FormLabelProps {
  children: React.ReactNode
  className?: string
  required?: boolean
}

export function FormLabel({ children, className, required }: FormLabelProps) {
  return (
    <label className={cn('text-sm font-medium text-gray-700', className)}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}

// Form Control Component
interface FormControlProps {
  children: React.ReactNode
  error?: FieldError
}

export function FormControl({ children, error }: FormControlProps) {
  return (
    <div className="space-y-1">
      {children}
      {error && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}
    </div>
  )
}

// Form Message Component
interface FormMessageProps {
  error?: FieldError
  className?: string
}

export function FormMessage({ error, className }: FormMessageProps) {
  if (!error) return null

  return (
    <p className={cn('text-sm text-red-600', className)}>
      {error.message}
    </p>
  )
}

// Form Actions Component
interface FormActionsProps {
  children: React.ReactNode
  className?: string
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={cn('flex justify-end gap-3 pt-4 border-t', className)}>
      {children}
    </div>
  )
}

// Hook for creating forms with validation
export function useFormWithValidation<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  defaultValues?: Partial<T>
) {
  return useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  })
}

// Pre-built Form Components
export const FormInput = React.forwardRef<
  HTMLInputElement,
  {
    name: string
    label?: string
    placeholder?: string
    type?: string
    required?: boolean
    className?: string
  }
>(({ name, label, ...props }, ref) => (
  <FormField name={name}>
    {({ field, error }) => (
      <FormItem>
        {label && <FormLabel required={props.required}>{label}</FormLabel>}
        <FormControl error={error}>
          <Input
            {...field}
            {...props}
            ref={ref}
            error={error?.message}
          />
        </FormControl>
      </FormItem>
    )}
  </FormField>
))

FormInput.displayName = 'FormInput'

export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  {
    name: string
    label?: string
    placeholder?: string
    required?: boolean
    rows?: number
    className?: string
  }
>(({ name, label, ...props }, ref) => (
  <FormField name={name}>
    {({ field, error }) => (
      <FormItem>
        {label && <FormLabel required={props.required}>{label}</FormLabel>}
        <FormControl error={error}>
          <Input.Textarea
            {...field}
            {...props}
            ref={ref}
            error={error?.message}
          />
        </FormControl>
      </FormItem>
    )}
  </FormField>
))

FormTextarea.displayName = 'FormTextarea'

export const FormSelect = React.forwardRef<
  HTMLSelectElement,
  {
    name: string
    label?: string
    placeholder?: string
    required?: boolean
    options: Array<{ value: string | number; label: string }>
    className?: string
  }
>(({ name, label, options, ...props }, ref) => (
  <FormField name={name}>
    {({ field, error }) => (
      <FormItem>
        {label && <FormLabel required={props.required}>{label}</FormLabel>}
        <FormControl error={error}>
          <Input.Select
            {...field}
            {...props}
            ref={ref}
            options={options}
            error={error?.message}
          />
        </FormControl>
      </FormItem>
    )}
  </FormField>
))

FormSelect.displayName = 'FormSelect'

export const FormCheckbox = React.forwardRef<
  HTMLInputElement,
  {
    name: string
    label?: string
    required?: boolean
    className?: string
  }
>(({ name, label, ...props }, ref) => (
  <FormField name={name}>
    {({ field, error }) => (
      <FormControl error={error}>
        <Input.Checkbox
          {...field}
          {...props}
          ref={ref}
          label={label}
        />
      </FormControl>
    )}
  </FormField>
))

FormCheckbox.displayName = 'FormCheckbox'

// Form Section Component
interface FormSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {(title || description) && (
        <div>
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

// Form Grid Component
interface FormGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function FormGrid({ children, columns = 2, gap = 'md', className }: FormGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const gapSizes = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  }

  return (
    <div className={cn('grid', gridCols[columns], gapSizes[gap], className)}>
      {children}
    </div>
  )
}

// Export all components
export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormActions,
  FormSection,
  FormGrid,
  useFormWithValidation,
}