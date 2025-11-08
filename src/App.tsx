import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/dashboard/Dashboard'
import Employees from './pages/employees/Employees'
import Departments from './pages/departments/Departments'
import Designations from './pages/designations/Designations'
import Jobs from './pages/jobs/Jobs'
import JobApplications from './pages/job-applications/JobApplications'
import CandidateDatabase from './pages/candidate-database/CandidateDatabase'
import InterviewSchedule from './pages/interview-schedule/InterviewSchedule'
import JobSkills from './pages/job-skills/JobSkills'
import OfferLetters from './pages/offer-letters/OfferLetters'
import Leaves from './pages/leaves/Leaves'
import Attendances from './pages/attendances/Attendances'
import Holidays from './pages/holidays/Holidays'
import Shifts from './pages/shifts/Shifts'
import Appreciations from './pages/appreciations/Appreciations'
import JobReports from './pages/job-reports/JobReports'
import LetterTemplates from './pages/letter-templates/LetterTemplates'
import './App.css'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <AppLayout
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Employee Management Routes */}
          <Route path="/employees" element={<Employees />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/designations" element={<Designations />} />
          
          {/* Recruitment Routes */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job-applications" element={<JobApplications />} />
          <Route path="/candidate-database" element={<CandidateDatabase />} />
          <Route path="/interview-schedule" element={<InterviewSchedule />} />
          <Route path="/job-skills" element={<JobSkills />} />
          <Route path="/offer-letters" element={<OfferLetters />} />
          
          {/* Leave & Attendance Routes */}
          <Route path="/leaves" element={<Leaves />} />
          <Route path="/attendances" element={<Attendances />} />
          <Route path="/holidays" element={<Holidays />} />
          <Route path="/shifts" element={<Shifts />} />
          
          {/* Performance Routes */}
          <Route path="/appreciations" element={<Appreciations />} />
          
          {/* Reports Routes */}
          <Route path="/job-reports" element={<JobReports />} />

          {/* Letter Templates Route */}
          <Route path="/letter-templates" element={<LetterTemplates />} />
        </Routes>
      </AppLayout>
    </div>
  )
}

export default App