import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.luwasuite.com'
const API_VERSION = 'v1'

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error

    if (response) {
      // Handle specific HTTP status codes
      switch (response.status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
          break
        case 403:
          // Forbidden - show permission error
          console.error('Access forbidden:', response.data.message)
          break
        case 422:
          // Validation errors
          console.error('Validation errors:', response.data.errors)
          break
        case 429:
          // Rate limiting
          console.error('Rate limit exceeded. Please try again later.')
          break
        case 500:
          // Server error
          console.error('Server error. Please try again later.')
          break
        default:
          console.error('API Error:', response.data.message || 'An error occurred')
      }
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('Network error. Please check your connection.')
    } else {
      console.error('Request failed:', error.message)
    }

    return Promise.reject(error)
  }
)

// Generic API methods
export const apiService = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.get(url, config)
  },

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.post(url, data, config)
  },

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.put(url, data, config)
  },

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.patch(url, data, config)
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.delete(url, config)
  },

  upload: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    })
  },
}

// Authentication API
export const authAPI = {
  login: (credentials: { email: string; password: string }) => {
    return apiService.post('/auth/login', credentials)
  },

  logout: () => {
    return apiService.post('/auth/logout')
  },

  refresh: () => {
    return apiService.post('/auth/refresh')
  },

  me: () => {
    return apiService.get('/auth/me')
  },

  forgotPassword: (email: string) => {
    return apiService.post('/auth/forgot-password', { email })
  },

  resetPassword: (data: { token: string; password: string; password_confirmation: string }) => {
    return apiService.post('/auth/reset-password', data)
  },
}

// Employee API
export const employeeAPI = {
  getAll: (params?: any) => {
    return apiService.get('/employees', { params })
  },

  getById: (id: string) => {
    return apiService.get(`/employees/${id}`)
  },

  create: (data: any) => {
    return apiService.post('/employees', data)
  },

  update: (id: string, data: any) => {
    return apiService.put(`/employees/${id}`, data)
  },

  delete: (id: string) => {
    return apiService.delete(`/employees/${id}`)
  },

  bulkUpdate: (data: any) => {
    return apiService.post('/employees/bulk-update', data)
  },

  export: (params?: any) => {
    return apiService.get('/employees/export', {
      params,
      responseType: 'blob'
    })
  },
}

// Department API
export const departmentAPI = {
  getAll: (params?: any) => {
    return apiService.get('/departments', { params })
  },

  getById: (id: string) => {
    return apiService.get(`/departments/${id}`)
  },

  create: (data: any) => {
    return apiService.post('/departments', data)
  },

  update: (id: string, data: any) => {
    return apiService.put(`/departments/${id}`, data)
  },

  delete: (id: string) => {
    return apiService.delete(`/departments/${id}`)
  },
}

// Job API
export const jobAPI = {
  getAll: (params?: any) => {
    return apiService.get('/jobs', { params })
  },

  getById: (id: string) => {
    return apiService.get(`/jobs/${id}`)
  },

  create: (data: any) => {
    return apiService.post('/jobs', data)
  },

  update: (id: string, data: any) => {
    return apiService.put(`/jobs/${id}`, data)
  },

  delete: (id: string) => {
    return apiService.delete(`/jobs/${id}`)
  },

  publish: (id: string) => {
    return apiService.post(`/jobs/${id}/publish`)
  },

  close: (id: string) => {
    return apiService.post(`/jobs/${id}/close`)
  },

  duplicate: (id: string) => {
    return apiService.post(`/jobs/${id}/duplicate`)
  },
}

// Job Application API
export const jobApplicationAPI = {
  getAll: (params?: any) => {
    return apiService.get('/job-applications', { params })
  },

  getById: (id: string) => {
    return apiService.get(`/job-applications/${id}`)
  },

  create: (data: any) => {
    return apiService.post('/job-applications', data)
  },

  update: (id: string, data: any) => {
    return apiService.put(`/job-applications/${id}`, data)
  },

  delete: (id: string) => {
    return apiService.delete(`/job-applications/${id}`)
  },

  updateStatus: (id: string, status: string, notes?: string) => {
    return apiService.patch(`/job-applications/${id}/status`, { status, notes })
  },

  bulkUpdate: (data: any) => {
    return apiService.post('/job-applications/bulk-update', data)
  },

  export: (params?: any) => {
    return apiService.get('/job-applications/export', {
      params,
      responseType: 'blob'
    })
  },
}

// Candidate API
export const candidateAPI = {
  getAll: (params?: any) => {
    return apiService.get('/candidates', { params })
  },

  getById: (id: string) => {
    return apiService.get(`/candidates/${id}`)
  },

  create: (data: any) => {
    return apiService.post('/candidates', data)
  },

  update: (id: string, data: any) => {
    return apiService.put(`/candidates/${id}`, data)
  },

  delete: (id: string) => {
    return apiService.delete(`/candidates/${id}`)
  },

  uploadResume: (id: string, file: File) => {
    const formData = new FormData()
    formData.append('resume', file)
    return apiService.upload(`/candidates/${id}/resume`, formData)
  },

  addNote: (id: string, note: string) => {
    return apiService.post(`/candidates/${id}/notes`, { note })
  },
}

