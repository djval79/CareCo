import { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'
import DataTable, { TableColumn } from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useAppStore } from '@/store'
import { Employee, Department, Designation } from '@/types'
import { formatDate, getInitials, getStatusColor } from '@/utils'

export default function Employees() {
  const { departments, designations } = useAppStore()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: '',
    designationId: '',
    hireDate: '',
    salary: 0,
    status: 'active' as const,
  })

  // Mock data - replace with API calls
  useEffect(() => {
    const mockEmployees: Employee[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1-555-0123',
        departmentId: '1',
        designationId: '1',
        hireDate: '2023-01-15',
        salary: 75000,
        status: 'active',
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2023-01-15T00:00:00Z',
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        phone: '+1-555-0124',
        departmentId: '2',
        designationId: '2',
        hireDate: '2023-02-01',
        salary: 65000,
        status: 'active',
        createdAt: '2023-02-01T00:00:00Z',
        updatedAt: '2023-02-01T00:00:00Z',
      },
      {
        id: '3',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@company.com',
        phone: '+1-555-0125',
        departmentId: '1',
        designationId: '3',
        hireDate: '2023-03-10',
        salary: 55000,
        status: 'active',
        createdAt: '2023-03-10T00:00:00Z',
        updatedAt: '2023-03-10T00:00:00Z',
      },
    ]
    setEmployees(mockEmployees)
  }, [])

  const columns: TableColumn<Employee>[] = [
    {
      key: 'name',
      label: 'Employee',
      render: (_, employee) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {getInitials(`${employee.firstName} ${employee.lastName}`)}
            </span>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {employee.firstName} {employee.lastName}
            </div>
            <div className="text-sm text-gray-500">{employee.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (_, employee) => {
        const department = departments.find(d => d.id === employee.departmentId)
        return department?.name || 'N/A'
      },
    },
    {
      key: 'designation',
      label: 'Designation',
      render: (_, employee) => {
        const designation = designations.find(d => d.id === employee.designationId)
        return designation?.title || 'N/A'
      },
    },
    {
      key: 'hireDate',
      label: 'Hire Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'salary',
      label: 'Salary',
      render: (value) => `$${value?.toLocaleString() || 0}`,
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
  ]

  const handleAddEmployee = () => {
    setEditingEmployee(null)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      departmentId: '',
      designationId: '',
      hireDate: '',
      salary: 0,
      status: 'active',
    })
    setShowModal(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      departmentId: employee.departmentId,
      designationId: employee.designationId,
      hireDate: employee.hireDate,
      salary: employee.salary,
      status: employee.status,
    })
    setShowModal(true)
  }

  const handleDeleteEmployee = (employee: Employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      setEmployees(prev => prev.filter(e => e.id !== employee.id))
    }
  }

  const handleSubmit = () => {
    if (editingEmployee) {
      // Update existing employee
      setEmployees(prev => prev.map(e =>
        e.id === editingEmployee.id
          ? { ...e, ...formData, updatedAt: new Date().toISOString() }
          : e
      ))
    } else {
      // Add new employee
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setEmployees(prev => [...prev, newEmployee])
    }
    setShowModal(false)
  }

  const handleExport = () => {
    console.log('Exporting employees...')
    // In real implementation, this would export to CSV/Excel
  }

  const departmentOptions = departments.map(dept => ({
    value: dept.id,
    label: dept.name,
  }))

  const designationOptions = designations.map(designation => ({
    value: designation.id,
    label: designation.title,
  }))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Employees
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your organization's employee information and records.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <Button variant="secondary" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddEmployee}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Employees
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {employees.length}
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
                  {employees.filter(e => e.status === 'active').length}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Employees
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {employees.filter(e => e.status === 'active').length}
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
                  {departments.length}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Departments
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {departments.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 text-sm font-medium">
                  {designations.length}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Designations
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {designations.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="card">
        <DataTable
          data={employees}
          columns={columns}
          loading={loading}
          searchable
          filterable
          sortable
          selectable
          pagination={{ enabled: true }}
          actions={(employee) => (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditEmployee(employee)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteEmployee(employee)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
          emptyMessage="No employees found. Add your first employee to get started."
          data-testid="employees-table"
        />
      </div>

      {/* Add/Edit Employee Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              required
            />

            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />

            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Department"
              options={departmentOptions}
              value={formData.departmentId}
              onChange={(value) => setFormData(prev => ({ ...prev, departmentId: value }))}
              placeholder="Select department"
              required
            />

            <Select
              label="Designation"
              options={designationOptions}
              value={formData.designationId}
              onChange={(value) => setFormData(prev => ({ ...prev, designationId: value }))}
              placeholder="Select designation"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Hire Date"
              type="date"
              value={formData.hireDate}
              onChange={(e) => setFormData(prev => ({ ...prev, hireDate: e.target.value }))}
              required
            />

            <Input
              label="Salary"
              type="number"
              value={formData.salary.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, salary: Number(e.target.value) }))}
              required
            />
          </div>

          <Select
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'terminated', label: 'Terminated' },
            ]}
            value={formData.status}
            onChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
            required
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editingEmployee ? 'Update Employee' : 'Add Employee'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}