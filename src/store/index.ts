import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User, DashboardStats } from '@/types'

interface AppState {
  // User state
  user: User | null
  isAuthenticated: boolean
  sidebarCollapsed: boolean
  theme: 'light' | 'dark'
  
  // Dashboard state
  dashboardStats: DashboardStats | null
  loading: {
    dashboard: boolean
  }
  
  // UI state
  notifications: Notification[]
  modals: {
    employeeForm: boolean
    jobForm: boolean
    leaveForm: boolean
  }
  
  // Actions
  setUser: (user: User | null) => void
  setAuthenticated: (authenticated: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  setDashboardStats: (stats: DashboardStats) => void
  setLoading: (key: keyof AppState['loading'], value: boolean) => void
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  openModal: (modal: keyof AppState['modals']) => void
  closeModal: (modal: keyof AppState['modals']) => void
  logout: () => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  read: boolean
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        sidebarCollapsed: false,
        theme: 'light',
        dashboardStats: null,
        loading: {
          dashboard: false,
        },
        notifications: [],
        modals: {
          employeeForm: false,
          jobForm: false,
          leaveForm: false,
        },
        
        // Actions
        setUser: (user) => set({ user }, false, 'setUser'),
        setAuthenticated: (isAuthenticated) => set({ isAuthenticated }, false, 'setAuthenticated'),
        setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }, false, 'setSidebarCollapsed'),
        setTheme: (theme) => set({ theme }, false, 'setTheme'),
        setDashboardStats: (dashboardStats) => set({ dashboardStats }, false, 'setDashboardStats'),
        setLoading: (key, value) => 
          set((state) => ({ 
            loading: { ...state.loading, [key]: value } 
          }), false, 'setLoading'),
        addNotification: (notification) => 
          set((state) => ({ 
            notifications: [notification, ...state.notifications] 
          }), false, 'addNotification'),
        removeNotification: (id) => 
          set((state) => ({ 
            notifications: state.notifications.filter(n => n.id !== id) 
          }), false, 'removeNotification'),
        openModal: (modal) => 
          set((state) => ({ 
            modals: { ...state.modals, [modal]: true } 
          }), false, 'openModal'),
        closeModal: (modal) => 
          set((state) => ({ 
            modals: { ...state.modals, [modal]: false } 
          }), false, 'closeModal'),
        logout: () => 
          set({ 
            user: null, 
            isAuthenticated: false,
            notifications: []
          }, false, 'logout'),
      }),
      {
        name: 'hr-system-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
        }),
      }
    ),
    {
      name: 'hr-system-store',
    }
  )
)

// Employee store
interface EmployeeState {
  employees: any[]
  departments: any[]
  designations: any[]
  selectedEmployee: any | null
  filters: {
    department: string
    status: string
    search: string
  }
  loading: boolean
  setEmployees: (employees: any[]) => void
  setDepartments: (departments: any[]) => void
  setDesignations: (designations: any[]) => void
  setSelectedEmployee: (employee: any | null) => void
  setFilters: (filters: Partial<EmployeeState['filters']>) => void
  setLoading: (loading: boolean) => void
  addEmployee: (employee: any) => void
  updateEmployee: (id: string, employee: any) => void
  deleteEmployee: (id: string) => void
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  departments: [],
  designations: [],
  selectedEmployee: null,
  filters: {
    department: '',
    status: '',
    search: '',
  },
  loading: false,
  
  setEmployees: (employees) => set({ employees }, false, 'setEmployees'),
  setDepartments: (departments) => set({ departments }, false, 'setDepartments'),
  setDesignations: (designations) => set({ designations }, false, 'setDesignations'),
  setSelectedEmployee: (selectedEmployee) => set({ selectedEmployee }, false, 'setSelectedEmployee'),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  }), false, 'setFilters'),
  setLoading: (loading) => set({ loading }, false, 'setLoading'),
  
  addEmployee: (employee) => 
    set((state) => ({ 
      employees: [employee, ...state.employees] 
    }), false, 'addEmployee'),
    
  updateEmployee: (id, employee) => 
    set((state) => ({ 
      employees: state.employees.map(emp => 
        emp.id === id ? { ...emp, ...employee } : emp
      ) 
    }), false, 'updateEmployee'),
    
  deleteEmployee: (id) => 
    set((state) => ({ 
      employees: state.employees.filter(emp => emp.id !== id) 
    }), false, 'deleteEmployee'),
}))

