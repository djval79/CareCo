import { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  BriefcaseIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'
import DataTable, { TableColumn } from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { formatDate } from '@/utils'

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  status: 'active' | 'closed' | 'draft'
  applicants: number
  postedDate: string
  description: string
  requirements: string
  salary?: string
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time' as Job['type'],
    status: 'draft' as Job['status'],
    description: '',
    requirements: '',
    salary: '',
  })

  // Mock data - replace with API calls
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Senior Software Engineer',
          department: 'Engineering',
          location: 'New York, NY',
          type: 'full-time',
          status: 'active',
          applicants: 45,
          postedDate: '2024-01-15',
          description: 'We are looking for an experienced software engineer to join our team...',
          requirements: '5+ years of experience, React, Node.js, TypeScript',
          salary: '$120,000 - $150,000',
        },
        {
          id: '2',
          title: 'Product Manager',
          department: 'Product',
          location: 'San Francisco, CA',
          type: 'full-time',
          status: 'active',
          applicants: 23,
          postedDate: '2024-01-10',
          description: 'Lead product strategy and development for our core platform...',
          requirements: '3+ years PM experience, Agile, Analytics',
          salary: '$130,000 - $160,000',
        },
        {
          id: '3',
          title: 'UX Designer',
          department: 'Design',
          location: 'Remote',
          type: 'full-time',
          status: 'active',
          applicants: 18,
          postedDate: '2024-01-08',
          description: 'Create exceptional user experiences for our web and mobile applications...',
          requirements: '3+ years UX design, Figma, User Research',
          salary: '$90,000 - $120,000',
        },
      ]
      setJobs(mockJobs)
      setLoading(false)
    }, 500)
  }, [])

  const columns: TableColumn<Job>[] = [
    {
      key: 'title',
      label: 'Job Title',
      sortable: true,
      filterable: true,
      render: (value, job) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{job.department}</div>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      filterable: true,
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
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const colors = {
          active: 'bg-green-100 text-green-800',
          closed: 'bg-red-100 text-red-800',
          draft: 'bg-gray-100 text-gray-800',
        }
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${colors[value as keyof typeof colors]}`}>
            {value}
          </span>
        )
      },
    },
    {
      key: 'applicants',
      label: 'Applicants',
      sortable: true,
      align: 'center',
    },
    {
      key: 'postedDate',
      label: 'Posted',
      sortable: true,
      render: (value) => formatDate(value),
    },
  ]

  const handleAddJob = () => {
    setEditingJob(null)
    setFormData({
      title: '',
      department: '',
      location: '',
      type: 'full-time',
      status: 'draft',
      description: '',
      requirements: '',
      salary: '',
    })
    setShowModal(true)
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      status: job.status,
      description: job.description,
      requirements: job.requirements,
      salary: job.salary || '',
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
          ? { ...j, ...formData }
          : j
      ))
    } else {
      // Add new job
      const newJob: Job = {
        id: Date.now().toString(),
        ...formData,
        applicants: 0,
        postedDate: new Date().toISOString().split('T')[0],
      }
      setJobs(prev => [...prev, newJob])
    }
    setShowModal(false)
  }

  const handleExport = () => {
    console.log('Exporting jobs...')
    // In real implementation, this would export to CSV/Excel
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Jobs
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage job postings and track applications.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <Button variant="secondary" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddJob} data-testid="add-job-btn">
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
                  {jobs.filter(j => j.status === 'active').length}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Jobs
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {jobs.filter(j => j.status === 'active').length}
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
                  {jobs.reduce((sum, job) => sum + job.applicants, 0)}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Applications
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {jobs.reduce((sum, job) => sum + job.applicants, 0)}
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
                  {Math.round(jobs.reduce((sum, job) => sum + job.applicants, 0) / Math.max(jobs.length, 1))}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg Applications
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {Math.round(jobs.reduce((sum, job) => sum + job.applicants, 0) / Math.max(jobs.length, 1))}
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
                data-testid={`edit-job-${job.id}`}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteJob(job)}
                data-testid={`delete-job-${job.id}`}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
          emptyMessage="No jobs found. Post your first job to get started."
          data-testid="jobs-table"
        />
      </div>

      {/* Add/Edit Job Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingJob ? 'Edit Job' : 'Post New Job'}
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Job Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              data-testid="job-title"
            />

            <Input
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />

            <Select
              label="Job Type"
              options={[
                { value: 'full-time', label: 'Full Time' },
                { value: 'part-time', label: 'Part Time' },
                { value: 'contract', label: 'Contract' },
                { value: 'internship', label: 'Internship' },
              ]}
              value={formData.type}
              onChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Salary Range (Optional)"
              value={formData.salary}
              onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
              placeholder="e.g., $50,000 - $70,000"
            />

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

          <Textarea
            label="Job Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            required
          />

          <Textarea
            label="Requirements"
            value={formData.requirements}
            onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
            rows={3}
            required
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} data-testid="submit-job">
            {editingJob ? 'Update Job' : 'Post Job'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}