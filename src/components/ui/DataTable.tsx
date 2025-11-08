import React, { useState, useMemo } from 'react'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/utils'
import Button from './Button'
import Input from './Input'
import Select from './Select'

export interface TableColumn<T = any> {
  key: keyof T | string
  label: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T, index: number) => React.ReactNode
  filterOptions?: { value: string; label: string }[]
}

export interface DataTableProps<T = any> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  searchable?: boolean
  filterable?: boolean
  sortable?: boolean
  selectable?: boolean
  pagination?: {
    enabled: boolean
    pageSize?: number
    pageSizeOptions?: number[]
  }
  exportable?: boolean
  actions?: (row: T) => React.ReactNode
  onRowClick?: (row: T) => void
  onSelectionChange?: (selectedRows: T[]) => void
  className?: string
  emptyMessage?: string
  'data-testid'?: string
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = true,
  filterable = true,
  sortable = true,
  selectable = false,
  pagination = { enabled: true, pageSize: 10, pageSizeOptions: [10, 25, 50, 100] },
  exportable = true,
  actions,
  onRowClick,
  onSelectionChange,
  className,
  emptyMessage = 'No data available',
  'data-testid': dataTestId,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(pagination.pageSize || 10)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = data

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(row =>
        columns.some(column => {
          const value = row[column.key as keyof T]
          return String(value).toLowerCase().includes(searchTerm.toLowerCase())
        })
      )
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(row => {
          const rowValue = row[key as keyof T]
          return String(rowValue).toLowerCase().includes(value.toLowerCase())
        })
      }
    })

    return filtered
  }, [data, searchTerm, filters, columns])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortable) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn as keyof T]
      const bValue = b[sortColumn as keyof T]

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortColumn, sortDirection, sortable])

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination.enabled) return sortedData

    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize, pagination.enabled])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (!sortable) return

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  // Handle filtering
  const handleFilter = (columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(paginatedData.map(row => row.id || row._id))
      setSelectedRows(allIds)
      onSelectionChange?.(paginatedData)
    } else {
      setSelectedRows(new Set())
      onSelectionChange?.([])
    }
  }

  const handleSelectRow = (row: T, checked: boolean) => {
    const rowId = row.id || row._id
    const newSelected = new Set(selectedRows)

    if (checked) {
      newSelected.add(rowId)
    } else {
      newSelected.delete(rowId)
    }

    setSelectedRows(newSelected)
    onSelectionChange?.(paginatedData.filter(r => newSelected.has(r.id || r._id)))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }

  // Export functionality
  const handleExport = (format: 'csv' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting ${sortedData.length} rows as ${format}`)
    // In real implementation, this would generate and download the file
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)} data-testid={dataTestId}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={MagnifyingGlassIcon}
                fullWidth
              />
            </div>
          )}

          {/* Filters */}
          {filterable && (
            <div className="flex gap-2">
              {columns
                .filter(column => column.filterable)
                .slice(0, 3) // Show only first 3 filters to avoid clutter
                .map(column => (
                  <Select
                    key={column.key as string}
                    placeholder={`Filter ${column.label}`}
                    options={column.filterOptions || []}
                    value={filters[column.key as string] || ''}
                    onChange={(value) => handleFilter(column.key as string, value)}
                    className="min-w-[150px]"
                  />
                ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {exportable && (
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                icon={ArrowDownTrayIcon}
                onClick={() => handleExport('csv')}
              >
                Export
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Selection column */}
              {selectable && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}

              {/* Data columns */}
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.sortable && sortable && 'cursor-pointer hover:bg-gray-100',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.width && `w-${column.width}`
                  )}
                  onClick={() => column.sortable && handleSort(column.key as string)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && sortable && (
                      <div className="ml-1">
                        {sortColumn === column.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUpIcon className="h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                          )
                        ) : (
                          <div className="h-4 w-4 flex flex-col">
                            <ChevronUpIcon className="h-2 w-2 -mb-1 opacity-50" />
                            <ChevronDownIcon className="h-2 w-2 opacity-50" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}

              {/* Actions column */}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={row.id || row._id || index}
                  className={cn(
                    'hover:bg-gray-50',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {/* Selection column */}
                  {selectable && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={selectedRows.has(row.id || row._id)}
                        onChange={(e) => handleSelectRow(row, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}

                  {/* Data columns */}
                  {columns.map((column) => {
                    const value = row[column.key as keyof T]
                    const renderedValue = column.render
                      ? column.render(value, row, index)
                      : value

                    return (
                      <td
                        key={column.key as string}
                        className={cn(
                          'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {renderedValue}
                      </td>
                    )
                  })}

                  {/* Actions column */}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.enabled && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
            </span>
            {pagination.pageSizeOptions && (
              <Select
                value={pageSize.toString()}
                onChange={(value) => handlePageSizeChange(Number(value))}
                options={pagination.pageSizeOptions.map(size => ({
                  value: size.toString(),
                  label: `${size} per page`
                }))}
                className="ml-4"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              icon={ChevronLeftIcon}
            >
              Previous
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={cn(
                      'px-3 py-1 text-sm rounded',
                      currentPage === pageNumber
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {pageNumber}
                  </button>
                )
              })}
            </div>

            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              icon={ChevronRightIcon}
              iconPosition="right"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable