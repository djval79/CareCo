// Common types for the HR System

// Base types
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface User extends BaseEntity {
  name: string
  email: string
  role: 'admin' | 'hr' | 'manager' | 'employee'
  avatar?: string
  status: 'active' | 'inactive'
  firstName?: string
  lastName?: string
  phone?: string
  departmentId?: string
  isSuperadmin?: boolean
  emailNotifications?: boolean
  lastLogin?: string
  lastActivity?: string
  onesignalPlayerId?: string
  companyId?: number
  userAuthId?: string
  countryPhonecode?: string
  mobile?: string
  gender?: 'male' | 'female'
  salutation?: string
  locale?: string
  login?: 'enable' | 'disable'
  countryId?: number
}

export interface Employee extends BaseEntity {
  firstName: string
  lastName: string
  email: string
  phone: string
  departmentId: string
  designationId: string
  hireDate: string
  salary: number
  status: 'active' | 'inactive' | 'terminated'
  avatar?: string
  employeeId?: string
  fatherName?: string
  motherName?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed'
  nationality?: string
  religion?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelation?: string
  bloodGroup?: string
  medicalConditions?: string
  education?: string[]
  certifications?: string[]
  languages?: string[]
  bankName?: string
  bankAccountNumber?: string
  bankRoutingNumber?: string
  taxId?: string
  socialSecurityNumber?: string
  photo?: string
  resume?: string
  documents?: string[]
  notes?: string
}

export interface Department extends BaseEntity {
  name: string
  description?: string
  headId?: string
  employeeCount: number
  budget?: number
  location?: string
  phoneNumber?: string
  email?: string
  isActive?: boolean
  parentDepartmentId?: string
  costCenter?: string
}

export interface Designation extends BaseEntity {
  title: string
  departmentId: string
  level: string
  description?: string
  grade?: string
  isActive?: boolean
  reportsTo?: string
  minSalary?: number
  maxSalary?: number
  skillsRequired?: string[]
  responsibilities?: string[]
  qualifications?: string[]
  experienceRequired?: number
  isLeadershipRole?: boolean
}

export interface Job extends BaseEntity {
  title: string
  departmentId: string
  designationId: string
  description: string
  requirements: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'intern' | 'remote'
  experience: string
  salary: {
    min: number
    max: number
    currency: string
    period?: 'monthly' | 'yearly'
  }
  status: 'draft' | 'active' | 'closed' | 'on-hold'
  openings: number
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  applicationDeadline?: string
  skills?: string[]
  benefits?: string[]
  workingHours?: string
  travelRequirements?: string
  reportingManager?: string
  employmentType?: 'permanent' | 'temporary' | 'probation'
  remoteWorkAllowed?: boolean
  postedBy?: string
  approvedBy?: string
  approvedAt?: string
  viewCount?: number
  applicationCount?: number
}

export interface JobApplication extends BaseEntity {
  jobId: string
  candidateName: string
  candidateEmail: string
  candidatePhone: string
  resume: string
  coverLetter?: string
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected' | 'withdrawn'
  appliedAt: string
  source: 'website' | 'referral' | 'job-board' | 'social-media' | 'direct-application'
  sourceDetails?: string
  score?: number
  rating?: number
  experience?: number
  currentLocation?: string
  expectedSalary?: number
  noticePeriod?: string
  availabilityDate?: string
  skills?: string[]
  education?: string
  workHistory?: string[]
  interviewIds?: string[]
  notes?: string
  resumeFile?: string
  coverLetterFile?: string
  portfolio?: string
  linkedInProfile?: string
  githubProfile?: string
  additionalDocuments?: string[]
}

