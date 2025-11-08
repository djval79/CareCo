import { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  BriefcaseIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import DataTable, { TableColumn } from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useAppStore } from '@/store'
import { Job, Department, Designation } from '@/types'
import { formatDate, formatCurrency, getStatusColor } from '@/utils'

export default function Jobs() {
  const { departments, designations } = useAppStore()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    departmentId: '',
    designationId: '',
    description: '',
    requirements: '',
    location: '',
    type: 'full-time' as const,
    experience: '',
    salary: { min: 0, max: 0, currency: 'USD' },
    status: 'draft' as const,
    openings: 1,
  })

  // Mock data - replace with API calls
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Senior Software Engineer',
        departmentId: '1',
        designationId: '1',
        description: 'We are looking for a Senior Software Engineer to join our team...',
        requirements: '5+ years of experience, React, Node.js, TypeScript...',
        location: 'New York, NY',
        type: 'full-time',
        experience: '5+ years',
        salary: { min: 120000, max: 160000, currency: 'USD' },
        status: 'active',
        openings: 2,
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2023-01-15T00:00:00Z',
      },
      {
        id: '2',
        title: 'Product Manager',
        departmentId: '2',
        designationId: '2',
        description: 'Join our product team as a Product Manager...',
        requirements: '3+ years PM experience, Agile, data-driven...',
        location: 'San Francisco, CA',
        type: 'full-time',
        experience: '3+ years',
        salary: { min: 130000, max: 170000, currency: 'USD' },
        status: 'active',
        openings: 1,
        createdAt: '2023-02-01T00:00:00Z',
        updatedAt: '2023-02-01T00:00:00Z',
      },
      {
        id: '3',
        title: 'UX Designer',
        departmentId: '2',
        designationId: '3',
        description: 'Create amazing user experiences for our products...',
        requirements: '3+ years UX design, Figma, user research...',
        location: 'Remote',
        type: 'full-time',
        experience: '3+ years',
        salary: { min: 90000, max: 120000, currency: 'USD' },
        status: 'draft',
        openings: 1,
        createdAt: '2023-03-10T00:00:00Z',
        updatedAt: '2023-03-10T00:00:00Z',
      },
    ]
    setJobs(mockJobs)
  }, [])

  const columns: TableColumn<Job>[] = [
    {
      key: 'title',
      label: 'Job Title',
      render: (_, job) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{job.title}</div>
          <div className="text-sm text-gray-500 flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1" />
            {job.location}
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (_, job) => {
        const department = departments.find(d => d.id === job.departmentId)
        return department?.name || 'N/A'
      },
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
          {value?.replace('-', ' ')}
        </span>
      ),
    },
    {
      key: 'salary',
      label: 'Salary Range',
      render: (value) => {
        if (!value) return 'N/A'
        return `${formatCurrency(value.min)} - ${formatCurrency(value.max)}`
      },
    },
    {
      key: 'openings',
      label: 'Openings',
      render: (value) => (
        <div className="flex items-center">
          <UserGroupIcon className="h-4 w-4 mr-1 text-gray-400" />
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
      key: 'createdAt',
      label: 'Posted',
      render: (value) => formatDate(value),
    },
  ]

  const handleAddJob = () => {
    setEditingJob(null)
    setFormData({
      title: '',
      departmentId: '',
      designationId: '',
      description: '',
      requirements: '',
      location: '',
      type: 'full-time',
      experience: '',
      salary: { min: 0, max: 0, currency: 'USD' },
      status: 'draft',
      openings: 1,
    })
    setShowModal(true)
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setFormData({
      title: job.title,
      departmentId: job.departmentId,
      designationId: job.designationId,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salary: job.salary,
      status: job.status,
      openings: job.openings,
    })
    setShowModal(true)
  }

  const handleDeleteJob = (job: Job) => {
    if (window.confirm(`Are you sure you want to delete "${job.title}"?`)) {
      setJobs(prev => prev.filter(j => j.id !== job.id))
    }
  }

  const handleSubmit = () => {
    if (editingJob) {
      // Update existing job
      setJobs(prev => prev.map(j =>
        j.id === editingJob.id
          ? { ...j, ...formData, updatedAt: new Date().toISOString() }
          : j
      ))
    } else {
      // Add new job
      const newJob: Job = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setJobs(prev => [...prev, newJob])
    }
    setShowModal(false)
  }

  const handleExport = () => {
    console.log('Exporting jobs...')
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

  const activeJobs = jobs.filter(job => job.status === 'active')
  const draftJobs = jobs.filter(job => job.status === 'draft')
  const totalOpenings = jobs.reduce((sum, job) => sum + job.openings, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Job Postings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage job openings and attract top talent to your organization.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <Button variant="secondary" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddJob}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BriefcaseIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Jobs
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {jobs.length}
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
                  {activeJobs.length}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Jobs
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {activeJobs.length}
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
                  {draftJobs.length}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Draft Jobs
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {draftJobs.length}
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
                  {totalOpenings}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Openings
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {totalOpenings}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="card">
        <DataTable
          data={jobs}
          columns={columns}
          loading={loading}
          searchable
          filterable
          sortable
          pagination={{ enabled: true }}
          actions={(job) => (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditJob(job)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteJob(job)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
          emptyMessage="No job postings found. Create your first job opening to attract talent."
          data-testid="jobs-table"
        />
      </div>

      {/* Add/Edit Job Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
        size="xl"
      >
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Job Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Senior Software Engineer"
              required
            />

            <Select
              label="Department"
              options={departmentOptions}
              value={formData.departmentId}
              onChange={(value) => setFormData(prev => ({ ...prev, departmentId: value }))}
              placeholder="Select department"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Designation"
              options={designationOptions}
              value={formData.designationId}
              onChange={(value) => setFormData(prev => ({ ...prev, designationId: value }))}
              placeholder="Select designation"
              required
            />

            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g. New York, NY or Remote"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select
              label="Job Type"
              options={[
                { value: 'full-time', label: 'Full Time' },
                { value: 'part-time', label: 'Part Time' },
                { value: 'contract', label: 'Contract' },
                { value: 'intern', label: 'Internship' },
              ]}
              value={formData.type}
              onChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
              required
            />

            <Input
              label="Experience Required"
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              placeholder="e.g. 3+ years"
              required
            />

            <Input
              label="Number of Openings"
              type="number"
              value={formData.openings.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, openings: Number(e.target.value) }))}
              min="1"
              required
            />
          </div>

          {/* Salary Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Salary Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Minimum Salary"
                type="number"
                value={formData.salary.min.toString()}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  salary: { ...prev.salary, min: Number(e.target.value) }
                }))}
                placeholder="50000"
              />

              <Input
                label="Maximum Salary"
                type="number"
                value={formData.salary.max.toString()}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  salary: { ...prev.salary, max: Number(e.target.value) }
                }))}
                placeholder="70000"
              />

              <Select
                label="Currency"
                options={[
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'EUR', label: 'EUR (€)' },
                  { value: 'GBP', label: 'GBP (£)' },
                  { value: 'CAD', label: 'CAD (C$)' },
                ]}
                value={formData.salary.currency}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  salary: { ...prev.salary, currency: value }
                }))}
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Job Description</h3>
            <textarea
              className="input w-full h-32 resize-none"
              placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Requirements</h3>
            <textarea
              className="input w-full h-32 resize-none"
              placeholder="List the required skills, experience, and qualifications..."
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              required
            />
          </div>

          {/* Status */}
          <Select
            label="Status"
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'active', label: 'Active' },
              { value: 'closed', label: 'Closed' },
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
            {editingJob ? 'Update Job' : 'Create Job'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}