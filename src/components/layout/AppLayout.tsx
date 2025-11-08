import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

interface AppLayoutProps {
  children: ReactNode
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Employee Management',
    children: [
      { name: 'Employees', href: '/employees', icon: UserGroupIcon },
      { name: 'Departments', href: '/departments', icon: BuildingOfficeIcon },
      { name: 'Designations', href: '/designations', icon: BriefcaseIcon },
    ],
  },
  {
    name: 'Recruitment',
    children: [
      { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
      { name: 'Job Applications', href: '/job-applications', icon: UserGroupIcon },
      { name: 'Candidate Database', href: '/candidate-database', icon: UserGroupIcon },
      { name: 'Interview Schedule', href: '/interview-schedule', icon: CalendarDaysIcon },
      { name: 'Job Skills', href: '/job-skills', icon: BriefcaseIcon },
      { name: 'Offer Letters', href: '/offer-letters', icon: CalendarDaysIcon },
    ],
  },
  {
    name: 'Leave & Attendance',
    children: [
      { name: 'Leaves', href: '/leaves', icon: CalendarDaysIcon },
      { name: 'Attendances', href: '/attendances', icon: ClockIcon },
      { name: 'Holidays', href: '/holidays', icon: CalendarDaysIcon },
      { name: 'Shifts', href: '/shifts', icon: ClockIcon },
    ],
  },
  {
    name: 'Performance',
    children: [
      { name: 'Appreciations', href: '/appreciations', icon: ChartBarIcon },
    ],
  },
  {
    name: 'Reports',
    children: [
      { name: 'Job Reports', href: '/job-reports', icon: ChartBarIcon },
    ],
  },
]

export default function AppLayout({ children, sidebarCollapsed, setSidebarCollapsed }: AppLayoutProps) {
  const location = useLocation()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
        } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:block`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 flex-shrink-0 items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <span className="text-white font-bold text-sm">HR</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">HR System</span>
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <ChevronLeftIcon className={`h-5 w-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  {item.children ? (
                    <div>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {item.name}
                      </div>
                      <div className="ml-4 space-y-1">
                        {item.children.map((child) => {
                          const Icon = child.icon
                          const isActive = isActiveRoute(child.href)
                          return (
                            <Link
                              key={child.name}
                              to={child.href}
                              className={`nav-item ${isActive ? 'active' : ''}`}
                              onClick={() => setMobileSidebarOpen(false)}
                              data-testid={`nav-${child.href.replace('/', '')}`}
                              data-link={child.href}
                            >
                              <Icon className="mr-3 h-5 w-5" />
                              {child.name}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`nav-item ${isActiveRoute(item.href) ? 'active' : ''}`}
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User info */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">John Doe</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Header */}
        <header className="flex h-16 flex-shrink-0 bg-white shadow-sm border-b border-gray-200">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              {/* Page title will be handled by individual page components */}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* User menu and notifications can be added here */}
              <div className="text-sm text-gray-700">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar close button */}
      {mobileSidebarOpen && (
        <div className="lg:hidden">
          <button
            type="button"
            className="fixed top-4 right-4 z-50 rounded-md bg-white p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  )
}