export interface Candidate extends BaseEntity {
  name: string
  email: string
  phone: string
  resume: string
  skills: string[]
  experience: number
  location: string
  expectedSalary: number
  status: 'active' | 'hired' | 'rejected' | 'contacted' | 'interested' | 'not-interested'
  notes?: string
  source?: string
  linkedInProfile?: string
  githubProfile?: string
  portfolio?: string
  currentCompany?: string
  currentRole?: string
  availabilityDate?: string
  noticePeriod?: string
  preferredLocation?: string
  workTypePreference?: 'remote' | 'onsite' | 'hybrid'
  educationBackground?: string[]
  certifications?: string[]
  languages?: string[]
  projects?: string[]
  achievements?: string[]
  interestLevel?: 'high' | 'medium' | 'low'
  lastContacted?: string
  nextFollowUp?: string
  tags?: string[]
  score?: number
  rating?: number
  resumeFile?: string
  additionalDocuments?: string[]
}

export interface Interview extends BaseEntity {
  jobApplicationId: string
  candidateId: string
  interviewerId: string
  scheduledAt: string
  duration: number
  type: 'phone' | 'video' | 'in-person' | 'technical' | 'hr' | 'panel' | 'group'
  location?: string
  meetingLink?: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no-show'
  feedback?: string
  rating?: number
  round?: number
  interviewPanel?: string[]
  interviewType?: 'screening' | 'technical' | 'behavioral' | 'cultural' | 'final'
  mode?: 'online' | 'offline'
  isMandatory?: boolean
  preparationNotes?: string
  actualStartTime?: string
  actualEndTime?: string
  scorecard?: {
    technical?: number
    communication?: number
    cultural?: number
    overall?: number
  }
  recommendation?: 'strong-hire' | 'hire' | 'maybe' | 'no-hire'
  nextSteps?: string
  rejectionReason?: string
  compensationOffered?: number
  startDate?: string
}

export interface Leave extends BaseEntity {
  employeeId: string
  type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'unpaid' | 'other' | 'emergency' | 'compassionate'
  startDate: string
  endDate: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'pending-approval'
  approverId?: string
  approvedAt?: string
  rejectionReason?: string
  attachments?: string[]
  substituteEmployeeId?: string
  emergencyContact?: string
  medicalCertificate?: string
  isHalfDay?: boolean
  halfDayPeriod?: 'morning' | 'afternoon'
  workHandOver?: string
  returnDate?: string
  leaveEncashment?: boolean
  encashmentAmount?: number
  financialYear?: string
  carryForward?: boolean
  carryForwardDays?: number
  holidayDuringLeave?: number
  workingDays?: number
}

export interface Attendance extends BaseEntity {
  employeeId: string
  date: string
  checkIn?: string
  checkOut?: string
  breakTime: number
  totalHours: number
  status: 'present' | 'absent' | 'late' | 'half-day' | 'holiday' | 'leave' | 'weekend'
  notes?: string
  shiftId?: string
  overtime?: number
  lateArrival?: number
  earlyDeparture?: number
  breakStart?: string
  breakEnd?: string
  location?: string
  deviceId?: string
  ipAddress?: string
  selfieUrl?: string
  locationCoords?: {
    latitude: number
    longitude: number
  }
  approvalStatus?: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
  approvedAt?: string
  manualEntry?: boolean
  entryMethod?: 'biometric' | 'manual' | 'mobile' | 'web'
  geoLocation?: string
  batteryLevel?: number
  networkType?: string
}

export interface Holiday extends BaseEntity {
  name: string
  date: string
  type: 'national' | 'regional' | 'company' | 'religious' | 'federal'
  description?: string
  isRecurring?: boolean
  recurringPattern?: string
  duration?: number
  color?: string
  isOptional?: boolean
  departmentId?: string
  location?: string
  workingDay?: boolean
  isHalfDay?: boolean
  halfDayPeriod?: 'morning' | 'afternoon'
  tags?: string[]
  calendarType?: 'gregorian' | 'hijri' | 'fiscal'
  fiscalYear?: string
}

