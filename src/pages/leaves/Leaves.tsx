import { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  UserIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'
import DataTable, { TableColumn } from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useAppStore } from '@/store'
import { Leave, Employee } from '@/types'
import { formatDate, getStatusColor, calculateDaysDifference } from '@/utils'

export default function Leaves() {
  const { employees } = useAppStore()
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null)
  const [formData, setFormData] = useState({
    employeeId: '',
    type: 'annual' as const,
    startDate: '',
    endDate: '',
    reason: '',
    status: 'pending' as const,
  })

  // Mock data - replace with API calls
  useEffect(() => {
    const mockLeaves: Leave[] = [
      {
        id: '1',
        employeeId: '1',
        type: 'annual',
        startDate: '2023-12-20',
        endDate: '2023-12-22',
        days: 3,
        reason: 'Family vacation',
        status: 'approved',
        approverId: 'admin',
        approvedAt: '2023-12-15T10:00:00Z',
        createdAt: '2023-12-10T00:00:00Z',
        updatedAt: '2023-12-15T10:00:00Z',
      },
      {
        id: '2',
        employeeId: '2',
        type: 'sick',
        startDate: '2023-12-18',
        endDate: '2023-12-18',
        days: 1,
        reason: 'Medical appointment',
        status: 'pending',
        createdAt: '2023-12-15T00:00:00Z',
        updatedAt: '2023-12-15T00:00:00Z',
      },
      {
        id: '3',
        employeeId: '3',
        type: 'annual',
        startDate: '2024-01-05',
        endDate: '2024-01-12',
        days: 8,
        reason: 'Winter holiday',
        status: 'pending',
        createdAt: '2023-12-12T00:00:00Z',
        updatedAt: '2023-12-12T00:00:00Z',
      },
      {
        id: '4',
        employeeId: '1',
        type: 'maternity',
        startDate: '2024-02-01',
        endDate: '2024-05-01',
        days: 90,
        reason: 'Maternity leave',
        status: 'approved',
        approverId: 'admin',
        approvedAt: '2023-12-01T14:30:00Z',
        createdAt: '2023-11-15T00:00:00Z',
        updatedAt: '2023-12-01T14:30:00Z',
      },
    ]
    setLeaves(mockLeaves)
  }, [])

  const columns: TableColumn<Leave>[] = [
    {
      key: 'employee',
      label: 'Employee',
      render: (_, leave) => {
        const employee = employees.find(e => e.id === leave.employeeId)
        return employee ? (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {employee.firstName[0]}{employee.lastName[0]}
              </span>
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium text-gray-900">
                {employee.firstName} {employee.lastName}
              </div>
              <div className="text-sm text-gray-500">{employee.email}</div>
            </div>
          </div>
        ) : 'Unknown Employee'
      },
    },
    {
      key: 'type',
      label: 'Leave Type',
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
          {value?.replace('-', ' ')}
        </span>
      ),
    },
    {
      key: 'dateRange',
      label: 'Date Range',
      render: (_, leave) => (
        <div>
          <div className="text-sm text-gray-900">
            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
          </div>
          <div className="text-sm text-gray-500">
            {leave.days} day{leave.days !== 1 ? 's' : ''}
          </div>
        </div>
      ),
    },
    {
      key: 'reason',
      label: 'Reason',
      render: (value) => (
        <div className="max-w-xs truncate text-sm text-gray-900" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </span>
      ),
    },
    {
      key: 'approvedAt',
      label: 'Approved Date',
      render: (value) => value ? formatDate(value) : '-',
    },
  ]

  const handleAddLeave = () => {
    setEditingLeave(null)
    setFormData({
      employeeId: '',
      type: 'annual',
      startDate: '',
      endDate: '',
      reason: '',
      status: 'pending',
    })
    setShowModal(true)
  }

  const handleEditLeave = (leave: Leave) => {
    setEditingLeave(leave)
    setFormData({
      employeeId: leave.employeeId,
      type: leave.type,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      status: leave.status,
    })
    setShowModal(true)
  }

  const handleApproveLeave = (leave: Leave) => {
    setLeaves(prev => prev.map(l =>
      l.id === leave.id
        ? {
            ...l,
            status: 'approved',
            approverId: 'admin', // In real app, this would be current user
            approvedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : l
    ))
  }

  const handleRejectLeave = (leave: Leave) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (reason !== null) {
      setLeaves(prev => prev.map(l =>
        l.id === leave.id
          ? {
              ...l,
              status: 'rejected',
              updatedAt: new Date().toISOString()
            }
          : l
      ))
    }
  }

  const handleSubmit = () => {
    const days = calculateDaysDifference(formData.startDate, formData.endDate) + 1

    if (editingLeave) {
      // Update existing leave
      setLeaves(prev => prev.map(l =>
        l.id === editingLeave.id
          ? { ...l, ...formData, days, updatedAt: new Date().toISOString() }
          : l
      ))
    } else {
      // Add new leave
      const newLeave: Leave = {
        id: Date.now().toString(),
        ...formData,
        days,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setLeaves(prev => [...prev, newLeave])
    }
    setShowModal(false)
  }

  const handleExport = () => {
    console.log('Exporting leaves...')
    // In real implementation, this would export to CSV/Excel
  }

  const employeeOptions = employees.map(employee => ({
    value: employee.id,
    label: `${employee.firstName} ${employee.lastName}`,
  }))

  // Statistics
  const totalLeaves = leaves.length
  const pendingLeaves = leaves.filter(l => l.status === 'pending')
  const approvedLeaves = leaves.filter(l => l.status === 'approved')
  const totalDays = leaves
    .filter(l => l.status === 'approved')
    .reduce((sum, l) => sum + l.days, 0)

  // Leave types distribution
  const leaveTypes = leaves.reduce((acc, leave) => {
    acc[leave.type] = (acc[leave.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Leave Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage employee leave requests and approvals.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <Button variant="secondary" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddLeave}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Request Leave
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarDaysIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Requests
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {totalLeaves}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-medium">
                  {pendingLeaves.length}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Pending Approval
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {pendingLeaves.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-sm font-medium">
                  {approvedLeaves.length}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Approved
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {approvedLeaves.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">
                  {totalDays}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Leave Days
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {totalDays}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Types Overview */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Leave Types Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(leaveTypes).map(([type, count]) => (
            <div key={type} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-500 capitalize">{type.replace('-', ' ')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaves Table */}
      <div className="card">
        <DataTable
          data={leaves}
          columns={columns}
          loading={loading}
          searchable
          filterable
          sortable
          pagination={{ enabled: true }}
          actions={(leave) => (
            <div className="flex items-center space-x-2">
              {leave.status === 'pending' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleApproveLeave(leave)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRejectLeave(leave)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircleIcon className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditLeave(leave)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
          emptyMessage="No leave requests found. Create your first leave request."
          data-testid="leaves-table"
        />
      </div>

      {/* Add/Edit Leave Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingLeave ? 'Edit Leave Request' : 'New Leave Request'}
        size="md"
      >
        <div className="space-y-6">
          <Select
            label="Employee"
            options={employeeOptions}
            value={formData.employeeId}
            onChange={(value) => setFormData(prev => ({ ...prev, employeeId: value }))}
            placeholder="Select employee"
            required
          />

          <Select
            label="Leave Type"
            options={[
              { value: 'annual', label: 'Annual Leave' },
              { value: 'sick', label: 'Sick Leave' },
              { value: 'maternity', label: 'Maternity Leave' },
              { value: 'paternity', label: 'Paternity Leave' },
              { value: 'unpaid', label: 'Unpaid Leave' },
              { value: 'other', label: 'Other' },
            ]}
            value={formData.type}
            onChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              required
            />

            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              required
            />
          </div>

          {formData.startDate && formData.endDate && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">
                Duration: {calculateDaysDifference(formData.startDate, formData.endDate) + 1} days
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              className="input w-full h-24 resize-none"
              placeholder="Please provide a reason for your leave request..."
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              required
            />
          </div>

          {editingLeave && (
            <Select
              label="Status"
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ]}
              value={formData.status}
              onChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              required
            />
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editingLeave ? 'Update Request' : 'Submit Request'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}