// Interview API
export const interviewAPI = {
  getAll: (params?: any) => {
    return apiService.get('/interviews', { params })
  },

  getById: (id: string) => {
    return apiService.get(`/interviews/${id}`)
  },

  create: (data: any) => {
    return apiService.post('/interviews', data)
  },

  update: (id: string, data: any) => {
    return apiService.put(`/interviews/${id}`, data)
  },

  delete: (id: string) => {
    return apiService.delete(`/interviews/${id}`)
  },

  updateStatus: (id: string, status: string) => {
    return apiService.patch(`/interviews/${id}/status`, { status })
  },

  addFeedback: (id: string, feedback: any) => {
    return apiService.post(`/interviews/${id}/feedback`, feedback)
  },

  reschedule: (id: string, newDateTime: string) => {
    return apiService.patch(`/interviews/${id}/reschedule`, { scheduled_at: newDateTime })
  },
}

// Offer API
export const offerAPI = {
  getAll: (params?: any) => {
    return apiService.get('/offers', { params })
  },

  getById: (id: string) => {
    return apiService.get(`/offers/${id}`)
  },

  create: (data: any) => {
    return apiService.post('/offers', data)
  },

  update: (id: string, data: any) => {
    return apiService.put(`/offers/${id}`, data)
  },

  delete: (id: string) => {
    return apiService.delete(`/offers/${id}`)
  },

  send: (id: string) => {
    return apiService.post(`/offers/${id}/send`)
  },

  accept: (id: string, signature?: string) => {
    return apiService.post(`/offers/${id}/accept`, { signature })
  },

  reject: (id: string, reason?: string) => {
    return apiService.post(`/offers/${id}/reject`, { reason })
  },

  generatePDF: (id: string) => {
    return apiService.get(`/offers/${id}/pdf`, { responseType: 'blob' })
  },
}

// Leave API
export const leaveAPI = {
  getAll: (params?: any) => {
    return apiService.get('/leaves', { params })
  },

  getById: (id: string) => {
    return apiService.get(`/leaves/${id}`)
  },

  create: (data: any) => {
    return apiService.post('/leaves', data)
  },

  update: (id: string, data: any) => {
    return apiService.put(`/leaves/${id}`, data)
  },

  delete: (id: string) => {
    return apiService.delete(`/leaves/${id}`)
  },

  approve: (id: string, notes?: string) => {
    return apiService.post(`/leaves/${id}/approve`, { notes })
  },

  reject: (id: string, reason: string) => {
    return apiService.post(`/leaves/${id}/reject`, { reason })
  },

  cancel: (id: string) => {
    return apiService.post(`/leaves/${id}/cancel`)
  },

  getBalance: (employeeId: string) => {
    return apiService.get(`/leaves/balance/${employeeId}`)
  },
}

// Attendance API
export const attendanceAPI = {
  getAll: (params?: any) => {
    return apiService.get('/attendance', { params })
  },

  getByEmployee: (employeeId: string, params?: any) => {
    return apiService.get(`/attendance/employee/${employeeId}`, { params })
  },

  checkIn: (data: any) => {
    return apiService.post('/attendance/check-in', data)
  },

  checkOut: (data: any) => {
    return apiService.post('/attendance/check-out', data)
  },

  manualEntry: (data: any) => {
    return apiService.post('/attendance/manual', data)
  },

  update: (id: string, data: any) => {
    return apiService.put(`/attendance/${id}`, data)
  },

  getReport: (params: any) => {
    return apiService.get('/attendance/report', { params })
  },

  export: (params?: any) => {
    return apiService.get('/attendance/export', {
      params,
      responseType: 'blob'
    })
  },
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => {
    return apiService.get('/dashboard/stats')
  },

  getActivities: (params?: any) => {
    return apiService.get('/dashboard/activities', { params })
  },

  getCharts: (type: string, params?: any) => {
    return apiService.get(`/dashboard/charts/${type}`, { params })
  },
}

// File Upload API
export const fileAPI = {
  upload: (file: File, type: string = 'general') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    return apiService.upload('/files/upload', formData)
  },

  delete: (fileId: string) => {
    return apiService.delete(`/files/${fileId}`)
  },

  getUrl: (fileId: string) => {
    return apiService.get(`/files/${fileId}/url`)
  },
}

// Notification API
export const notificationAPI = {
  getAll: (params?: any) => {
    return apiService.get('/notifications', { params })
  },

  markAsRead: (id: string) => {
    return apiService.patch(`/notifications/${id}/read`)
  },

  markAllAsRead: () => {
    return apiService.patch('/notifications/mark-all-read')
  },

  delete: (id: string) => {
    return apiService.delete(`/notifications/${id}`)
  },
}

// Settings API
export const settingsAPI = {
  getAll: () => {
    return apiService.get('/settings')
  },

  update: (key: string, value: any) => {
    return apiService.put(`/settings/${key}`, { value })
  },

  bulkUpdate: (settings: Record<string, any>) => {
    return apiService.put('/settings/bulk', { settings })
  },
}

export default api