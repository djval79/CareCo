import { apiService } from './api'

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables: string[]
  category: 'recruitment' | 'hr' | 'general'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface EmailData {
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  subject: string
  body: string
  templateId?: string
  variables?: Record<string, any>
  attachments?: File[]
  priority?: 'low' | 'normal' | 'high'
  scheduledAt?: string
}

export interface EmailCampaign {
  id: string
  name: string
  description?: string
  templateId: string
  recipientList: string[]
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'cancelled'
  scheduledAt?: string
  sentAt?: string
  completedAt?: string
  stats: {
    total: number
    sent: number
    delivered: number
    opened: number
    clicked: number
    bounced: number
    unsubscribed: number
  }
  createdAt: string
  updatedAt: string
}

// Email Templates API
export const emailTemplateAPI = {
  getAll: (params?: any) => {
    return apiService.get('/email/templates', { params })
  },

  getById: (id: string) => {
    return apiService.get(`/email/templates/${id}`)
  },

  create: (data: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    return apiService.post('/email/templates', data)
  },

  update: (id: string, data: Partial<EmailTemplate>) => {
    return apiService.put(`/email/templates/${id}`, data)
  },

  delete: (id: string) => {
    return apiService.delete(`/email/templates/${id}`)
  },

  duplicate: (id: string) => {
    return apiService.post(`/email/templates/${id}/duplicate`)
  },

  test: (id: string, testEmail: string, variables?: Record<string, any>) => {
    return apiService.post(`/email/templates/${id}/test`, { testEmail, variables })
  },
}

// Email Sending API
export const emailAPI = {
  send: (data: EmailData) => {
    const formData = new FormData()

    // Handle recipients
    if (Array.isArray(data.to)) {
      data.to.forEach(email => formData.append('to[]', email))
    } else {
      formData.append('to', data.to)
    }

    if (data.cc) {
      if (Array.isArray(data.cc)) {
        data.cc.forEach(email => formData.append('cc[]', email))
      } else {
        formData.append('cc', data.cc)
      }
    }

    if (data.bcc) {
      if (Array.isArray(data.bcc)) {
        data.bcc.forEach(email => formData.append('bcc[]', email))
      } else {
        formData.append('bcc', data.bcc)
      }
    }

    formData.append('subject', data.subject)
    formData.append('body', data.body)

    if (data.templateId) {
      formData.append('templateId', data.templateId)
    }

    if (data.variables) {
      formData.append('variables', JSON.stringify(data.variables))
    }

    if (data.priority) {
      formData.append('priority', data.priority)
    }

    if (data.scheduledAt) {
      formData.append('scheduledAt', data.scheduledAt)
    }

    // Handle attachments
    if (data.attachments) {
      data.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })
    }

    return apiService.upload('/email/send', formData)
  },

  schedule: (data: EmailData) => {
    return apiService.post('/email/schedule', data)
  },

  cancelScheduled: (emailId: string) => {
    return apiService.delete(`/email/scheduled/${emailId}`)
  },

  getStatus: (emailId: string) => {
    return apiService.get(`/email/status/${emailId}`)
  },
}

// Email Campaigns API
export const emailCampaignAPI = {
  getAll: (params?: any) => {
    return apiService.get('/email/campaigns', { params })
  },

  getById: (id: string) => {
    return apiService.get(`/email/campaigns/${id}`)
  },

  create: (data: Omit<EmailCampaign, 'id' | 'stats' | 'createdAt' | 'updatedAt'>) => {
    return apiService.post('/email/campaigns', data)
  },

  update: (id: string, data: Partial<EmailCampaign>) => {
    return apiService.put(`/email/campaigns/${id}`, data)
  },

  delete: (id: string) => {
    return apiService.delete(`/email/campaigns/${id}`)
  },

  start: (id: string) => {
    return apiService.post(`/email/campaigns/${id}/start`)
  },

  pause: (id: string) => {
    return apiService.post(`/email/campaigns/${id}/pause`)
  },

  cancel: (id: string) => {
    return apiService.post(`/email/campaigns/${id}/cancel`)
  },

  getStats: (id: string) => {
    return apiService.get(`/email/campaigns/${id}/stats`)
  },
}

