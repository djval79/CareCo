import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Organization {
  id: string
  name: string
  domain: string
  logo?: string
  settings: {
    timezone: string
    currency: string
    language: string
    dateFormat: string
    theme: 'light' | 'dark' | 'auto'
    features: {
      recruitment: boolean
      attendance: boolean
      leave: boolean
      performance: boolean
      analytics: boolean
      email: boolean
      integrations: boolean
    }
  }
  subscription: {
    plan: 'starter' | 'professional' | 'enterprise'
    status: 'active' | 'inactive' | 'suspended'
    expiresAt: string
    limits: {
      employees: number
      storage: number // in GB
      apiCalls: number
    }
  }
  createdAt: string
  updatedAt: string
}

export interface TenantUser {
  id: string
  organizationId: string
  userId: string
  role: 'owner' | 'admin' | 'manager' | 'employee'
  permissions: string[]
  departments: string[]
  isActive: boolean
  joinedAt: string
  lastActiveAt: string
}

interface MultiTenantState {
  // Current organization
  currentOrganization: Organization | null
  userOrganizations: Organization[]

  // Tenant users
  tenantUsers: TenantUser[]
  currentUserRole: TenantUser | null

  // UI state
  organizationSwitching: boolean
  loading: boolean

  // Actions
  setCurrentOrganization: (organization: Organization | null) => void
  setUserOrganizations: (organizations: Organization[]) => void
  setTenantUsers: (users: TenantUser[]) => void
  setCurrentUserRole: (role: TenantUser | null) => void
  setOrganizationSwitching: (switching: boolean) => void
  setLoading: (loading: boolean) => void

  // Business logic
  switchOrganization: (organizationId: string) => Promise<void>
  createOrganization: (data: Partial<Organization>) => Promise<Organization>
  updateOrganization: (id: string, data: Partial<Organization>) => Promise<Organization>
  inviteUser: (email: string, role: TenantUser['role'], departments?: string[]) => Promise<void>
  updateUserRole: (userId: string, role: TenantUser['role'], permissions?: string[]) => Promise<void>
  removeUser: (userId: string) => Promise<void>

  // Permissions
  hasPermission: (permission: string) => boolean
  hasRole: (role: TenantUser['role']) => boolean
  canAccessFeature: (feature: keyof Organization['settings']['features']) => boolean

  // Utility functions
  getOrganizationById: (id: string) => Organization | undefined
  getUsersByDepartment: (departmentId: string) => TenantUser[]
  getOrganizationStats: () => {
    totalUsers: number
    activeUsers: number
    departmentsCount: number
    subscriptionStatus: string
  }
}

