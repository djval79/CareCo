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
  StarIcon,
} from '@heroicons/react/24/outline'
import DataTable, { TableColumn } from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { formatDate } from '@/utils'

interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  experience: number
  skills: string[]
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
  rating: number
  appliedDate: string
  resume?: string
}

export default function CandidateDatabase() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    experience: 0,
    skills: [] as string[],
    status: 'new' as Candidate['status'],
    rating: 0,
  })

  // Mock data - replace with API calls
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const mockCandidates: Candidate[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          phone: '+1-555-0123',
          position: 'Senior Software Engineer',
          experience: 5,
          skills: ['React', 'Node.js', 'TypeScript', 'Python'],
          status: 'interview',
          rating: 4,
          appliedDate: '2024-01-15',
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@email.com',
          phone: '+1-555-0124',
          position: 'Product Manager',
          experience: 3,
          skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
          status: 'screening',
          rating: 5,
          appliedDate: '2024-01-12',
        },
        {
          id: '3',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@email.com',
          phone: '+1-555-0125',
          position: 'UX Designer',
          experience: 4,
          skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
          status: 'offer',
          rating: 4,
          appliedDate: '2024-01-10',
        },
      ]
      setCandidates(mockCandidates)
      setLoading(false)
    }, 500)
  }, [])

  const columns: TableColumn<Candidate>[] = [
    {
      key: 'name',
      label: 'Candidate',
      sortable: true,
      filterable: true,
      render: (_, candidate) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {candidate.firstName[0]}{candidate.lastName[0]}
            </span>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {candidate.firstName} {candidate.lastName}
            </div>
            <div className="text-sm text-gray-500">{candidate.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'position',
      label: 'Position',
      sortable: true,
      filterable: true,
    },
    {
      key: 'experience',
      label: 'Experience',
      sortable: true,
      render: (value) => `${value} years`,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const colors = {
          new: 'bg-blue-100 text-blue-800',
          screening: 'bg-yellow-100 text-yellow-800',
          interview: 'bg-purple-100 text-purple-800',
          offer: 'bg-green-100 text-green-800',
          hired: 'bg-emerald-100 text-emerald-800',
          rejected: 'bg-red-100 text-red-800',
        }
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${colors[value as keyof typeof colors]}`}>
            {value}
          </span>
        )
      },
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`h-4 w-4 ${
                star <= value ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-1 text-sm text-gray-500">({value})</span>
        </div>
      ),
    },
    {
      key: 'appliedDate',
      label: 'Applied',
      sortable: true,
      render: (value) => formatDate(value),
    },
  ]

  const handleAddCandidate = () => {
    setEditingCandidate(null)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      experience: 0,
      skills: [],
      status: 'new',
      rating: 0,
    })
    setShowModal(true)
  }

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate)
    setFormData({
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.position,
      experience: candidate.experience,
      skills: candidate.skills,
      status: candidate.status,
      rating: candidate.rating,
    })
    setShowModal(true)
  }

  const handleDeleteCandidate = (candidate: Candidate) => {
    if (window.confirm(`Are you sure you want to delete ${candidate.firstName} ${candidate.lastName}?`)) {
      setCandidates(prev => prev.filter(c => c.id !== candidate.id))
    }
  }

  const handleSubmit = () => {
    if (editingCandidate) {
      // Update existing candidate
      setCandidates(prev => prev.map(c =>
        c.id === editingCandidate.id
          ? { ...c, ...formData }
          : c
      ))
    } else {
      // Add new candidate
      const newCandidate: Candidate = {
        id: Date.now().toString(),
        ...formData,
        appliedDate: new Date().toISOString().split('T')[0],
      }
      setCandidates(prev => [...prev, newCandidate])
    }
    setShowModal(false)
  }

  const handleExport = () => {
    console.log('Exporting candidates...')
    // In real implementation, this would export to CSV/Excel
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Candidate Database
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all job candidates in your recruitment pipeline.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <Button variant="secondary" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddCandidate}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Candidate
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
                  Total Candidates
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {candidates.length}
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
                  {candidates.filter(c => c.status === 'new').length}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  New Candidates
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {candidates.filter(c => c.status === 'new').length}
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
                  {candidates.filter(c => c.status === 'interview').length}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  In Interview
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {candidates.filter(c => c.status === 'interview').length}
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
                  {candidates.filter(c => c.status === 'offer').length}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Offers Extended
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {candidates.filter(c => c.status === 'offer').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="card">
        <DataTable
          data={candidates}
          columns={columns}
          loading={loading}
          searchable
          filterable
          sortable
          pagination={{ enabled: true }}
          actions={(candidate) => (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditCandidate(candidate)}
                data-testid={`edit-candidate-${candidate.id}`}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteCandidate(candidate)}
                data-testid={`delete-candidate-${candidate.id}`}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
          emptyMessage="No candidates found. Add your first candidate to get started."
          data-testid="candidates-table"
        />
      </div>

      {/* Add/Edit Candidate Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              required
              data-testid="candidate-name"
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
            <Input
              label="Position Applied For"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              required
            />

            <Input
              label="Years of Experience"
              type="number"
              value={formData.experience.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: Number(e.target.value) }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Status"
              options={[
                { value: 'new', label: 'New' },
                { value: 'screening', label: 'Screening' },
                { value: 'interview', label: 'Interview' },
                { value: 'offer', label: 'Offer' },
                { value: 'hired', label: 'Hired' },
                { value: 'rejected', label: 'Rejected' },
              ]}
              value={formData.status}
              onChange={(value) => setFormData(prev => ({ ...prev, status: value as Candidate['status'] }))}
              required
            />

            <Select
              label="Rating"
              options={[
                { value: '1', label: '1 Star' },
                { value: '2', label: '2 Stars' },
                { value: '3', label: '3 Stars' },
                { value: '4', label: '4 Stars' },
                { value: '5', label: '5 Stars' },
              ]}
              value={formData.rating.toString()}
              onChange={(value) => setFormData(prev => ({ ...prev, rating: Number(value) }))}
              required
            />
          </div>

          <Input
            label="Skills (comma-separated)"
            value={formData.skills.join(', ')}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            }))}
            placeholder="React, Node.js, TypeScript"
            data-testid="candidate-search"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} data-testid="submit-candidate">
            {editingCandidate ? 'Update Candidate' : 'Add Candidate'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}