export interface Shift extends BaseEntity {
  name: string
  startTime: string
  endTime: string
  description?: string
  breakDuration?: number
  workingHours?: number
  isActive?: boolean
  color?: string
  type?: 'day' | 'night' | 'rotating' | 'flexible' | 'split'
  gracePeriod?: number
  maxOvertime?: number
  overtimeRate?: number
  locations?: string[]
  requirements?: string[]
  skills?: string[]
  certificationRequired?: string[]
  departmentId?: string
  employeeCount?: number
  requiredPositions?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  physicalDemands?: string
  workingConditions?: string
  toolsRequired?: string[]
  safetyRequirements?: string[]
  trainingRequired?: string[]
  experienceRequired?: number
  isOvernight?: boolean
  weekendAllowed?: boolean
  holidayWork?: boolean
}

export interface Appreciation extends BaseEntity {
  fromEmployeeId: string
  toEmployeeId: string
  title: string
  message: string
  type: 'recognition' | 'achievement' | 'milestone' | 'teamwork' | 'innovation' | 'leadership'
  isPublic: boolean
  attachments?: string[]
  tags?: string[]
  category?: string
  priority?: 'low' | 'medium' | 'high'
  gift?: string
  amount?: number
  currency?: string
  departmentId?: string
  eventId?: string
  milestones?: string[]
  impact?: string
  feedback?: string
  visibility?: 'public' | 'team' | 'department' | 'private'
  allowComments?: boolean
  commentCount?: number
  likeCount?: number
  recipientCount?: number
}

export interface DashboardStats {
  totalEmployees: number
  activeJobs: number
  pendingApplications: number
  upcomingInterviews: number
  leaveRequests: number
  recentActivities: Activity[]
  totalDepartments?: number
  totalJobOpenings?: number
  averageTimeToHire?: number
  employeeTurnoverRate?: number
  topPerformingDepartments?: string[]
  recruitmentFunnel?: {
    applied: number
    screened: number
    interviewed: number
    offered: number
    hired: number
  }
  attendanceRate?: number
  leaveUtilization?: number
  performanceMetrics?: {
    averageRating: number
    topPerformers: string[]
    improvementAreas: string[]
  }
}

export interface Activity extends BaseEntity {
  type: 'employee' | 'job' | 'interview' | 'leave' | 'attendance' | 'appreciation'
  description: string
  timestamp: string
  userId: string
  metadata?: Record<string, any>
  entityId?: string
  severity?: 'info' | 'warning' | 'error' | 'success'
  tags?: string[]
  priority?: 'low' | 'medium' | 'high'
  readBy?: string[]
  isRead?: boolean
  location?: string
  userAgent?: string
  ipAddress?: string
  sessionId?: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
  meta?: {
    timestamp: string
    version: string
    requestId?: string
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext?: boolean
  hasPrev?: boolean
  nextPage?: number
  prevPage?: number
}

export interface ApiError {
  code: string
  message: string
  details?: string
  field?: string
  timestamp: string
}

// Form types
export interface EmployeeFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  departmentId: string
  designationId: string
  hireDate: string
  salary: number
  status: 'active' | 'inactive'
  employeeId?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed'
  address?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelation?: string
  bankName?: string
  bankAccountNumber?: string
  taxId?: string
  medicalConditions?: string
  photo?: string
  resume?: string
  documents?: File[]
}

export interface JobFormData {
  title: string
  departmentId: string
  designationId: string
  description: string
  requirements: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'intern' | 'remote'
  experience: string
  salary: {
    min: number
    max: number
    currency: string
  }
  status: 'draft' | 'active' | 'closed'
  openings: number
  priority?: 'low' | 'medium' | 'high'
  applicationDeadline?: string
  skills?: string[]
  benefits?: string[]
  workingHours?: string
  travelRequirements?: string
  reportingManager?: string
  remoteWorkAllowed?: boolean
}

export interface ApplicationFormData {
  candidateName: string
  candidateEmail: string
  candidatePhone: string
  jobId: string
  resume: File
  coverLetter?: string
  coverLetterFile?: File
  experience?: number
  currentLocation?: string
  expectedSalary?: number
  noticePeriod?: string
  skills?: string[]
  portfolio?: string
  linkedInProfile?: string
  githubProfile?: string
  additionalDocuments?: File[]
}