// Pre-built email templates for common HR scenarios
export const defaultEmailTemplates = {
  jobApplicationReceived: {
    name: 'Job Application Received',
    subject: 'Thank you for your application - {{jobTitle}}',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Application Received</h2>
        <p>Dear {{candidateName}},</p>
        <p>Thank you for applying for the position of <strong>{{jobTitle}}</strong> at {{companyName}}.</p>
        <p>We have received your application and our recruitment team will review it shortly. You will be notified of the next steps in the process.</p>
        <p>If you have any questions, please don't hesitate to contact us at {{contactEmail}}.</p>
        <p>Best regards,<br>{{companyName}} Recruitment Team</p>
      </div>
    `,
    variables: ['candidateName', 'jobTitle', 'companyName', 'contactEmail'],
    category: 'recruitment' as const,
  },

  interviewScheduled: {
    name: 'Interview Scheduled',
    subject: 'Interview Scheduled - {{jobTitle}}',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Interview Scheduled</h2>
        <p>Dear {{candidateName}},</p>
        <p>Congratulations! Your application for the position of <strong>{{jobTitle}}</strong> has progressed to the interview stage.</p>
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #333;">Interview Details:</h3>
          <p><strong>Date:</strong> {{interviewDate}}</p>
          <p><strong>Time:</strong> {{interviewTime}}</p>
          <p><strong>Type:</strong> {{interviewType}}</p>
          <p><strong>Location/Link:</strong> {{interviewLocation}}</p>
          <p><strong>Interviewer:</strong> {{interviewerName}}</p>
        </div>
        <p>Please prepare for the interview and arrive 10 minutes early. If you need to reschedule, please contact us at least 24 hours in advance.</p>
        <p>Best regards,<br>{{companyName}} Recruitment Team</p>
      </div>
    `,
    variables: ['candidateName', 'jobTitle', 'companyName', 'interviewDate', 'interviewTime', 'interviewType', 'interviewLocation', 'interviewerName'],
    category: 'recruitment' as const,
  },

  offerLetter: {
    name: 'Offer Letter',
    subject: 'Job Offer - {{jobTitle}}',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Job Offer</h2>
        <p>Dear {{candidateName}},</p>
        <p>Congratulations! We are pleased to offer you the position of <strong>{{jobTitle}}</strong> at {{companyName}}.</p>
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #333;">Offer Details:</h3>
          <p><strong>Salary:</strong> {{salary}}</p>
          <p><strong>Start Date:</strong> {{startDate}}</p>
          <p><strong>Location:</strong> {{workLocation}}</p>
          <p><strong>Employment Type:</strong> {{employmentType}}</p>
        </div>
        <p>Please review the attached offer letter for complete details. To accept this offer, please sign and return the document by {{expirationDate}}.</p>
        <p>If you have any questions, please contact {{contactName}} at {{contactEmail}} or {{contactPhone}}.</p>
        <p>We look forward to welcoming you to the {{companyName}} team!</p>
        <p>Best regards,<br>{{contactName}}<br>{{contactTitle}}<br>{{companyName}}</p>
      </div>
    `,
    variables: ['candidateName', 'jobTitle', 'companyName', 'salary', 'startDate', 'workLocation', 'employmentType', 'expirationDate', 'contactName', 'contactEmail', 'contactPhone', 'contactTitle'],
    category: 'recruitment' as const,
  },

  leaveApproved: {
    name: 'Leave Approved',
    subject: 'Leave Request Approved',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Leave Request Approved</h2>
        <p>Dear {{employeeName}},</p>
        <p>Your leave request has been approved. Here are the details:</p>
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <p><strong>Leave Type:</strong> {{leaveType}}</p>
          <p><strong>Start Date:</strong> {{startDate}}</p>
          <p><strong>End Date:</strong> {{endDate}}</p>
          <p><strong>Total Days:</strong> {{totalDays}}</p>
          <p><strong>Approved By:</strong> {{approverName}}</p>
        </div>
        <p>Please ensure your work is properly handed over and that your team is informed of your absence.</p>
        <p>Enjoy your time off!</p>
        <p>Best regards,<br>HR Team<br>{{companyName}}</p>
      </div>
    `,
    variables: ['employeeName', 'leaveType', 'startDate', 'endDate', 'totalDays', 'approverName', 'companyName'],
    category: 'hr' as const,
  },

  leaveRejected: {
    name: 'Leave Rejected',
    subject: 'Leave Request Update',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Leave Request Update</h2>
        <p>Dear {{employeeName}},</p>
        <p>We regret to inform you that your leave request has been rejected for the following reason:</p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <p style="color: #dc2626; margin: 0;">{{rejectionReason}}</p>
        </div>
        <p>If you would like to discuss this decision or submit a revised request, please contact your manager or the HR department.</p>
        <p>Best regards,<br>HR Team<br>{{companyName}}</p>
      </div>
    `,
    variables: ['employeeName', 'rejectionReason', 'companyName'],
    category: 'hr' as const,
  },

  welcomeNewEmployee: {
    name: 'Welcome New Employee',
    subject: 'Welcome to {{companyName}}!',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to {{companyName}}!</h2>
        <p>Dear {{employeeName}},</p>
        <p>Welcome to the {{companyName}} family! We're excited to have you join our team as {{jobTitle}}.</p>
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #333;">Your Start Details:</h3>
          <p><strong>Start Date:</strong> {{startDate}}</p>
          <p><strong>Position:</strong> {{jobTitle}}</p>
          <p><strong>Manager:</strong> {{managerName}}</p>
          <p><strong>Location:</strong> {{workLocation}}</p>
        </div>
        <p>Your first day will include orientation and setup. Please arrive by {{startTime}} and bring the required documents listed in your offer letter.</p>
        <p>If you have any questions before your start date, please contact {{contactName}} at {{contactEmail}}.</p>
        <p>We look forward to working with you!</p>
        <p>Best regards,<br>HR Team<br>{{companyName}}</p>
      </div>
    `,
    variables: ['employeeName', 'companyName', 'jobTitle', 'startDate', 'managerName', 'workLocation', 'startTime', 'contactName', 'contactEmail'],
    category: 'hr' as const,
  },
}

