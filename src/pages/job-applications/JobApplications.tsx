import { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  DocumentTextIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import DataTable, { TableColumn } from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useAppStore } from '@/store'
import { JobApplication, Job, Candidate } from '@/types'
import { formatDate, getStatusColor } from '@/utils'

export default function JobApplications() {
  const { departments, designations } = useAppStore()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null)
  const [formData, setFormData] = useState({
    jobId: '',
    candidateName: '',
    candidateEmail: '',
    candidatePhone: '',
    resume: '',
    coverLetter: '',
    status: 'applied' as const,
  })

  // Mock data - replace with API calls
  useEffect(() => {
    const mockJobs: Job[] = [
      { id: '1', title: 'Senior Software Engineer', departmentId: '1', designationId: '1', description: '', requirements: '', location: 'New York', type: 'full-time', experience: '5+', salary: { min: 120000, max: 160000, currency: 'USD' }, status: 'active', openings: 2, createdAt: '', updatedAt: '' },
      { id: '2', title: 'Product Manager', departmentId: '2', designationId: '2', description: '', requirements: '', location: 'SF', type: 'full-time', experience: '3+', salary: { min: 130000, max: 170000, currency: 'USD' }, status: 'active', openings: 1, createdAt: '', updatedAt: '' },
    ]

    const mockCandidates: Candidate[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1234567890', resume: 'resume1.pdf', skills: ['React', 'Node.js'], experience: 5, location: 'New York', expectedSalary: 140000, status: 'active', createdAt: '', updatedAt: '' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', resume: 'resume2.pdf', skills: ['PM', 'Agile'], experience: 4, location: 'SF', expectedSalary: 150000, status: 'active', createdAt: '', updatedAt: '' },
    ]

    const mockApplications: JobApplication[] = [
      {
        id: '1',
        jobId: '1',
        candidateName: 'John Doe',
        candidateEmail: 'john@example.com',
        candidatePhone: '+1234567890',
        resume: 'resume1.pdf',
        coverLetter: 'I am very interested in this position...',
        status: 'interview',
        appliedAt: '2023-01-15T10:30:00Z',
        updatedAt: '2023-01-20T14:00:00Z',
      },
      {
        id: '2',
        jobId: '2',
        candidateName: 'Jane Smith',
        candidateEmail: 'jane@example.com',
        candidatePhone: '+1234567891',
        resume: 'resume2.pdf',
        coverLetter: 'With my experience in product management...',
        status: 'screening',
        appliedAt: '2023-01-16T09:15:00Z',
        updatedAt: '2023-01-18T11:30:00Z',
      },
      {
        id: '3',
        jobId: '1',
        candidateName: 'Mike Johnson',
        candidateEmail: 'mike@example.com',
        candidatePhone: '+1234567892',
        resume: 'resume3.pdf',
        coverLetter: 'I have 7 years of experience...',
        status: 'applied',
        appliedAt: '2023-01-17T16:45:00Z',
        updatedAt: '2023-01-17T16:45:00Z',
      },
    ]

    setJobs(mockJobs)
    setCandidates(mockCandidates)
    setApplications(mockApplications)
  }, [])

  const columns: TableColumn<JobApplication>[] = [
    {
      key: 'candidate',
      label: 'Candidate',
      render: (_, application) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {application.candidateName.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {application.candidateName}
            </div>
            <div className="text-sm text-gray-500">{application.candidateEmail}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'job',
      label: 'Position',
      render: (_, application) => {
        const job = jobs.find(j => j.id === application.jobId)
        return job ? (
          <div>
            <div className="text-sm font-medium text-gray-900">{job.title}</div>
            <div className="text-sm text-gray-500">{job.location}</div>
          </div>
        ) : 'N/A'
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const statusLabels = {
          applied: 'Applied',
          screening: 'Screening',
          interview: 'Interview',
          offer: 'Offer',
          hired: 'Hired',
          rejected: 'Rejected',
        }
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
            {statusLabels[value as keyof typeof statusLabels] || value}
          </span>
        )
      },
    },
    {
      key: 'appliedAt',
      label: 'Applied Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      render: (value) => formatDate(value),
    },
  ]

  const handleAddApplication = () => {
    setEditingApplication(null)
    setFormData({
      jobId: '',
      candidateName: '',
      candidateEmail: '',
      candidatePhone: '',
      resume: '',
      coverLetter: '',
      status: 'applied',
    })
    setShowModal(true)
  }

  const handleEditApplication = (application: JobApplication) => {
    setEditingApplication(application)
    setFormData({
      jobId: application.jobId,
      candidateName: application.candidateName,
      candidateEmail: application.candidateEmail,
      candidatePhone: application.candidatePhone,
      resume: application.resume,
      coverLetter: application.coverLetter || '',
      status: application.status,
    })
    setShowModal(true)
  }

  const handleDeleteApplication = (application: JobApplication) => {
    if (window.confirm(`Are you sure you want to delete ${application.candidateName}'s application?`)) {
      setApplications(prev => prev.filter(a => a.id !== application.id))
    }
  }

  const handleStatusChange = (application: JobApplication, newStatus: JobApplication['status']) => {
    setApplications(prev => prev.map(a =>
      a.id === application.id
        ? { ...a, status: newStatus, updatedAt: new Date().toISOString() }
        : a
    ))
  }

  const handleSubmit = () => {
    if (editingApplication) {
      // Update existing application
      setApplications(prev => prev.map(a =>
        a.id === editingApplication.id
          ? { ...a, ...formData, updatedAt: new Date().toISOString() }
          : a
      ))
    } else {
      // Add new application
      const newApplication: JobApplication = {
        id: Date.now().toString(),
        ...formData,
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setApplications(prev => [...prev, newApplication])
    }
    setShowModal(false)
  }

  const handleExport = () => {
    console.log('Exporting applications...')
    // In real implementation, this would export to CSV/Excel
  }

  const jobOptions = jobs.map(job => ({
    value: job.id,
    label: `${job.title} (${job.location})`,
  }))

  const statusOptions = [
    { value: 'applied', label: 'Applied' },
    { value: 'screening', label: 'Screening' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' },
  ]

  // Statistics
  const totalApplications = applications.length
  const applicationsByStatus = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const recentApplications = applications
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Job Applications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage candidate applications and track the hiring pipeline.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <Button variant="secondary" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddApplication}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Application
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Applications
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {totalApplications}
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
                  {applicationsByStatus.applied || 0}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Applied
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {applicationsByStatus.applied || 0}
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
                  {applicationsByStatus.interview || 0}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  In Interview
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {applicationsByStatus.interview || 0}
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
                  {applicationsByStatus.hired || 0}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Hired
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {applicationsByStatus.hired || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card">
        <DataTable
          data={applications}
          columns={columns}
          loading={loading}
          searchable
          filterable
          sortable
          pagination={{ enabled: true }}
          actions={(application) => (
            <div className="flex items-center space-x-2">
              <Select
                value={application.status}
                onChange={(value) => handleStatusChange(application, value as JobApplication['status'])}
                options={statusOptions}
                className="w-32"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditApplication(application)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteApplication(application)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
          emptyMessage="No applications found. Applications will appear here when candidates apply for jobs."
        />
      </div>

      {/* Recent Applications */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Applications</h3>
        <div className="space-y-3">
          {recentApplications.map((application) => {
            const job = jobs.find(j => j.id === application.jobId)
            return (
              <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {application.candidateName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{application.candidateName}</p>
                    <p className="text-sm text-gray-500">
                      Applied for {job?.title || 'Unknown Position'} • {formatDate(application.appliedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                  <Button variant="ghost" size="sm">
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add/Edit Application Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingApplication ? 'Edit Application' : 'Add New Application'}
        size="lg"
      >
        <div className="space-y-6">
          <Select
            label="Job Position"
            options={jobOptions}
            value={formData.jobId}
            onChange={(value) => setFormData(prev => ({ ...prev, jobId: value }))}
            placeholder="Select a job position"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Candidate Name"
              value={formData.candidateName}
              onChange={(e) => setFormData(prev => ({ ...prev, candidateName: e.target.value }))}
              placeholder="John Doe"
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.candidateEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, candidateEmail: e.target.value }))}
              placeholder="john@example.com"
              required
            />
          </div>

          <Input
            label="Phone"
            value={formData.candidatePhone}
            onChange={(e) => setFormData(prev => ({ ...prev, candidatePhone: e.target.value }))}
            placeholder="+1 (555) 123-4567"
            required
          />

          <Input
            label="Resume"
            value={formData.resume}
            onChange={(e) => setFormData(prev => ({ ...prev, resume: e.target.value }))}
            placeholder="resume.pdf or link to resume"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Letter
            </label>
            <textarea
              className="input w-full h-32 resize-none"
              placeholder="Candidate's cover letter..."
              value={formData.coverLetter}
              onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
            />
          </div>

          <Select
            label="Status"
            options={statusOptions}
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
            {editingApplication ? 'Update Application' : 'Add Application'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}