export const useMultiTenantStore = create<MultiTenantState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentOrganization: null,
      userOrganizations: [],
      tenantUsers: [],
      currentUserRole: null,
      organizationSwitching: false,
      loading: false,

      // Basic setters
      setCurrentOrganization: (organization) => set({ currentOrganization: organization }),
      setUserOrganizations: (organizations) => set({ userOrganizations: organizations }),
      setTenantUsers: (users) => set({ tenantUsers: users }),
      setCurrentUserRole: (role) => set({ currentUserRole: role }),
      setOrganizationSwitching: (switching) => set({ organizationSwitching: switching }),
      setLoading: (loading) => set({ loading }),

      // Business logic implementations
      switchOrganization: async (organizationId) => {
        const { userOrganizations } = get()
        const organization = userOrganizations.find(org => org.id === organizationId)

        if (!organization) {
          throw new Error('Organization not found')
        }

        set({ organizationSwitching: true })

        try {
          // In a real implementation, this would make API calls to:
          // 1. Validate user has access to the organization
          // 2. Switch the tenant context
          // 3. Load organization-specific data
          // 4. Update user permissions

          set({
            currentOrganization: organization,
            currentUserRole: null, // Would be loaded from API
            organizationSwitching: false
          })

          // Trigger data reload for the new organization
          window.location.reload() // In a real app, this would be more sophisticated

        } catch (error) {
          set({ organizationSwitching: false })
          throw error
        }
      },

      createOrganization: async (data) => {
        // Mock implementation - in real app, this would call an API
        const newOrganization: Organization = {
          id: `org_${Date.now()}`,
          name: data.name || 'New Organization',
          domain: data.domain || '',
          logo: data.logo,
          settings: {
            timezone: data.settings?.timezone || 'UTC',
            currency: data.settings?.currency || 'USD',
            language: data.settings?.language || 'en',
            dateFormat: data.settings?.dateFormat || 'MM/dd/yyyy',
            theme: data.settings?.theme || 'light',
            features: {
              recruitment: true,
              attendance: true,
              leave: true,
              performance: true,
              analytics: true,
              email: true,
              integrations: false,
              ...data.settings?.features,
            },
          },
          subscription: {
            plan: 'starter',
            status: 'active',
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            limits: {
              employees: 50,
              storage: 10,
              apiCalls: 10000,
            },
            ...data.subscription,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        const { userOrganizations } = get()
        set({
          userOrganizations: [...userOrganizations, newOrganization],
          currentOrganization: newOrganization
        })

        return newOrganization
      },

      updateOrganization: async (id, data) => {
        const { userOrganizations, currentOrganization } = get()
        const updatedOrganizations = userOrganizations.map(org =>
          org.id === id ? { ...org, ...data, updatedAt: new Date().toISOString() } : org
        )

        const updatedOrganization = updatedOrganizations.find(org => org.id === id)

        set({
          userOrganizations: updatedOrganizations,
          currentOrganization: currentOrganization?.id === id ? updatedOrganization : currentOrganization
        })

        return updatedOrganization!
      },

      inviteUser: async (email, role, departments = []) => {
        // Mock implementation - would send invitation email
        console.log(`Inviting ${email} as ${role} to departments:`, departments)
        // In real implementation, this would call an API to send invitation
      },

      updateUserRole: async (userId, role, permissions = []) => {
        const { tenantUsers } = get()
        const updatedUsers = tenantUsers.map(user =>
          user.id === userId ? { ...user, role, permissions } : user
        )

        set({ tenantUsers: updatedUsers })
      },

      removeUser: async (userId) => {
        const { tenantUsers } = get()
        set({
          tenantUsers: tenantUsers.filter(user => user.id !== userId)
        })
      },

      // Permission checks
      hasPermission: (permission) => {
        const { currentUserRole } = get()
        if (!currentUserRole) return false

        return currentUserRole.permissions.includes(permission) ||
               currentUserRole.role === 'owner' ||
               (currentUserRole.role === 'admin' && ['read', 'write', 'delete'].includes(permission.split(':')[1]))
      },

      hasRole: (role) => {
        const { currentUserRole } = get()
        if (!currentUserRole) return false

        const roleHierarchy = {
          owner: 4,
          admin: 3,
          manager: 2,
          employee: 1,
        }

        return roleHierarchy[currentUserRole.role] >= roleHierarchy[role]
      },

      canAccessFeature: (feature) => {
        const { currentOrganization } = get()
        if (!currentOrganization) return false

        return currentOrganization.settings.features[feature] &&
               currentOrganization.subscription.status === 'active'
      },

      // Utility functions
      getOrganizationById: (id) => {
        const { userOrganizations } = get()
        return userOrganizations.find(org => org.id === id)
      },

      getUsersByDepartment: (departmentId) => {
        const { tenantUsers } = get()
        return tenantUsers.filter(user => user.departments.includes(departmentId))
      },

      getOrganizationStats: () => {
        const { tenantUsers, currentOrganization } = get()

        return {
          totalUsers: tenantUsers.length,
          activeUsers: tenantUsers.filter(user => user.isActive).length,
          departmentsCount: new Set(tenantUsers.flatMap(user => user.departments)).size,
          subscriptionStatus: currentOrganization?.subscription.status || 'inactive',
        }
      },
    }),
    {
      name: 'hr-multi-tenant-storage',
      partialize: (state) => ({
        currentOrganization: state.currentOrganization,
        userOrganizations: state.userOrganizations,
        currentUserRole: state.currentUserRole,
      }),
    }
  )
)

// Organization context hook
export function useOrganization() {
  const {
    currentOrganization,
    userOrganizations,
    switchOrganization,
    createOrganization,
    updateOrganization,
    hasPermission,
    hasRole,
    canAccessFeature,
    getOrganizationStats,
  } = useMultiTenantStore()

  return {
    organization: currentOrganization,
    organizations: userOrganizations,
    switchOrganization,
    createOrganization,
    updateOrganization,
    hasPermission,
    hasRole,
    canAccessFeature,
    stats: getOrganizationStats(),
  }
}

// Tenant management hook
export function useTenantManagement() {
  const {
    tenantUsers,
    currentUserRole,
    inviteUser,
    updateUserRole,
    removeUser,
    getUsersByDepartment,
    loading,
    setLoading,
  } = useMultiTenantStore()

  return {
    users: tenantUsers,
    currentUser: currentUserRole,
    inviteUser,
    updateUserRole,
    removeUser,
    getUsersByDepartment,
    loading,
    setLoading,
  }
}

// Feature access hook
export function useFeatureAccess() {
  const { canAccessFeature, hasPermission, hasRole } = useMultiTenantStore()

  return {
    canAccessRecruitment: canAccessFeature('recruitment'),
    canAccessAttendance: canAccessFeature('attendance'),
    canAccessLeave: canAccessFeature('leave'),
    canAccessPerformance: canAccessFeature('performance'),
    canAccessAnalytics: canAccessFeature('analytics'),
    canAccessEmail: canAccessFeature('email'),
    canAccessIntegrations: canAccessFeature('integrations'),
    hasPermission,
    hasRole,
  }
}

export default useMultiTenantStore