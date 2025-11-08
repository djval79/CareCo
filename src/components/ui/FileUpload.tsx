import React, { useState, useCallback, useRef } from 'react'
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon, PhotoIcon, FilmIcon, MusicalNoteIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils'

interface FileUploadProps {
  label?: string
  error?: string
  helperText?: string
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in bytes
  disabled?: boolean
  value?: File[]
  onChange?: (files: File[]) => void
  onRemove?: (index: number) => void
  className?: string
  variant?: 'default' | 'compact' | 'image'
  showPreview?: boolean
  previewSize?: 'sm' | 'md' | 'lg'
}

export default function FileUpload({
  label,
  error,
  helperText,
  accept = '*',
  multiple = false,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
  value = [],
  onChange,
  onRemove,
  className = '',
  variant = 'default',
  showPreview = true,
  previewSize = 'md',
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`
    }

    if (accept !== '*' && accept !== '') {
      const acceptedTypes = accept.split(',').map(type => type.trim().toLowerCase())
      const fileType = file.type.toLowerCase()
      const fileName = file.name.toLowerCase()

      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileName.endsWith(type)
        }
        return fileType === type || fileType.startsWith(type.replace('*', ''))
      })

      if (!isAccepted) {
        return `File type not accepted. Accepted types: ${accept}`
      }
    }

    return null
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles: File[] = []

    for (const file of droppedFiles) {
      const error = validateFile(file)
      if (error) {
        // In a real app, show toast notification
        console.error(`File ${file.name}: ${error}`)
        continue
      }
      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      const newFiles = multiple ? [...value, ...validFiles].slice(0, maxFiles) : validFiles.slice(0, 1)
      onChange?.(newFiles)
    }
  }, [disabled, multiple, value, maxFiles, onChange, validateFile])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const validFiles: File[] = []

    for (const file of selectedFiles) {
      const error = validateFile(file)
      if (error) {
        console.error(`File ${file.name}: ${error}`)
        continue
      }
      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      const newFiles = multiple ? [...value, ...validFiles].slice(0, maxFiles) : validFiles.slice(0, 1)
      onChange?.(newFiles)
    }

    // Reset input
    e.target.value = ''
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index)
    onChange?.(newFiles)
    onRemove?.(index)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file: File) => {
    const type = file.type.toLowerCase()

    if (type.startsWith('image/')) {
      return PhotoIcon
    } else if (type.startsWith('video/')) {
      return FilmIcon
    } else if (type.startsWith('audio/')) {
      return MusicalNoteIcon
    } else {
      return DocumentIcon
    }
  }

  const getPreviewSize = () => {
    const sizes = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
    }
    return sizes[previewSize]
  }

  const renderFilePreview = (file: File, index: number) => {
    const Icon = getFileIcon(file)
    const isImage = file.type.startsWith('image/')

    return (
      <div
        key={index}
        className={cn(
          'flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border',
          variant === 'compact' ? 'p-2' : 'p-3'
        )}
      >
        {showPreview && (
          <div className={cn('flex-shrink-0 rounded-lg overflow-hidden bg-white border', getPreviewSize())}>
            {isImage ? (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-full object-cover"
                onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <p className="text-sm text-gray-500">
            {formatFileSize(file.size)}
          </p>
          {uploadProgress[file.name] !== undefined && (
            <div className="mt-1">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress[file.name]}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {uploadProgress[file.name]}% uploaded
              </p>
            </div>
          )}
        </div>

        {!disabled && (
          <button
            type="button"
            onClick={() => handleRemoveFile(index)}
            className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    )
  }

  const dropzoneClasses = cn(
    'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors',
    isDragOver ? 'border-primary-400 bg-primary-50' : 'border-gray-300',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400',
    error && 'border-red-300',
    className
  )

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Dropzone */}
      <div
        className={dropzoneClasses}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <CloudArrowUpIcon className="w-12 h-12 text-gray-400" />
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragOver ? 'Drop files here' : 'Upload files'}
            </p>
            <p className="text-sm text-gray-500">
              Drag and drop files here, or click to select
            </p>
          </div>

          <div className="text-xs text-gray-400">
            {accept !== '*' && accept !== '' && (
              <p>Accepted types: {accept}</p>
            )}
            <p>Maximum file size: {formatFileSize(maxSize)}</p>
            {multiple && <p>Maximum files: {maxFiles}</p>}
          </div>
        </div>
      </div>

      {/* File List */}
      {value.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            {multiple ? `Uploaded files (${value.length})` : 'Uploaded file'}
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {value.map((file, index) => renderFilePreview(file, index))}
          </div>
        </div>
      )}

      {/* Error and Helper Text */}
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

// Image Upload Component (specialized for images)
interface ImageUploadProps extends Omit<FileUploadProps, 'accept' | 'variant'> {
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto'
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

export function ImageUpload({
  aspectRatio = 'auto',
  maxWidth,
  maxHeight,
  quality = 0.8,
  ...props
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([])

  const handleImageChange = (files: File[]) => {
    props.onChange?.(files)

    // Generate previews
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(newPreviews)

    // Clean up previous previews
    setPreviews(prev => {
      prev.forEach(url => URL.revokeObjectURL(url))
      return newPreviews
    })
  }

  const aspectRatioClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    auto: 'aspect-auto',
  }

  return (
    <div className="space-y-4">
      <FileUpload
        {...props}
        accept="image/*"
        variant="image"
        onChange={handleImageChange}
      />

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div
              key={index}
              className={cn(
                'relative rounded-lg overflow-hidden border-2 border-gray-200',
                aspectRatioClasses[aspectRatio]
              )}
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  const newFiles = props.value?.filter((_, i) => i !== index) || []
                  props.onChange?.(newFiles)
                  setPreviews(prev => prev.filter((_, i) => i !== index))
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Document Upload Component (specialized for documents)
interface DocumentUploadProps extends Omit<FileUploadProps, 'accept'> {
  allowedTypes?: string[]
}

export function DocumentUpload({
  allowedTypes = ['.pdf', '.doc', '.docx', '.txt'],
  ...props
}: DocumentUploadProps) {
  const acceptString = allowedTypes.join(',')

  return (
    <FileUpload
      {...props}
      accept={acceptString}
      helperText={`Accepted formats: ${allowedTypes.join(', ')}`}
    />
  )
}