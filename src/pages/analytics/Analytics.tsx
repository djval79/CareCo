import { useState, useEffect } from 'react'
import { TrendingUpIcon, UsersIcon, BriefcaseIcon, CalendarDaysIcon, ChartBarIcon, DownloadIcon } from '@heroicons/react/24/outline'
import Chart, { MetricCard, DistributionChart, TrendChart, ComparisonChart } from '@/components/ui/Chart'
import Button from '@/components/ui/Button'
import { useAppStore } from '@/store'
import { formatDate, formatCurrency } from '@/utils'

export default function Analytics() {
  const { dashboardStats } = useAppStore()
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [selectedMetric, setSelectedMetric] = useState<string>('overview')

  // Mock analytics data - replace with real API calls
  const analyticsData = {
    overview: {
      totalEmployees: 156,
      activeJobs: 23,
      pendingApplications: 45,
      upcomingInterviews: 12,
      leaveRequests: 8,
      employeeGrowth: 12.5,
      jobFillRate: 78.3,
      averageTimeToHire: 24,
      employeeSatisfaction: 4.2,
    },
    recruitment: {
      applicationsByMonth: [
        { label: 'Jan', value: 45 },
        { label: 'Feb', value: 52 },
        { label: 'Mar', value: 48 },
        { label: 'Apr', value: 61 },
        { label: 'May', value: 55 },
        { label: 'Jun', value: 67 },
      ],
      sourceDistribution: [
        { label: 'LinkedIn', value: 35, color: '#0077b5' },
        { label: 'Indeed', value: 25, color: '#2557a7' },
        { label: 'Company Website', value: 20, color: '#10b981' },
        { label: 'Referrals', value: 12, color: '#f59e0b' },
        { label: 'Other', value: 8, color: '#6b7280' },
      ],
      departmentHiring: [
        { label: 'Engineering', current: 15, previous: 12 },
        { label: 'Design', current: 8, previous: 6 },
        { label: 'Marketing', current: 5, previous: 7 },
        { label: 'Sales', current: 10, previous: 8 },
        { label: 'HR', current: 3, previous: 4 },
      ],
    },
    hr: {
      leaveTypes: [
        { label: 'Annual Leave', value: 45 },
        { label: 'Sick Leave', value: 25 },
        { label: 'Maternity Leave', value: 15 },
        { label: 'Paternity Leave', value: 10 },
        { label: 'Other', value: 5 },
      ],
      attendanceTrend: [
        { label: 'Mon', value: 94.2 },
        { label: 'Tue', value: 96.1 },
        { label: 'Wed', value: 95.8 },
        { label: 'Thu', value: 93.7 },
        { label: 'Fri', value: 92.3 },
      ],
      employeeTurnover: [
        { label: 'Q1', value: 8.5 },
        { label: 'Q2', value: 6.2 },
        { label: 'Q3', value: 9.1 },
        { label: 'Q4', value: 7.8 },
      ],
    },
    performance: {
      departmentPerformance: [
        { label: 'Engineering', value: 4.6 },
        { label: 'Design', value: 4.4 },
        { label: 'Marketing', value: 4.2 },
        { label: 'Sales', value: 4.3 },
        { label: 'HR', value: 4.5 },
      ],
      goalCompletion: [
        { label: 'Q1', value: 85 },
        { label: 'Q2', value: 92 },
        { label: 'Q3', value: 88 },
        { label: 'Q4', value: 91 },
      ],
    },
  }

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    // Mock export functionality
    console.log(`Exporting ${selectedMetric} report as ${format}`)
    // In real implementation, this would call an API endpoint
  }

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '7d': return 'Last 7 days'
      case '30d': return 'Last 30 days'
      case '90d': return 'Last 90 days'
      case '1y': return 'Last year'
      default: return 'Last 30 days'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Analytics & Insights
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Comprehensive HR analytics and business intelligence dashboard
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="input"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          <Button variant="secondary" onClick={() => exportReport('pdf')}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export PDF
          </Button>

          <Button variant="secondary" onClick={() => exportReport('excel')}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Metric Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'recruitment', label: 'Recruitment', icon: UsersIcon },
            { id: 'hr', label: 'HR Operations', icon: BriefcaseIcon },
            { id: 'performance', label: 'Performance', icon: TrendingUpIcon },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedMetric(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedMetric === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Overview Dashboard */}
      {selectedMetric === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Employees"
              value={analyticsData.overview.totalEmployees}
              change={{
                value: analyticsData.overview.employeeGrowth,
                type: 'increase',
                label: 'from last month'
              }}
              icon={UsersIcon}
            />

            <MetricCard
              title="Active Job Postings"
              value={analyticsData.overview.activeJobs}
              change={{
                value: 15.2,
                type: 'increase',
                label: 'from last month'
              }}
              icon={BriefcaseIcon}
            />

            <MetricCard
              title="Pending Applications"
              value={analyticsData.overview.pendingApplications}
              change={{
                value: 8.7,
                type: 'decrease',
                label: 'from last week'
              }}
              icon={CalendarDaysIcon}
            />

            <MetricCard
              title="Time to Hire"
              value={`${analyticsData.overview.averageTimeToHire} days`}
              change={{
                value: 12.3,
                type: 'decrease',
                label: 'improvement'
              }}
              icon={TrendingUpIcon}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendChart
              data={analyticsData.recruitment.applicationsByMonth.map(item => ({
                label: item.label,
                value: item.value,
                previousValue: item.value * 0.8, // Mock previous data
              }))}
              title="Monthly Applications Trend"
            />

            <DistributionChart
              data={analyticsData.recruitment.sourceDistribution}
              title="Application Sources"
            />
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Job Fill Rate</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {analyticsData.overview.jobFillRate}%
              </div>
              <p className="text-sm text-gray-600">
                Positions filled vs. total openings
              </p>
              <div className="mt-4 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${analyticsData.overview.jobFillRate}%` }}
                />
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Satisfaction</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {analyticsData.overview.employeeSatisfaction}/5
              </div>
              <p className="text-sm text-gray-600">
                Average rating from surveys
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-lg ${
                      star <= Math.floor(analyticsData.overview.employeeSatisfaction)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Interviews</h3>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {analyticsData.overview.upcomingInterviews}
              </div>
              <p className="text-sm text-gray-600">
                Scheduled for this week
              </p>
              <div className="mt-4 text-sm text-gray-500">
                Next: Tomorrow at 2:00 PM
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recruitment Analytics */}
      {selectedMetric === 'recruitment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendChart
              data={analyticsData.recruitment.applicationsByMonth}
              title="Monthly Applications"
            />

            <DistributionChart
              data={analyticsData.recruitment.sourceDistribution}
              title="Application Sources"
            />
          </div>

          <ComparisonChart
            data={analyticsData.recruitment.departmentHiring}
            title="Department Hiring Comparison"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Conversion Rate"
              value="24.5%"
              change={{
                value: 5.2,
                type: 'increase',
                label: 'from last month'
              }}
            />

            <MetricCard
              title="Offer Acceptance"
              value="87.3%"
              change={{
                value: 2.1,
                type: 'increase',
                label: 'from last quarter'
              }}
            />

            <MetricCard
              title="Cost per Hire"
              value={formatCurrency(4500)}
              change={{
                value: 8.7,
                type: 'decrease',
                label: 'cost reduction'
              }}
            />
          </div>
        </div>
      )}

      {/* HR Operations Analytics */}
      {selectedMetric === 'hr' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DistributionChart
              data={analyticsData.hr.leaveTypes}
              title="Leave Types Distribution"
            />

            <TrendChart
              data={analyticsData.hr.attendanceTrend}
              title="Weekly Attendance Rate (%)"
            />
          </div>

          <TrendChart
            data={analyticsData.hr.employeeTurnover}
            title="Employee Turnover Rate (%)"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Average Leave Days"
              value="18.5"
              change={{
                value: 2.3,
                type: 'increase',
                label: 'per employee'
              }}
            />

            <MetricCard
              title="Absenteeism Rate"
              value="3.2%"
              change={{
                value: 0.8,
                type: 'decrease',
                label: 'improvement'
              }}
            />

            <MetricCard
              title="Overtime Hours"
              value="1,247"
              change={{
                value: 15.6,
                type: 'decrease',
                label: 'this month'
              }}
            />
          </div>
        </div>
      )}

      {/* Performance Analytics */}
      {selectedMetric === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DistributionChart
              data={analyticsData.performance.departmentPerformance.map(item => ({
                label: item.label,
                value: item.value * 20, // Convert to percentage
                color: item.value >= 4.5 ? '#10b981' : item.value >= 4.0 ? '#f59e0b' : '#ef4444'
              }))}
              title="Department Performance Ratings"
            />

            <TrendChart
              data={analyticsData.performance.goalCompletion}
              title="Goal Completion Rate (%)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Performance Reviews"
              value="142"
              change={{
                value: 23.5,
                type: 'increase',
                label: 'completed'
              }}
            />

            <MetricCard
              title="Training Hours"
              value="3,456"
              change={{
                value: 18.7,
                type: 'increase',
                label: 'this quarter'
              }}
            />

            <MetricCard
              title="Promotion Rate"
              value="12.8%"
              change={{
                value: 3.2,
                type: 'increase',
                label: 'from last year'
              }}
            />
          </div>
        </div>
      )}

      {/* Report Footer */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Report Summary</h3>
            <p className="text-sm text-gray-600 mt-1">
              Analytics for {getTimeRangeLabel()} • Generated on {formatDate(new Date())}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary" size="sm">
              Schedule Report
            </Button>
            <Button variant="secondary" size="sm">
              Share Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}