import { useState, useEffect } from 'react'
import {
  PlusIcon,
  ClockIcon,
  UserIcon,
  CalendarDaysIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import DataTable, { TableColumn } from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useAppStore } from '@/store'
import { Attendance, Employee } from '@/types'
import { formatDate, formatDateTime, getStatusColor } from '@/utils'

export default function Attendances() {
  const { employees } = useAppStore()
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null)
  const [formData, setFormData] = useState({
    employeeId: '',
    date: '',
    checkIn: '',
    checkOut: '',
    status: 'present' as const,
    notes: '',
  })

  // Mock data - replace with API calls
  useEffect(() => {
    const mockAttendances: Attendance[] = []
    const today = new Date()

    // Generate attendance data for the last 30 days for each employee
    employees.forEach(employee => {
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        // Skip weekends for simplicity
        if (date.getDay() === 0 || date.getDay() === 6) continue

        // Random attendance status
        const statuses: Attendance['status'][] = ['present', 'absent', 'late', 'half-day']
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

        let checkIn = '09:00'
        let checkOut = '17:00'
        let totalHours = 8

        if (randomStatus === 'late') {
          checkIn = '09:30'
          totalHours = 7.5
        } else if (randomStatus === 'half-day') {
          checkOut = '13:00'
          totalHours = 4
        } else if (randomStatus === 'absent') {
          checkIn = ''
          checkOut = ''
          totalHours = 0
        }

        const breakTime = randomStatus === 'present' || randomStatus === 'late' ? 1 : 0

        mockAttendances.push({
          id: `${employee.id}-${date.toISOString().split('T')[0]}`,
          employeeId: employee.id,
          date: date.toISOString().split('T')[0],
          checkIn: checkIn ? `${date.toISOString().split('T')[0]}T${checkIn}:00Z` : '',
          checkOut: checkOut ? `${date.toISOString().split('T')[0]}T${checkOut}:00Z` : '',
          breakTime,
          totalHours,
          status: randomStatus,
          notes: randomStatus === 'late' ? 'Traffic delay' : randomStatus === 'half-day' ? 'Doctor appointment' : '',
          createdAt: date.toISOString(),
          updatedAt: date.toISOString(),
        })
      }
    })

    setAttendances(mockAttendances.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
  }, [employees])

  const columns: TableColumn<Attendance>[] = [
    {
      key: 'employee',
      label: 'Employee',
      render: (_, attendance) => {
        const employee = employees.find(e => e.id === attendance.employeeId)
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
      key: 'date',
      label: 'Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'checkIn',
      label: 'Check In',
      render: (value) => value ? formatDateTime(value).split(', ')[1] : '-',
    },
    {
      key: 'checkOut',
      label: 'Check Out',
      render: (value) => value ? formatDateTime(value).split(', ')[1] : '-',
    },
    {
      key: 'totalHours',
      label: 'Total Hours',
      render: (value) => value ? `${value}h` : '-',
    },
    {
      key: 'breakTime',
      label: 'Break Time',
      render: (value) => value ? `${value}h` : '-',
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
      key: 'notes',
      label: 'Notes',
      render: (value) => (
        <div className="max-w-xs truncate text-sm text-gray-900" title={value}>
          {value || '-'}
        </div>
      ),
    },
  ]

  const handleAddAttendance = () => {
    setEditingAttendance(null)
    setFormData({
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      checkIn: '',
      checkOut: '',
      status: 'present',
      notes: '',
    })
    setShowModal(true)
  }

  const handleEditAttendance = (attendance: Attendance) => {
    setEditingAttendance(attendance)
    setFormData({
      employeeId: attendance.employeeId,
      date: attendance.date,
      checkIn: attendance.checkIn ? new Date(attendance.checkIn).toTimeString().slice(0, 5) : '',
      checkOut: attendance.checkOut ? new Date(attendance.checkOut).toTimeString().slice(0, 5) : '',
      status: attendance.status,
      notes: attendance.notes || '',
    })
    setShowModal(true)
  }

  const handleSubmit = () => {
    const checkInDateTime = formData.checkIn ? `${formData.date}T${formData.checkIn}:00Z` : ''
    const checkOutDateTime = formData.checkOut ? `${formData.date}T${formData.checkOut}:00Z` : ''

    let totalHours = 0
    let breakTime = 0

    if (formData.checkIn && formData.checkOut) {
      const checkInTime = new Date(checkInDateTime)
      const checkOutTime = new Date(checkOutDateTime)
      const diffInHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)
      totalHours = Math.max(0, diffInHours - 1) // Subtract 1 hour for break
      breakTime = 1
    }

    if (editingAttendance) {
      // Update existing attendance
      setAttendances(prev => prev.map(a =>
        a.id === editingAttendance.id
          ? {
              ...a,
              ...formData,
              checkIn: checkInDateTime,
              checkOut: checkOutDateTime,
              totalHours,
              breakTime,
              updatedAt: new Date().toISOString()
            }
          : a
      ))
    } else {
      // Add new attendance
      const newAttendance: Attendance = {
        id: `${formData.employeeId}-${formData.date}`,
        ...formData,
        checkIn: checkInDateTime,
        checkOut: checkOutDateTime,
        totalHours,
        breakTime,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setAttendances(prev => [newAttendance, ...prev])
    }
    setShowModal(false)
  }

  const handleExport = () => {
    console.log('Exporting attendances...')
    // In real implementation, this would export to CSV/Excel
  }

  const employeeOptions = employees.map(employee => ({
    value: employee.id,
    label: `${employee.firstName} ${employee.lastName}`,
  }))

  // Statistics
  const today = new Date().toISOString().split('T')[0]
  const todayAttendances = attendances.filter(a => a.date === today)
  const presentToday = todayAttendances.filter(a => a.status === 'present').length
  const absentToday = todayAttendances.filter(a => a.status === 'absent').length
  const lateToday = todayAttendances.filter(a => a.status === 'late').length

  const thisMonthAttendances = attendances.filter(a => {
    const attendanceDate = new Date(a.date)
    const now = new Date()
    return attendanceDate.getMonth() === now.getMonth() && attendanceDate.getFullYear() === now.getFullYear()
  })

  const averageHoursThisMonth = thisMonthAttendances.length > 0
    ? thisMonthAttendances.reduce((sum, a) => sum + a.totalHours, 0) / thisMonthAttendances.length
    : 0

  const onTimePercentage = thisMonthAttendances.length > 0
    ? (thisMonthAttendances.filter(a => a.status === 'present').length / thisMonthAttendances.length) * 100
    : 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Attendance Tracking
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor employee attendance, working hours, and time tracking.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <Button variant="secondary" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddAttendance}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Attendance
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Present Today
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {presentToday}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Absent Today
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {absentToday}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Late Today
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {lateToday}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarDaysIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg Hours/Month
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {averageHoursThisMonth.toFixed(1)}h
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {onTimePercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">On-Time Attendance</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {thisMonthAttendances.length}
            </div>
            <div className="text-sm text-gray-500">Total Working Days</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {thisMonthAttendances.reduce((sum, a) => sum + a.totalHours, 0).toFixed(0)}h
            </div>
            <div className="text-sm text-gray-500">Total Hours Worked</div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card">
        <DataTable
          data={attendances}
          columns={columns}
          loading={loading}
          searchable
          filterable
          sortable
          pagination={{ enabled: true }}
          actions={(attendance) => (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditAttendance(attendance)}
              >
                <ClockIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
          emptyMessage="No attendance records found. Start tracking employee attendance."
        />
      </div>

      {/* Add/Edit Attendance Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingAttendance ? 'Edit Attendance' : 'Add Attendance Record'}
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

          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Check In Time"
              type="time"
              value={formData.checkIn}
              onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
            />

            <Input
              label="Check Out Time"
              type="time"
              value={formData.checkOut}
              onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
            />
          </div>

          <Select
            label="Status"
            options={[
              { value: 'present', label: 'Present' },
              { value: 'absent', label: 'Absent' },
              { value: 'late', label: 'Late' },
              { value: 'half-day', label: 'Half Day' },
            ]}
            value={formData.status}
            onChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              className="input w-full h-24 resize-none"
              placeholder="Additional notes about attendance..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editingAttendance ? 'Update Attendance' : 'Add Attendance'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}