// Filter and Search types
export interface FilterOptions {
  search?: string
  departmentId?: string
  status?: string
  type?: string
  dateRange?: {
    start: string
    end: string
  }
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
  location?: string
  experience?: string
  salaryRange?: {
    min: number
    max: number
  }
  skills?: string[]
  tags?: string[]
  priority?: string
  isActive?: boolean
  approved?: boolean
}

export interface TableColumn<T = any> {
  key: keyof T | string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T, column: TableColumn<T>) => any
  formatter?: (value: any, row: T) => string
  className?: string
  headerClassName?: string
  filterable?: boolean
  filterType?: 'text' | 'select' | 'date' | 'number' | 'boolean'
  filterOptions?: Array<{ label: string; value: any }>
  showSortIcon?: boolean
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  emptyMessage?: string
  onSort?: (key: string, order: 'asc' | 'desc') => void
  onFilter?: (filters: FilterOptions) => void
  onRowClick?: (row: T) => void
  onSelectionChange?: (selectedRows: T[]) => void
  selectedRows?: T[]
  pagination?: {
    page: number
    limit: number
    total: number
    onPageChange: (page: number) => void
  }
  virtualScrolling?: boolean
  height?: number
  stickyHeader?: boolean
  stickyColumns?: number
  expandable?: boolean
  expandableContent?: (row: T) => React.ReactNode
  actions?: Array<{
    key: string
    label: string
    icon?: React.ComponentType<any>
    onClick: (row: T) => void
    disabled?: (row: T) => boolean
    className?: string
  }>
  rowClassName?: (row: T, index: number) => string
  onCellClick?: (row: T, column: TableColumn<T>, event: React.MouseEvent) => void
  onCellDoubleClick?: (row: T, column: TableColumn<T>, event: React.MouseEvent) => void
  contextMenu?: (row: T, event: React.MouseEvent) => React.ReactNode
}

// Utility types
export type CreateRequest<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateRequest<T> = Partial<CreateRequest<T>> & { id: string }
export type DeleteRequest = { id: string; softDelete?: boolean }

export type Status = 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'draft'
export type UserRole = 'admin' | 'hr' | 'manager' | 'employee'
export type JobType = 'full-time' | 'part-time' | 'contract' | 'intern' | 'remote'
export type LeaveType = 'annual' | 'sick' | 'maternity' | 'paternity' | 'unpaid' | 'other' | 'emergency'
export type ApplicationStatus = 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected' | 'withdrawn'
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no-show'
export type InterviewType = 'phone' | 'video' | 'in-person' | 'technical' | 'hr' | 'panel' | 'group'

// Error handling types
export interface ValidationError {
  field: string
  message: string
  code?: string
}

export interface ApiException {
  code: number
  message: string
  errors?: ValidationError[]
  timestamp: string
  requestId?: string
}

// Notification types
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: string
  read: boolean
  userId: string
  entityId?: string
  entityType?: string
  actionUrl?: string
  priority?: 'low' | 'medium' | 'high'
  expiresAt?: string
  metadata?: Record<string, any>
}

// File upload types
export interface FileUpload {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
  uploadedBy: string
  description?: string
  tags?: string[]
  isPublic?: boolean
  category?: string
}

export interface UploadProgress {
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
  id: string
}

// Search types
export interface SearchResult<T> {
  item: T
  score: number
  highlights: string[]
  matchedFields: string[]
}

export interface SearchOptions {
  query: string
  filters?: FilterOptions
  includeAggregations?: boolean
  includeHighlights?: boolean
  maxResults?: number
  boostFields?: Record<string, number>
}

// Export types
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json'
  filename?: string
  dateRange?: {
    start: string
    end: string
  }
  selectedFields?: string[]
  includeFilters?: boolean
  includePagination?: boolean
  template?: string
  branding?: {
    logo?: string
    companyName?: string
    colors?: string[]
  }
}

// Audit types
export interface AuditLog {
  id: string
  entityId: string
  entityType: string
  action: 'create' | 'update' | 'delete' | 'view' | 'export' | 'import'
  userId: string
  timestamp: string
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  sessionId?: string
  reason?: string
  metadata?: Record<string, any>
}