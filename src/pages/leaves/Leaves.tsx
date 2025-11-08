import { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import DataTable, { TableColumn } from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { formatDate } from '@/utils'

interface Leave {
  id: string
  employeeName: string
  employeeId: string
  type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'personal' | 'other'
  startDate: string
  endDate: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  appliedDate: string
  approvedBy?: string
  approvedDate?: string
}

export default function Leaves() {
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null)
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    type: 'annual' as Leave['type'],
    startDate: '',
    endDate: '',
    reason: '',
    status: 'pending' as Leave['status'],
  })

  // Calculate days when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (start <= end) {
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
        // Days will be calculated in handleSubmit
      }
    }
  }, [formData.startDate, formData.endDate])

  // Mock data - replace with API calls
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const mockLeaves: Leave[] = [
        {
          id: '1',
          employeeName: 'John Doe',
          employeeId: 'EMP001',
          type: 'annual',
          startDate: '2024-01-15',
          endDate: '2024-01-20',
          days: 6,
          reason: 'Family vacation',
          status: 'pending',
          appliedDate: '2024-01-10',
        },
        {
          id: '2',
          employeeName: 'Jane Smith',
          employeeId: 'EMP002',
          type: 'sick',
          startDate: '2024-01-12',
          endDate: '2024-01-12',
          days: 1,
          reason: 'Medical appointment',
          status: 'approved',
          appliedDate: '2024-01-11',
          approvedBy: 'Manager',
          approvedDate: '2024-01-11',
        },
        {
          id: '3',
          employeeName: 'Mike Johnson',
          employeeId: 'EMP003',
          type: 'personal',
          startDate: '2024-01-18',
          endDate: '2024-01-18',
          days: 1,
          reason: 'Personal matter',
          status: 'rejected',
          appliedDate: '2024-01-14',
          approvedBy: 'Manager',
          approvedDate: '2024-01-15',
        },
      ]
      setLeaves(mockLeaves)
      setLoading(false)
    }, 500)
  }, [])

  const columns: TableColumn<Leave>[] = [
    {
      key: 'employeeName',
      label: 'Employee',
      sortable: true,
      filterable: true,
      render: (value, leave) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{leave.employeeId}</div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
          {value}
        </span>
      ),
    },
    {
      key: 'startDate',
      label: 'Start Date',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'endDate',
      label: 'End Date',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'days',
      label: 'Days',
      sortable: true,
      align: 'center',
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const colors = {
          pending: 'bg-yellow-100 text-yellow-800',
          approved: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800',
          cancelled: 'bg-gray-100 text-gray-800',
        }
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${colors[value as keyof typeof colors]}`}>
            {value}
          </span>
        )
      },
    },
    {
      key: 'appliedDate',
      label: 'Applied',
      sortable: true,
      render: (value) => formatDate(value),
    },
  ]

  const handleAddLeave = () => {
    setEditingLeave(null)
    setFormData({
      employeeName: '',
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
      employeeName: leave.employeeName,
      employeeId: leave.employeeId,
      type: leave.type,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      status: leave.status,
    })
    setShowModal(true)
  }

  const handleDeleteLeave = (leave: Leave) => {
    if (window.confirm(`Are you sure you want to delete this leave request?`)) {
      setLeaves(prev => prev.filter(l => l.id !== leave.id))
    }
  }

  const handleApproveLeave = (leave: Leave) => {
    setLeaves(prev => prev.map(l =>
      l.id === leave.id
        ? {
            ...l,
            status: 'approved',
            approvedBy: 'Manager',
            approvedDate: new Date().toISOString().split('T')[0]
          }
        : l
    ))
  }

  const handleRejectLeave = (leave: Leave) => {
    setLeaves(prev => prev.map(l =>
      l.id === leave.id
        ? {
            ...l,
            status: 'rejected',
            approvedBy: 'Manager',
            approvedDate: new Date().toISOString().split('T')[0]
          }
        : l
    ))
  }

  const handleSubmit = () => {
    // Calculate days between start and end date
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    if (editingLeave) {
      // Update existing leave
      setLeaves(prev => prev.map(l =>
        l.id === editingLeave.id
          ? { ...l, ...formData, days }
          : l
      ))
    } else {
      // Add new leave
      const newLeave: Leave = {
        id: Date.now().toString(),
        ...formData,
        days,
        appliedDate: new Date().toISOString().split('T')[0],
      }
      setLeaves(prev => [...prev, newLeave])
    }
    setShowModal(false)
  }

  const handleExport = () => {
    console.log('Exporting leaves...')
    // In real implementation, this would export to CSV/Excel
  }

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
            Add Leave
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
                  {leaves.length}
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
                  {leaves.filter(l => l.status === 'pending').length}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Pending
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {leaves.filter(l => l.status === 'pending').length}
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
                  {leaves.filter(l => l.status === 'approved').length}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Approved
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {leaves.filter(l => l.status === 'approved').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-sm font-medium">
                  {leaves.filter(l => l.status === 'rejected').length}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Rejected
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {leaves.filter(l => l.status === 'rejected').length}
                </dd>
              </dl>
            </div>
          </div>
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
                    data-testid={`approve-leave-${leave.id}`}
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRejectLeave(leave)}
                    className="text-red-600 hover:text-red-700"
                    data-testid={`reject-leave-${leave.id}`}
                  >
                    <XCircleIcon className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditLeave(leave)}
                data-testid={`edit-leave-${leave.id}`}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteLeave(leave)}
                data-testid={`delete-leave-${leave.id}`}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
          emptyMessage="No leave requests found. Add your first leave request to get started."
          data-testid="leaves-table"
        />
      </div>

      {/* Add/Edit Leave Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingLeave ? 'Edit Leave Request' : 'Add Leave Request'}
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Employee Name"
              value={formData.employeeName}
              onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
              required
            />

            <Input
              label="Employee ID"
              value={formData.employeeId}
              onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Leave Type"
              options={[
                { value: 'annual', label: 'Annual Leave' },
                { value: 'sick', label: 'Sick Leave' },
                { value: 'maternity', label: 'Maternity Leave' },
                { value: 'paternity', label: 'Paternity Leave' },
                { value: 'personal', label: 'Personal Leave' },
                { value: 'other', label: 'Other' },
              ]}
              value={formData.type}
              onChange={(value) => setFormData(prev => ({ ...prev, type: value as Leave['type'] }))}
              required
              data-testid="leave-type"
            />

            <Select
              label="Status"
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              value={formData.status}
              onChange={(value) => setFormData(prev => ({ ...prev, status: value as Leave['status'] }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              required
              data-testid="start-date"
            />

            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              required
              data-testid="end-date"
            />
          </div>

          <Textarea
            label="Reason"
            value={formData.reason}
            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
            rows={3}
            required
            data-testid="leave-reason"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} data-testid="submit-leave">
            {editingLeave ? 'Update Leave' : 'Submit Leave'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}