// Job store
interface JobState {
  jobs: any[]
  applications: any[]
  candidates: any[]
  interviews: any[]
  selectedJob: any | null
  filters: {
    status: string
    department: string
    search: string
  }
  loading: boolean
  setJobs: (jobs: any[]) => void
  setApplications: (applications: any[]) => void
  setCandidates: (candidates: any[]) => void
  setInterviews: (interviews: any[]) => void
  setSelectedJob: (job: any | null) => void
  setFilters: (filters: Partial<JobState['filters']>) => void
  setLoading: (loading: boolean) => void
  addJob: (job: any) => void
  updateJob: (id: string, job: any) => void
  deleteJob: (id: string) => void
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  applications: [],
  candidates: [],
  interviews: [],
  selectedJob: null,
  filters: {
    status: '',
    department: '',
    search: '',
  },
  loading: false,

  setJobs: (jobs) => set({ jobs }),
  setApplications: (applications) => set({ applications }),
  setCandidates: (candidates) => set({ candidates }),
  setInterviews: (interviews) => set({ interviews }),
  setSelectedJob: (selectedJob) => set({ selectedJob }),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  setLoading: (loading) => set({ loading }),

  addJob: (job) =>
    set((state) => ({
      jobs: [job, ...state.jobs]
    })),

  updateJob: (id, job) =>
    set((state) => ({
      jobs: state.jobs.map(j =>
        j.id === id ? { ...j, ...job } : j
      )
    })),

  deleteJob: (id) =>
    set((state) => ({
      jobs: state.jobs.filter(j => j.id !== id)
    })),
}))

// Leave store
interface LeaveState {
  leaves: any[]
  attendances: any[]
  holidays: any[]
  shifts: any[]
  selectedLeave: any | null
  filters: {
    status: string
    type: string
    employee: string
    dateRange: { start: string; end: string }
  }
  loading: boolean
  setLeaves: (leaves: any[]) => void
  setAttendances: (attendances: any[]) => void
  setHolidays: (holidays: any[]) => void
  setShifts: (shifts: any[]) => void
  setSelectedLeave: (leave: any | null) => void
  setFilters: (filters: Partial<LeaveState['filters']>) => void
  setLoading: (loading: boolean) => void
  addLeave: (leave: any) => void
  updateLeave: (id: string, leave: any) => void
  deleteLeave: (id: string) => void
}

export const useLeaveStore = create<LeaveState>((set, get) => ({
  leaves: [],
  attendances: [],
  holidays: [],
  shifts: [],
  selectedLeave: null,
  filters: {
    status: '',
    type: '',
    employee: '',
    dateRange: { start: '', end: '' },
  },
  loading: false,
  
  setLeaves: (leaves) => set({ leaves }, false, 'setLeaves'),
  setAttendances: (attendances) => set({ attendances }, false, 'setAttendances'),
  setHolidays: (holidays) => set({ holidays }, false, 'setHolidays'),
  setShifts: (shifts) => set({ shifts }, false, 'setShifts'),
  setSelectedLeave: (selectedLeave) => set({ selectedLeave }, false, 'setSelectedLeave'),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  }), false, 'setFilters'),
  setLoading: (loading) => set({ loading }, false, 'setLoading'),
  
  addLeave: (leave) => 
    set((state) => ({ 
      leaves: [leave, ...state.leaves] 
    }), false, 'addLeave'),
    
  updateLeave: (id, leave) => 
    set((state) => ({ 
      leaves: state.leaves.map(l => 
        l.id === id ? { ...l, ...leave } : l
      ) 
    }), false, 'updateLeave'),
    
  deleteLeave: (id) => 
    set((state) => ({ 
      leaves: state.leaves.filter(l => l.id !== id) 
    }), false, 'deleteLeave'),
}))