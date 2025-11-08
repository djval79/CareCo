import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { apiService, employeeAPI, departmentAPI, jobAPI, jobApplicationAPI, candidateAPI, interviewAPI, offerAPI, leaveAPI, attendanceAPI, dashboardAPI } from '@/services/api'
import { useToast } from '@/components/ui/Toast'

// Generic API hooks
export function useApiQuery<T>(
  key: string[],
  apiCall: () => Promise<{ data: T }>,
  options?: Omit<UseQueryOptions<T, AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const response = await apiCall()
      return response.data
    },
    ...options,
  })
}

export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<{ data: TData }>,
  options?: UseMutationOptions<{ data: TData }, AxiosError, TVariables>
) {
  const { success, error } = useToast()

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Show success toast if not disabled
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      // Show error toast
      error('An error occurred. Please try again.')

      if (options?.onError) {
        options.onError(error, variables, context)
      }
    },
    ...options,
  })
}

// Employee hooks
export function useEmployees(params?: any) {
  return useApiQuery(
    ['employees', params],
    () => employeeAPI.getAll(params),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )
}

export function useEmployee(id: string) {
  return useApiQuery(
    ['employee', id],
    () => employeeAPI.getById(id),
    {
      enabled: !!id,
    }
  )
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()
  const { success } = useToast()

  return useApiMutation(
    employeeAPI.create,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['employees'] })
        success('Employee created successfully')
      },
    }
  )
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient()
  const { success } = useToast()

  return useApiMutation(
    ({ id, ...data }: any) => employeeAPI.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['employees'] })
        queryClient.invalidateQueries({ queryKey: ['employee'] })
        success('Employee updated successfully')
      },
    }
  )
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient()
  const { success } = useToast()

  return useApiMutation(
    employeeAPI.delete,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['employees'] })
        success('Employee deleted successfully')
      },
    }
  )
}

// Department hooks
export function useDepartments() {
  return useApiQuery(
    ['departments'],
    () => departmentAPI.getAll(),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  )
}

export function useCreateDepartment() {
  const queryClient = useQueryClient()
  const { success } = useToast()

  return useApiMutation(
    departmentAPI.create,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['departments'] })
        success('Department created successfully')
      },
    }
  )
}

// Job hooks
export function useJobs(params?: any) {
  return useApiQuery(
    ['jobs', params],
    () => jobAPI.getAll(params),
    {
      staleTime: 5 * 60 * 1000,
    }
  )
}

export function useJob(id: string) {
  return useApiQuery(
    ['job', id],
    () => jobAPI.getById(id),
    {
      enabled: !!id,
    }
  )
}

export function useCreateJob() {
  const queryClient = useQueryClient()
  const { success } = useToast()

  return useApiMutation(
    jobAPI.create,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['jobs'] })
        success('Job created successfully')
      },
    }
  )
}

export function useUpdateJob() {
  const queryClient = useQueryClient()
  const { success } = useToast()

  return useApiMutation(
    ({ id, ...data }: any) => jobAPI.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['jobs'] })
        queryClient.invalidateQueries({ queryKey: ['job'] })
        success('Job updated successfully')
      },
    }
  )
}

// Job Application hooks
export function useJobApplications(params?: any) {
  return useApiQuery(
    ['job-applications', params],
    () => jobApplicationAPI.getAll(params),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  )
}

export function useJobApplication(id: string) {
  return useApiQuery(
    ['job-application', id],
    () => jobApplicationAPI.getById(id),
    {
      enabled: !!id,
    }
  )
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()
  const { success } = useToast()

  return useApiMutation(
    ({ id, status, notes }: any) => jobApplicationAPI.updateStatus(id, status, notes),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['job-applications'] })
        queryClient.invalidateQueries({ queryKey: ['job-application'] })
        success('Application status updated successfully')
      },
    }
  )
}

// Candidate hooks
export function useCandidates(params?: any) {
  return useApiQuery(
    ['candidates', params],
    () => candidateAPI.getAll(params),
    {
      staleTime: 5 * 60 * 1000,
    }
  )
}

export function useCandidate(id: string) {
  return useApiQuery(
    ['candidate', id],
    () => candidateAPI.getById(id),
    {
      enabled: !!id,
    }
  )
}

// Interview hooks
export function useInterviews(params?: any) {
  return useApiQuery(
    ['interviews', params],
    () => interviewAPI.getAll(params),
    {
      staleTime: 2 * 60 * 1000,
    }
  )
}

