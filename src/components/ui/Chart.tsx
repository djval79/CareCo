import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js'
import {
  Line,
  Bar,
  Doughnut,
  Pie,
  Radar,
  Scatter,
  Bubble,
} from 'react-chartjs-2'
import { cn } from '@/utils'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
)

interface ChartProps {
  type: 'line' | 'bar' | 'doughnut' | 'pie' | 'radar' | 'scatter' | 'bubble'
  data: any
  options?: any
  className?: string
  height?: number
  width?: number
  responsive?: boolean
  maintainAspectRatio?: boolean
}

export default function Chart({
  type,
  data,
  options = {},
  className = '',
  height,
  width,
  responsive = true,
  maintainAspectRatio = true,
}: ChartProps) {
  const defaultOptions = {
    responsive,
    maintainAspectRatio,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: type !== 'doughnut' && type !== 'pie' && type !== 'radar' ? {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    } : undefined,
    ...options,
  }

  const chartProps = {
    data,
    options: defaultOptions,
    height,
    width,
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line {...chartProps} />
      case 'bar':
        return <Bar {...chartProps} />
      case 'doughnut':
        return <Doughnut {...chartProps} />
      case 'pie':
        return <Pie {...chartProps} />
      case 'radar':
        return <Radar {...chartProps} />
      case 'scatter':
        return <Scatter {...chartProps} />
      case 'bubble':
        return <Bubble {...chartProps} />
      default:
        return <div className="text-red-500">Unsupported chart type: {type}</div>
    }
  }

  return (
    <div className={cn('chart-container', className)}>
      {renderChart()}
    </div>
  )
}

// Pre-configured chart components for common use cases
interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
    label?: string
  }
  icon?: React.ComponentType<{ className?: string }>
  className?: string
  'data-testid'?: string
}

export function MetricCard({ title, value, change, icon: Icon, className, 'data-testid': dataTestId }: MetricCardProps) {
  const getChangeColor = (type: string) => {
    switch (type) {
      case 'increase':
        return 'text-green-600'
      case 'decrease':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'increase':
        return '↗'
      case 'decrease':
        return '↘'
      default:
        return '→'
    }
  }

  return (
    <div className={cn('card', className)} data-testid={dataTestId}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={cn('text-sm flex items-center mt-1', getChangeColor(change.type))}>
              <span className="mr-1">{getChangeIcon(change.type)}</span>
              {Math.abs(change.value)}%
              {change.label && <span className="ml-1">{change.label}</span>}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-gray-100">
            <Icon className="h-6 w-6 text-gray-600" />
          </div>
        )}
      </div>
    </div>
  )
}

interface ProgressRingProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  showValue?: boolean
  label?: string
  className?: string
}

export function ProgressRing({
  value,
  max,
  size = 100,
  strokeWidth = 8,
  color = '#0ea5e9',
  backgroundColor = '#e5e7eb',
  showValue = true,
  label,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = Math.min((value / max) * 100, 100)
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-in-out"
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-900">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
      {label && (
        <p className="text-sm text-gray-600 mt-2 text-center">{label}</p>
      )}
    </div>
  )
}

interface TrendChartProps {
  data: Array<{
    label: string
    value: number
    previousValue?: number
  }>
  title?: string
  className?: string
}

export function TrendChart({ data, title, className }: TrendChartProps) {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: 'Current',
        data: data.map(item => item.value),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
        fill: true,
      },
      ...(data.some(item => item.previousValue !== undefined) ? [{
        label: 'Previous',
        data: data.map(item => item.previousValue || 0),
        borderColor: '#94a3b8',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
      }] : []),
    ],
  }

  const options = {
    plugins: {
      legend: {
        display: data.some(item => item.previousValue !== undefined),
      },
    },
  }

  return (
    <div className={cn('card', className)}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      )}
      <Chart type="line" data={chartData} options={options} />
    </div>
  )
}

interface DistributionChartProps {
  data: Array<{
    label: string
    value: number
    color?: string
  }>
  title?: string
  type?: 'doughnut' | 'pie'
  className?: string
}

export function DistributionChart({ data, title, type = 'doughnut', className }: DistributionChartProps) {
  const colors = [
    '#0ea5e9', // primary
    '#10b981', // green
    '#f59e0b', // yellow
    '#ef4444', // red
    '#8b5cf6', // purple
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
  ]

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map((item, index) => item.color || colors[index % colors.length]),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  }

  return (
    <div className={cn('card', className)}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      )}
      <Chart type={type} data={chartData} options={options} />
    </div>
  )
}

interface ComparisonChartProps {
  data: Array<{
    label: string
    current: number
    previous: number
  }>
  title?: string
  className?: string
}

export function ComparisonChart({ data, title, className }: ComparisonChartProps) {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: 'Current Period',
        data: data.map(item => item.current),
        backgroundColor: '#0ea5e9',
        borderColor: '#0ea5e9',
        borderWidth: 1,
      },
      {
        label: 'Previous Period',
        data: data.map(item => item.previous),
        backgroundColor: '#94a3b8',
        borderColor: '#94a3b8',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className={cn('card', className)}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      )}
      <Chart type="bar" data={chartData} options={options} />
    </div>
  )
}