import { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  UserIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  StarIcon,
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
import { Candidate } from '@/types'
import { formatDate, getInitials, getStatusColor } from '@/utils'

export default function CandidateDatabase() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: '',
    skills: [] as string[],
    experience: 0,
    location: '',
    expectedSalary: 0,
    status: 'active' as 'active' | 'hired' | 'rejected' | 'contacted' | 'interested' | 'not-interested',
    notes: '',
  })

  // Mock data - replace with API calls
  useEffect(() => {
    const mockCandidates: Candidate[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-0123',
        resume: 'john-doe-resume.pdf',
        skills: ['React', 'TypeScript', 'Node.js', 'Python'],
        experience: 5,
        location: 'New York, NY',
        expectedSalary: 120000,
        status: 'active',
        notes: 'Strong full-stack developer with excellent communication skills',
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2023-01-15T00:00:00Z',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+1-555-0124',
        resume: 'jane-smith-resume.pdf',
        skills: ['Product Management', 'Agile', 'Data Analysis', 'User Research'],
        experience: 4,
        location: 'San Francisco, CA',
        expectedSalary: 130000,
        status: 'active',
        notes: 'Experienced product manager with startup background',
        createdAt: '2023-02-01T00:00:00Z',
        updatedAt: '2023-02-01T00:00:00Z',
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@email.com',
        phone: '+1-555-0125',
        resume: 'mike-johnson-resume.pdf',
        skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
        experience: 3,
        location: 'Austin, TX',
        expectedSalary: 90000,
        status: 'hired',
        notes: 'Creative designer with strong portfolio and user-centered approach',
        createdAt: '2023-03-10T00:00:00Z',
        updatedAt: '2023-03-15T00:00:00Z',
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@email.com',
        phone: '+1-555-0126',
        resume: 'sarah-wilson-resume.pdf',
        skills: ['DevOps', 'AWS', 'Docker', 'Kubernetes', 'CI/CD'],
        experience: 6,
        location: 'Seattle, WA',
        expectedSalary: 140000,
        status: 'active',
        notes: 'Senior DevOps engineer with cloud architecture expertise',
        createdAt: '2023-04-05T00:00:00Z',
        updatedAt: '2023-04-05T00:00:00Z',
      },
    ]
    setCandidates(mockCandidates)
  }, [])

  const columns: TableColumn<Candidate>[] = [
    {
      key: 'name',
      label: 'Candidate',
      render: (_, candidate) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {getInitials(candidate.name)}
            </span>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {candidate.name}
            </div>
            <div className="text-sm text-gray-500">{candidate.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (value) => (
        <div className="flex items-center">
          <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
          {value}
        </div>
      ),
    },
    {
      key: 'experience',
      label: 'Experience',
      render: (value) => `${value} years`,
    },
    {
      key: 'skills',
      label: 'Skills',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {(value as string[]).slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
            >
              {skill}
            </span>
          ))}
          {(value as string[]).length > 3 && (
            <span className="text-xs text-gray-500">
              +{(value as string[]).length - 3} more
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'expectedSalary',
      label: 'Expected Salary',
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
    {
      key: 'createdAt',
      label: 'Added',
      render: (value) => formatDate(value),
    },
  ]

  const handleAddCandidate = () => {
    setEditingCandidate(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      resume: '',
      skills: [],
      experience: 0,
      location: '',
      expectedSalary: 0,
      status: 'active',
      notes: '',
    })
    setShowModal(true)
  }

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate)
    setFormData({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      resume: candidate.resume,
      skills: candidate.skills,
      experience: candidate.experience,
      location: candidate.location,
      expectedSalary: candidate.expectedSalary,
      status: candidate.status,
      notes: candidate.notes || '',
    })
    setShowModal(true)
  }

  const handleDeleteCandidate = (candidate: Candidate) => {
    if (window.confirm(`Are you sure you want to delete ${candidate.name}?`)) {
      setCandidates(prev => prev.filter(c => c.id !== candidate.id))
    }
  }

  const handleSubmit = () => {
    if (editingCandidate) {
      // Update existing candidate
      setCandidates(prev => prev.map(c =>
        c.id === editingCandidate.id
          ? { ...c, ...formData, updatedAt: new Date().toISOString() }
          : c
      ))
    } else {
      // Add new candidate
      const newCandidate: Candidate = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setCandidates(prev => [...prev, newCandidate])
    }
    setShowModal(false)
  }

  const handleExport = () => {
    console.log('Exporting candidates...')
    // In real implementation, this would export to CSV/Excel
  }

  // Statistics
  const totalCandidates = candidates.length
  const activeCandidates = candidates.filter(c => c.status === 'active')
  const hiredCandidates = candidates.filter(c => c.status === 'hired')
  const averageExperience = candidates.reduce((sum, c) => sum + c.experience, 0) / candidates.length
  const averageSalary = candidates.reduce((sum, c) => sum + c.expectedSalary, 0) / candidates.length

  // Top skills
  const allSkills = candidates.flatMap(c => c.skills)
  const skillCounts = allSkills.reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const topSkills = Object.entries(skillCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Candidate Database
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your talent pool and find the perfect candidates for your positions.
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
              <UserIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Candidates
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {totalCandidates}
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
                  {activeCandidates.length}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Candidates
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {activeCandidates.length}
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
                  {averageExperience.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg Experience
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {averageExperience.toFixed(1)} years
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
                  ${(averageSalary / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg Salary Expectation
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  ${(averageSalary / 1000).toFixed(0)}k
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Top Skills */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Skills in Database</h3>
        <div className="flex flex-wrap gap-3">
          {topSkills.map(([skill, count]) => (
            <div key={skill} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
              <span className="text-sm font-medium text-gray-900">{skill}</span>
              <span className="ml-2 bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {count}
              </span>
            </div>
          ))}
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
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteCandidate(candidate)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
          emptyMessage="No candidates found. Add candidates to build your talent database."
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
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="John Doe"
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+1 (555) 123-4567"
              required
            />

            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="New York, NY"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Years of Experience"
              type="number"
              value={formData.experience.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: Number(e.target.value) }))}
              min="0"
              required
            />

            <Input
              label="Expected Salary"
              type="number"
              value={formData.expectedSalary.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, expectedSalary: Number(e.target.value) }))}
              placeholder="120000"
              required
            />
          </div>

          <Input
            label="Resume"
            value={formData.resume}
            onChange={(e) => setFormData(prev => ({ ...prev, resume: e.target.value }))}
            placeholder="resume.pdf or link to resume"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills (comma-separated)
            </label>
            <Input
              value={formData.skills.join(', ')}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
              }))}
              placeholder="React, TypeScript, Node.js"
            />
            {formData.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              className="input w-full h-24 resize-none"
              placeholder="Additional notes about the candidate..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <Select
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'hired', label: 'Hired' },
              { value: 'rejected', label: 'Rejected' },
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
            {editingCandidate ? 'Update Candidate' : 'Add Candidate'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}