export function useCreateInterview() {
  const queryClient = useQueryClient()
  const { success } = useToast()

  return useApiMutation(
    interviewAPI.create,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['interviews'] })
        success('Interview scheduled successfully')
      },
    }
  )
}

export function useUpdateInterview() {
  const queryClient = useQueryClient()
  const { success } = useToast()

  return useApiMutation(
    ({ id, ...data }: any) => interviewAPI.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['interviews'] })
        queryClient.invalidateQueries({ queryKey: ['interview'] })
        success('Interview updated successfully')
      },
    }
  )
}

// Offer hooks
export function useOffers(params?: any) {
  return useApiQuery(
    ['offers', params],
    () => offerAPI.getAll(params),
    {
      staleTime: 2 * 60 * 1000,
    }
  )
}

export function useCreateOffer() {
  const queryClient = useQueryClient()
  const { success } = useToast()

  return useApiMutation(
    offerAPI.create,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['offers'] })
        success('Offer created successfully')
      },
    }
  )
}

export function useSendOffer() {
  const queryClient = useQueryClient()
  const { success } = useToast()

  return useApiMutation(
    ({ id }: any) => offerAPI.send(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['offers'] })
        success('Offer sent successfully')
      },
    }
  )
}

// Leave hooks
export function useLeaves(params?: any) {
  return useApiQuery(
    ['leaves', params],
    () => leaveAPI.getAll(params),
    {
      staleTime: 2 * 60 * 1000,
    }
  )
}

export function useCreateLeave() {
  const queryClient = useQueryClient()
  const { success } = useToast()

  return useApiMutation(
    leaveAPI.create,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['leaves'] })
        success('Leave request submitted successfully')
      },
    }
  )
}

export function useApproveLeave() {
  const queryClient = useQueryClient()
  const { success } = useToast()

  return useApiMutation(
    ({ id, notes }: any) => leaveAPI.approve(id, notes),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['leaves'] })
        success('Leave approved successfully')
      },
    }
  )
}

export function useRejectLeave() {
  const queryClient = useQueryClient()
  const { success } = useToast()

  return useApiMutation(
    ({ id, reason }: any) => leaveAPI.reject(id, reason),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['leaves'] })
        success('Leave rejected')
      },
    }
  )
}

// Attendance hooks
export function useAttendances(params?: any) {
  return useApiQuery(
    ['attendances', params],
    () => attendanceAPI.getAll(params),
    {
      staleTime: 1 * 60 * 1000, // 1 minute
    }
  )
}

export function useCheckIn() {
  const queryClient = useQueryClient()
  const { success } = useToast()

  return useApiMutation(
    attendanceAPI.checkIn,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['attendances'] })
        success('Checked in successfully')
      },
    }
  )
}

export function useCheckOut() {
  const queryClient = useQueryClient()
  const { success } = useToast()

  return useApiMutation(
    attendanceAPI.checkOut,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['attendances'] })
        success('Checked out successfully')
      },
    }
  )
}

// Dashboard hooks
export function useDashboardStats() {
  return useApiQuery(
    ['dashboard-stats'],
    () => dashboardAPI.getStats(),
    {
      staleTime: 5 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    }
  )
}

export function useDashboardActivities(params?: any) {
  return useApiQuery(
    ['dashboard-activities', params],
    () => dashboardAPI.getActivities(params),
    {
      staleTime: 2 * 60 * 1000,
    }
  )
}

// Authentication hooks
export function useAuth() {
  return {
    login: useApiMutation((data: any) => Promise.resolve({ data })),
    logout: useApiMutation(() => Promise.resolve({ data: null })),
    refresh: useApiMutation(() => Promise.resolve({ data: null })),
    me: useApiQuery(['auth-me'], () => Promise.resolve({ data: null })),
  }
}

// Utility hooks
export function useInvalidateQueries() {
  const queryClient = useQueryClient()

  return {
    invalidateEmployees: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
    invalidateJobs: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
    invalidateApplications: () => queryClient.invalidateQueries({ queryKey: ['job-applications'] }),
    invalidateCandidates: () => queryClient.invalidateQueries({ queryKey: ['candidates'] }),
    invalidateInterviews: () => queryClient.invalidateQueries({ queryKey: ['interviews'] }),
    invalidateOffers: () => queryClient.invalidateQueries({ queryKey: ['offers'] }),
    invalidateLeaves: () => queryClient.invalidateQueries({ queryKey: ['leaves'] }),
    invalidateAttendances: () => queryClient.invalidateQueries({ queryKey: ['attendances'] }),
    invalidateDashboard: () => queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
  }
}