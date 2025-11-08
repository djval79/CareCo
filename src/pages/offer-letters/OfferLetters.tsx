import { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  EyeIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import DataTable, { TableColumn } from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useAppStore } from '@/store'
import { OfferLetter, JobApplication, Candidate, Job } from '@/types'
import { formatDate, formatCurrency, getStatusColor } from '@/utils'

export default function OfferLetters() {
  const { employees } = useAppStore()
  const [offerLetters, setOfferLetters] = useState<OfferLetter[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingOffer, setEditingOffer] = useState<OfferLetter | null>(null)
  const [formData, setFormData] = useState({
    applicationId: '',
    candidateId: '',
    jobId: '',
    salary: { amount: 0, currency: 'USD', period: 'yearly' as const },
    startDate: '',
    offerDate: '',
    expiryDate: '',
    status: 'draft' as const,
    template: 'standard' as const,
    customTerms: '',
    notes: '',
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
        source: '',
        createdAt: '',
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
        source: '',
        createdAt: '',
      },
    ]

    const mockOffers: OfferLetter[] = [
      {
        id: '1',
        applicationId: '1',
        candidateId: '1',
        jobId: '1',
        salary: { amount: 135000, currency: 'USD', period: 'yearly' },
        startDate: '2024-01-15',
        offerDate: '2023-12-20',
        expiryDate: '2024-01-05',
        status: 'sent',
        template: 'standard',
        customTerms: 'Health insurance, 401k matching, flexible PTO',
        notes: 'Strong technical candidate, good cultural fit',
        createdAt: '2023-12-20T00:00:00Z',
        updatedAt: '2023-12-20T00:00:00Z',
      },
      {
        id: '2',
        applicationId: '2',
        candidateId: '2',
        jobId: '2',
        salary: { amount: 145000, currency: 'USD', period: 'yearly' },
        startDate: '2024-02-01',
        offerDate: '2023-12-22',
        expiryDate: '2024-01-10',
        status: 'accepted',
        template: 'executive',
        customTerms: 'Stock options, performance bonus, remote work option',
        notes: 'Excellent product management experience',
        createdAt: '2023-12-22T00:00:00Z',
        updatedAt: '2023-12-28T00:00:00Z',
      },
      {
        id: '3',
        applicationId: '1',
        candidateId: '1',
        jobId: '1',
        salary: { amount: 125000, currency: 'USD', period: 'yearly' },
        startDate: '2024-01-20',
        offerDate: '2023-12-25',
        expiryDate: '2024-01-15',
        status: 'draft',
        template: 'standard',
        customTerms: 'Standard benefits package',
        notes: 'Backup offer if primary candidate declines',
        createdAt: '2023-12-25T00:00:00Z',
        updatedAt: '2023-12-25T00:00:00Z',
      },
    ]

    setJobs(mockJobs)
    setCandidates(mockCandidates)
    setApplications(mockApplications)
    setOfferLetters(mockOffers)
  }, [])

  const columns: TableColumn<OfferLetter>[] = [
    {
      key: 'candidate',
      label: 'Candidate',
      render: (_, offer) => {
        const candidate = candidates.find(c => c.id === offer.candidateId)
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
      render: (_, offer) => {
        const job = jobs.find(j => j.id === offer.jobId)
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
      key: 'salary',
      label: 'Salary',
      render: value => (value ? formatCurrency(value.amount) : '-'),
    },
    {
      key: 'startDate',
      label: 'Start Date',
      render: value => formatDate(value),
    },
    {
      key: 'offerDate',
      label: 'Offer Date',
      render: value => formatDate(value),
    },
    {
      key: 'expiryDate',
      label: 'Expiry Date',
      render: value => formatDate(value),
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
  ]

  const handleAddOffer = () => {
    setEditingOffer(null)
    setFormData({
      applicationId: '',
      candidateId: '',
      jobId: '',
      salary: { amount: 0, currency: 'USD', period: 'yearly' },
      startDate: '',
      offerDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      status: 'draft',
      template: 'standard',
      customTerms: '',
      notes: '',
    })
    setShowModal(true)
  }

  const handleEditOffer = (offer: OfferLetter) => {
    setEditingOffer(offer)
    setFormData({
      applicationId: offer.applicationId,
      candidateId: offer.candidateId,
      jobId: offer.jobId,
      salary: offer.salary,
      startDate: offer.startDate,
      offerDate: offer.offerDate,
      expiryDate: offer.expiryDate,
      status: offer.status,
      template: offer.template,
      customTerms: offer.customTerms || '',
      notes: offer.notes || '',
    })
    setShowModal(true)
  }

  const handleSendOffer = (offer: OfferLetter) => {
    setOfferLetters(prev =>
      prev.map(o =>
        o.id === offer.id ? { ...o, status: 'sent', updatedAt: new Date().toISOString() } : o
      )
    )
  }

  const handleAcceptOffer = (offer: OfferLetter) => {
    setOfferLetters(prev =>
      prev.map(o =>
        o.id === offer.id ? { ...o, status: 'accepted', updatedAt: new Date().toISOString() } : o
      )
    )
  }

  const handleRejectOffer = (offer: OfferLetter) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (reason !== null) {
      setOfferLetters(prev =>
        prev.map(o =>
          o.id === offer.id
            ? { ...o, status: 'rejected', notes: reason, updatedAt: new Date().toISOString() }
            : o
        )
      )
    }
  }

  const handleGeneratePDF = (offer: OfferLetter) => {
    console.log('Generating PDF for offer:', offer.id)
    // In real implementation, this would generate and download a PDF
  }

  const handleSubmit = () => {
    if (editingOffer) {
      // Update existing offer
      setOfferLetters(prev =>
        prev.map(o =>
          o.id === editingOffer.id ? { ...o, ...formData, updatedAt: new Date().toISOString() } : o
        )
      )
    } else {
      // Add new offer
      const newOffer: OfferLetter = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setOfferLetters(prev => [...prev, newOffer])
    }
    setShowModal(false)
  }

  const handleExport = () => {
    console.log('Exporting offers...')
    // In real implementation, this would export to CSV/Excel
  }

  const applicationOptions = applications.map(application => {
    const job = jobs.find(j => j.id === application.jobId)
    const candidate = candidates.find(c => c.id === application.candidateId)
    return {
      value: application.id,
      label: `${candidate?.name || 'Unknown'} - ${job?.title || 'Unknown Position'}`,
    }
  })

  // Statistics
  const totalOffers = offerLetters.length
  const sentOffers = offerLetters.filter(o => o.status === 'sent')
  const acceptedOffers = offerLetters.filter(o => o.status === 'accepted')
  const rejectedOffers = offerLetters.filter(o => o.status === 'rejected')
  const pendingOffers = offerLetters.filter(o => o.status === 'draft')

  const averageSalary =
    offerLetters.length > 0
      ? offerLetters.reduce((sum, o) => sum + o.salary.amount, 0) / offerLetters.length
      : 0

  const acceptanceRate =
    sentOffers.length > 0 ? (acceptedOffers.length / sentOffers.length) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Offer Letters
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create, manage, and track job offer letters and candidate responses.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <Button variant="secondary" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddOffer}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Offer
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
                <dt className="text-sm font-medium text-gray-500 truncate">Total Offers</dt>
                <dd className="text-lg font-medium text-gray-900">{totalOffers}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <EnvelopeIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Sent Offers</dt>
                <dd className="text-lg font-medium text-gray-900">{sentOffers.length}</dd>
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
                <dt className="text-sm font-medium text-gray-500 truncate">Accepted</dt>
                <dd className="text-lg font-medium text-gray-900">{acceptedOffers.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-medium">
                  {acceptanceRate.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Acceptance Rate</dt>
                <dd className="text-lg font-medium text-gray-900">{acceptanceRate.toFixed(1)}%</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Average Salary</h3>
          <div className="text-3xl font-bold text-primary-600">
            ${averageSalary.toLocaleString()}
          </div>
          <p className="text-sm text-gray-500 mt-1">Per year</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Pending Offers</h3>
          <div className="text-3xl font-bold text-orange-600">{pendingOffers.length}</div>
          <p className="text-sm text-gray-500 mt-1">Awaiting action</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Rejected Offers</h3>
          <div className="text-3xl font-bold text-red-600">{rejectedOffers.length}</div>
          <p className="text-sm text-gray-500 mt-1">This period</p>
        </div>
      </div>

      {/* Offers Table */}
      <div className="card">
        <DataTable
          data={offerLetters}
          columns={columns}
          loading={loading}
          searchable
          filterable
          sortable
          pagination={{ enabled: true }}
          actions={offer => (
            <div className="flex items-center space-x-2">
              {offer.status === 'draft' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSendOffer(offer)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <EnvelopeIcon className="h-4 w-4" />
                </Button>
              )}
              {offer.status === 'sent' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAcceptOffer(offer)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRejectOffer(offer)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircleIcon className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={() => handleGeneratePDF(offer)}>
                <ArrowDownTrayIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleEditOffer(offer)}>
                <PencilIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
          emptyMessage="No offer letters found. Create your first offer to get started."
        />
      </div>

      {/* Add/Edit Offer Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingOffer ? 'Edit Offer Letter' : 'Create Offer Letter'}
        size="xl"
      >
        <div className="space-y-6">
          <Select
            label="Job Application"
            options={applicationOptions}
            value={formData.applicationId}
            onChange={value => {
              const application = applications.find(a => a.id === value)
              const job = application ? jobs.find(j => j.id === application.jobId) : null
              const candidate = application
                ? candidates.find(c => c.id === application.candidateId)
                : null
              setFormData(prev => ({
                ...prev,
                applicationId: value,
                jobId: job?.id || '',
                candidateId: candidate?.id || '',
              }))
            }}
            placeholder="Select job application"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-sm">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selected Candidate
              </label>
              <div className="p-3 bg-gray-50 rounded-md">
                {formData.candidateId
                  ? candidates.find(c => c.id === formData.candidateId)?.name || 'Unknown'
                  : 'No candidate selected'}
              </div>
            </div>

            <div className="text-sm">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selected Position
              </label>
              <div className="p-3 bg-gray-50 rounded-md">
                {formData.jobId
                  ? jobs.find(j => j.id === formData.jobId)?.title || 'Unknown'
                  : 'No position selected'}
              </div>
            </div>
          </div>

          {/* Salary Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Compensation Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Salary Amount"
                type="number"
                value={formData.salary.amount.toString()}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    salary: { ...prev.salary, amount: Number(e.target.value) },
                  }))
                }
                placeholder="120000"
                required
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
                onChange={value =>
                  setFormData(prev => ({
                    ...prev,
                    salary: { ...prev.salary, currency: value },
                  }))
                }
              />

              <Select
                label="Period"
                options={[
                  { value: 'yearly', label: 'Per Year' },
                  { value: 'monthly', label: 'Per Month' },
                  { value: 'hourly', label: 'Per Hour' },
                ]}
                value={formData.salary.period}
                onChange={value =>
                  setFormData(prev => ({
                    ...prev,
                    salary: { ...prev.salary, period: value as any },
                  }))
                }
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              required
            />

            <Input
              label="Offer Date"
              type="date"
              value={formData.offerDate}
              onChange={e => setFormData(prev => ({ ...prev, offerDate: e.target.value }))}
              required
            />

            <Input
              label="Expiry Date"
              type="date"
              value={formData.expiryDate}
              onChange={e => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
              required
            />
          </div>

          <Select
            label="Template"
            options={[
              { value: 'standard', label: 'Standard Offer' },
              { value: 'executive', label: 'Executive Offer' },
              { value: 'intern', label: 'Internship Offer' },
              { value: 'contract', label: 'Contract Offer' },
            ]}
            value={formData.template}
            onChange={value => setFormData(prev => ({ ...prev, template: value as any }))}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Terms & Benefits
            </label>
            <textarea
              className="input w-full h-24 resize-none"
              placeholder="Health insurance, 401k matching, PTO policy, etc."
              value={formData.customTerms}
              onChange={e => setFormData(prev => ({ ...prev, customTerms: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
            <textarea
              className="input w-full h-24 resize-none"
              placeholder="Internal notes about the candidate or offer..."
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          {editingOffer && (
            <Select
              label="Status"
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'sent', label: 'Sent' },
                { value: 'accepted', label: 'Accepted' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'expired', label: 'Expired' },
              ]}
              value={formData.status}
              onChange={value => setFormData(prev => ({ ...prev, status: value as any }))}
              required
            />
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{editingOffer ? 'Update Offer' : 'Create Offer'}</Button>
        </div>
      </Modal>
    </div>
  )
}
