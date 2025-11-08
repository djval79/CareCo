import { useState } from 'react'
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import DataTable, { TableColumn } from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

interface LetterTemplate {
  id: string
  title: string
  description: string
  content: string
  createdAt: string
  updatedAt: string
}

const mockTemplates: LetterTemplate[] = [
  {
    id: '1',
    title: 'Welcome Letter',
    description: 'Template for welcoming new employees',
    content: 'Dear [Employee Name],\n\nWelcome to our company...',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Offer Letter',
    description: 'Standard job offer template',
    content: 'Dear [Candidate Name],\n\nWe are pleased to offer you...',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12'
  },
  {
    id: '3',
    title: 'Termination Letter',
    description: 'Template for employee termination',
    content: 'Dear [Employee Name],\n\nThis letter serves to inform you...',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  }
]

export default function LetterTemplates() {
  const [templates, setTemplates] = useState<LetterTemplate[]>(mockTemplates)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: ''
  })

  const columns: TableColumn<LetterTemplate>[] = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      filterable: true
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ]

  const handleCreate = () => {
    const newTemplate: LetterTemplate = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    setTemplates([...templates, newTemplate])
    setIsCreateModalOpen(false)
    setFormData({ title: '', description: '', content: '' })
  }

  const handleEdit = () => {
    if (!selectedTemplate) return
    const updatedTemplates = templates.map(template =>
      template.id === selectedTemplate.id
        ? { ...template, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
        : template
    )
    setTemplates(updatedTemplates)
    setIsEditModalOpen(false)
    setSelectedTemplate(null)
    setFormData({ title: '', description: '', content: '' })
  }

  const handleDelete = (template: LetterTemplate) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== template.id))
    }
  }

  const openEditModal = (template: LetterTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      title: template.title,
      description: template.description,
      content: template.content
    })
    setIsEditModalOpen(true)
  }

  const openViewModal = (template: LetterTemplate) => {
    setSelectedTemplate(template)
    setIsViewModalOpen(true)
  }

  const actions = (template: LetterTemplate) => (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        size="sm"
        icon={EyeIcon}
        onClick={() => openViewModal(template)}
        data-testid={`view-template-${template.id}`}
      >
        View
      </Button>
      <Button
        variant="secondary"
        size="sm"
        icon={PencilIcon}
        onClick={() => openEditModal(template)}
        data-testid={`edit-template-${template.id}`}
      >
        Edit
      </Button>
      <Button
        variant="danger"
        size="sm"
        icon={TrashIcon}
        onClick={() => handleDelete(template)}
        data-testid={`delete-template-${template.id}`}
      >
        Delete
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Letter Templates
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage letter templates for various HR communications
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            data-testid="add-template-button"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Template
          </Button>
        </div>
      </div>

      <div className="card">
        <DataTable
          data={templates}
          columns={columns}
          actions={actions}
          data-testid="letter-templates-table"
        />
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Letter Template"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Textarea
            label="Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={10}
            required
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Letter Template"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Textarea
            label="Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={10}
            required
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update</Button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedTemplate?.title || 'View Template'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <p className="mt-1 text-sm text-gray-900">{selectedTemplate?.description}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <div className="mt-1 p-4 border border-gray-300 rounded-md bg-gray-50 whitespace-pre-wrap">
              {selectedTemplate?.content}
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}