// Email utility functions
export const emailUtils = {
  // Replace template variables
  replaceVariables: (template: string, variables: Record<string, any>): string => {
    let result = template
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      result = result.replace(regex, String(value))
    })
    return result
  },

  // Validate email address
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Format email list
  formatEmailList: (emails: string | string[]): string[] => {
    if (typeof emails === 'string') {
      return emails.split(',').map(email => email.trim()).filter(email => email.length > 0)
    }
    return emails
  },

  // Get template by category
  getTemplatesByCategory: (templates: EmailTemplate[], category: string): EmailTemplate[] => {
    return templates.filter(template => template.category === category && template.isActive)
  },

  // Calculate email campaign stats
  calculateCampaignStats: (campaign: EmailCampaign) => {
    const { stats } = campaign
    return {
      ...stats,
      deliveryRate: stats.total > 0 ? (stats.delivered / stats.total) * 100 : 0,
      openRate: stats.sent > 0 ? (stats.opened / stats.sent) * 100 : 0,
      clickRate: stats.sent > 0 ? (stats.clicked / stats.sent) * 100 : 0,
      bounceRate: stats.sent > 0 ? (stats.bounced / stats.sent) * 100 : 0,
    }
  },
}

export default {
  emailTemplateAPI,
  emailAPI,
  emailCampaignAPI,
  defaultEmailTemplates,
  emailUtils,
}