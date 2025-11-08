import { useState, useEffect } from 'react'
import {
  PlusIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  VideoCameraIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'
import DataTable, { TableColumn } from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useAppStore } from '@/store'
import { Interview, JobApplication, Candidate, Job } from '@/types'
import { formatDate, formatDateTime, getStatusColor } from '@/utils'

export default function InterviewSchedule() {
  const { employees = [] } = useAppStore() as any
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null)
  const [formData, setFormData] = useState({
    jobApplicationId: '',
    candidateId: '',
    interviewerId: '',
    scheduledAt: '',
    duration: 60,
    type: 'video' as const,
    location: '',
    meetingLink: '',
    status: 'scheduled' as const,
    feedback: '',
    rating: 0,
  })

  // Mock data - replace with API calls
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Senior Software Engineer',
        departmentId: '1',
        designationId: '1',
        description: '',
        requirements: '',
        location: 'New York',
        type: 'full-time',
        experience: '5+',
        salary: { min: 120000, max: 160000, currency: 'USD' },
        status: 'active',
        openings: 2,
        createdAt: '',
        updatedAt: '',
      },
      {
        id: '2',
        title: 'Product Manager',
        departmentId: '2',
        designationId: '2',
        description: '',
        requirements: '',
        location: 'SF',
        type: 'full-time',
        experience: '3+',
        salary: { min: 130000, max: 170000, currency: 'USD' },
        status: 'active',
        openings: 1,
        createdAt: '',
        updatedAt: '',
      },
    ]

    const mockCandidates: Candidate[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        resume: 'resume1.pdf',
        skills: ['React', 'Node.js'],
        experience: 5,
        location: 'New York',
        expectedSalary: 140000,
        status: 'active',
        createdAt: '',
        updatedAt: '',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        resume: 'resume2.pdf',
        skills: ['PM', 'Agile'],
        experience: 4,
        location: 'SF',
        expectedSalary: 150000,
        status: 'active',
        createdAt: '',
        updatedAt: '',
      },
    ]

    const mockApplications: JobApplication[] = [
      {
        id: '1',
        jobId: '1',
        candidateName: 'John Doe',
        candidateEmail: 'john@example.com',
        candidatePhone: '+1234567890',
        resume: 'resume1.pdf',
        coverLetter: '',
        status: 'interview',
        appliedAt: '',
        updatedAt: '',
      },
      {
        id: '2',
        jobId: '2',
        candidateName: 'Jane Smith',
        candidateEmail: 'jane@example.com',
        candidatePhone: '+1234567891',
        resume: 'resume2.pdf',
        coverLetter: '',
        status: 'interview',
        appliedAt: '',
        updatedAt: '',
      },
    ]

    const mockInterviews: Interview[] = [
      {
        id: '1',
        jobApplicationId: '1',
        candidateId: '1',
        interviewerId: '1',
        scheduledAt: '2023-12-20T14:00:00Z',
        duration: 60,
        type: 'video',
        location: '',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        status: 'scheduled',
        feedback: '',
        rating: 0,
        createdAt: '2023-12-15T00:00:00Z',
        updatedAt: '2023-12-15T00:00:00Z',
      },
      {
        id: '2',
        jobApplicationId: '2',
        candidateId: '2',
        interviewerId: '2',
        scheduledAt: '2023-12-18T10:30:00Z',
        duration: 45,
        type: 'in-person',
        location: '123 Main St, Conference Room A',
        meetingLink: '',
        status: 'completed',
        feedback: 'Strong technical skills and good communication. Recommended for next round.',
        rating: 4,
        createdAt: '2023-12-12T00:00:00Z',
        updatedAt: '2023-12-18T12:00:00Z',
      },
      {
        id: '3',
        jobApplicationId: '1',
        candidateId: '1',
        interviewerId: '3',
        scheduledAt: '2023-12-22T15:00:00Z',
        duration: 90,
        type: 'video',
        location: '',
        meetingLink: 'https://zoom.us/j/123456789',
        status: 'scheduled',
        feedback: '',
        rating: 0,
        createdAt: '2023-12-18T00:00:00Z',
        updatedAt: '2023-12-18T00:00:00Z',
      },
    ]

    setJobs(mockJobs)
    setCandidates(mockCandidates)
    setApplications(mockApplications)
    setInterviews(mockInterviews)
  }, [])

  const columns: TableColumn<Interview>[] = [
    {
      key: 'candidate',
      label: 'Candidate',
      render: (_, interview) => {
        const candidate = candidates.find(c => c.id === interview.candidateId)
        return candidate ? (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {candidate.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </span>
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
              <div className="text-sm text-gray-500">{candidate.email}</div>
            </div>
          </div>
        ) : (
          'Unknown Candidate'
        )
      },
    },
    {
      key: 'job',
      label: 'Position',
      render: (_, interview) => {
        const application = applications.find(a => a.id === interview.jobApplicationId)
        const job = application ? jobs.find(j => j.id === application.jobId) : null
        return job ? (
          <div>
            <div className="text-sm font-medium text-gray-900">{job.title}</div>
            <div className="text-sm text-gray-500">{job.location}</div>
          </div>
        ) : (
          'Unknown Position'
        )
      },
    },
    {
      key: 'interviewer',
      label: 'Interviewer',
      render: (_, interview) => {
        const interviewer = employees.find(e => e.id === interview.interviewerId)
        return interviewer ? (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {interviewer.firstName} {interviewer.lastName}
            </div>
            <div className="text-sm text-gray-500">{interviewer.email}</div>
          </div>
        ) : (
          'Unknown Interviewer'
        )
      },
    },
    {
      key: 'scheduledAt',
      label: 'Date & Time',
      render: value => (
        <div>
          <div className="text-sm text-gray-900">{formatDate(value)}</div>
          <div className="text-sm text-gray-500">{formatDateTime(value).split(', ')[1]}</div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: value => {
        const icons = {
          video: VideoCameraIcon,
          phone: UserIcon,
          'in-person': MapPinIcon,
        }
        const Icon = icons[value as keyof typeof icons] || VideoCameraIcon
        return (
          <div className="flex items-center">
            <Icon className="h-4 w-4 mr-1 text-gray-400" />
            <span className="text-sm capitalize">{value?.replace('-', ' ')}</span>
          </div>
        )
      },
    },
    {
      key: 'duration',
      label: 'Duration',
      render: value => `${value} min`,
    },
    {
      key: 'status',
      label: 'Status',
      render: value => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}
        >
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </span>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: value =>
        value ? (
          <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`text-sm ${i < value ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
            <span className="ml-1 text-sm text-gray-500">({value}/5)</span>
          </div>
        ) : (
          '-'
        ),
    },
  ]

  const handleAddInterview = () => {
    setEditingInterview(null)
    setFormData({
      jobApplicationId: '',
      candidateId: '',
      interviewerId: '',
      scheduledAt: '',
      duration: 60,
      type: 'video',
      location: '',
      meetingLink: '',
      status: 'scheduled',
      feedback: '',
      rating: 0,
    })
    setShowModal(true)
  }

  const handleEditInterview = (interview: Interview) => {
    setEditingInterview(interview)
    setFormData({
      jobApplicationId: interview.jobApplicationId,
      candidateId: interview.candidateId,
      interviewerId: interview.interviewerId,
      scheduledAt: interview.scheduledAt,
      duration: interview.duration,
      type: interview.type,
      location: interview.location || '',
      meetingLink: interview.meetingLink || '',
      status: interview.status,
      feedback: interview.feedback || '',
      rating: interview.rating || 0,
    })
    setShowModal(true)
  }

  const handleCompleteInterview = (interview: Interview) => {
    const feedback = prompt('Please provide feedback for this interview:')
    const rating = parseInt(prompt('Rate the candidate (1-5):') || '0')

    if (feedback !== null) {
      setInterviews(prev =>
        prev.map(i =>
          i.id === interview.id
            ? {
                ...i,
                status: 'completed',
                feedback,
                rating: rating || 0,
                updatedAt: new Date().toISOString(),
              }
            : i
        )
      )
    }
  }

  const handleCancelInterview = (interview: Interview) => {
    const reason = prompt('Please provide a reason for cancellation:')
    if (reason !== null && window.confirm('Are you sure you want to cancel this interview?')) {
      setInterviews(prev =>
        prev.map(i =>
          i.id === interview.id
            ? {
                ...i,
                status: 'cancelled',
                feedback: reason,
                updatedAt: new Date().toISOString(),
              }
            : i
        )
      )
    }
  }

  const handleSubmit = () => {
    if (editingInterview) {
      // Update existing interview
      setInterviews(prev =>
        prev.map(i =>
          i.id === editingInterview.id
            ? { ...i, ...formData, updatedAt: new Date().toISOString() }
            : i
        )
      )
    } else {
      // Add new interview
      const newInterview: Interview = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setInterviews(prev => [...prev, newInterview])
    }
    setShowModal(false)
  }

  const handleExport = () => {
    console.log('Exporting interviews...')
    // In real implementation, this would export to CSV/Excel
  }

  const applicationOptions = (applications || []).map(application => {
    const job = jobs.find(j => j.id === application.jobId)
    const candidate = candidates.find(c => c.id === application.candidateId)
    return {
      value: application.id,
      label: `${candidate?.name || 'Unknown'} - ${job?.title || 'Unknown Position'}`,
    }
  })

  const candidateOptions = (candidates || []).map(candidate => ({
    value: candidate.id,
    label: candidate.name,
  }))

  const interviewerOptions = (employees || []).map(employee => ({
    value: employee.id,
    label: `${employee.firstName} ${employee.lastName}`,
  }))

  // Statistics
  const totalInterviews = interviews.length
  const scheduledInterviews = interviews.filter(i => i.status === 'scheduled')
  const completedInterviews = interviews.filter(i => i.status === 'completed')
  const averageRating =
    completedInterviews.length > 0
      ? completedInterviews.reduce((sum, i) => sum + (i.rating || 0), 0) /
        completedInterviews.length
      : 0

  const upcomingInterviews = scheduledInterviews.filter(i => {
    const interviewDate = new Date(i.scheduledAt)
    const now = new Date()
    const diffInHours = (interviewDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return diffInHours > 0 && diffInHours <= 24
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Interview Schedule
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Schedule and manage candidate interviews across all positions.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <Button variant="secondary" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddInterview}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Schedule Interview
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
                <dt className="text-sm font-medium text-gray-500 truncate">Total Interviews</dt>
                <dd className="text-lg font-medium text-gray-900">{totalInterviews}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Scheduled</dt>
                <dd className="text-lg font-medium text-gray-900">{scheduledInterviews.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                <dd className="text-lg font-medium text-gray-900">{completedInterviews.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-medium">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Avg Rating</dt>
                <dd className="text-lg font-medium text-gray-900">{averageRating.toFixed(1)}/5</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Interviews Alert */}
      {upcomingInterviews.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <ClockIcon className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Upcoming Interviews ({upcomingInterviews.length})
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="space-y-1">
                  {upcomingInterviews.slice(0, 3).map(interview => {
                    const candidate = candidates.find(c => c.id === interview.candidateId)
                    return (
                      <li key={interview.id}>
                        {candidate?.name} - {formatDateTime(interview.scheduledAt)}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interviews Table */}
      <div className="card">
        <DataTable
          data={interviews}
          columns={columns}
          loading={loading}
          searchable
          filterable
          sortable
          pagination={{ enabled: true }}
          actions={interview => (
            <div className="flex items-center space-x-2">
              {interview.status === 'scheduled' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCompleteInterview(interview)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancelInterview(interview)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircleIcon className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={() => handleEditInterview(interview)}>
                <PencilIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
          emptyMessage="No interviews scheduled. Schedule your first interview to get started."
        />
      </div>

      {/* Add/Edit Interview Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingInterview ? 'Edit Interview' : 'Schedule New Interview'}
        size="lg"
      >
        <div className="space-y-6">
          <Select
            label="Job Application"
            options={applicationOptions}
            value={formData.jobApplicationId}
            onChange={value => {
              const application = applications.find(a => a.id === value)
              const candidate = application
                ? candidates.find(c => c.id === application.candidateId)
                : null
              setFormData(prev => ({
                ...prev,
                jobApplicationId: value,
                candidateId: candidate?.id || '',
              }))
            }}
            placeholder="Select job application"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Candidate"
              options={candidateOptions}
              value={formData.candidateId}
              onChange={value => setFormData(prev => ({ ...prev, candidateId: value }))}
              placeholder="Select candidate"
              required
              disabled
            />

            <Select
              label="Interviewer"
              options={interviewerOptions}
              value={formData.interviewerId}
              onChange={value => setFormData(prev => ({ ...prev, interviewerId: value }))}
              placeholder="Select interviewer"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Date & Time"
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={e => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
              required
            />

            <Input
              label="Duration (minutes)"
              type="number"
              value={formData.duration.toString()}
              onChange={e => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
              min="15"
              max="240"
              required
            />
          </div>

          <Select
            label="Interview Type"
            options={[
              { value: 'video', label: 'Video Call' },
              { value: 'phone', label: 'Phone Call' },
              { value: 'in-person', label: 'In-Person' },
            ]}
            value={formData.type}
            onChange={value => setFormData(prev => ({ ...prev, type: value as any }))}
            required
          />

          {formData.type === 'in-person' && (
            <Input
              label="Location"
              value={formData.location}
              onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Conference room, address, etc."
              required
            />
          )}

          {(formData.type === 'video' || formData.type === 'phone') && (
            <Input
              label="Meeting Link"
              value={formData.meetingLink}
              onChange={e => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
              placeholder="https://meet.google.com/... or Zoom link"
              required
            />
          )}

          {editingInterview && (
            <>
              <Select
                label="Status"
                options={[
                  { value: 'scheduled', label: 'Scheduled' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' },
                  { value: 'rescheduled', label: 'Rescheduled' },
                ]}
                value={formData.status}
                onChange={value => setFormData(prev => ({ ...prev, status: value as any }))}
                required
              />

              {formData.status === 'completed' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                    <textarea
                      className="input w-full h-24 resize-none"
                      placeholder="Provide detailed feedback about the candidate..."
                      value={formData.feedback}
                      onChange={e => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating (1-5)
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                          className={`text-2xl ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-500">{formData.rating}/5</span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editingInterview ? 'Update Interview' : 'Schedule Interview'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
