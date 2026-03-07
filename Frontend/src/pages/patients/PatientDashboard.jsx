import { Routes, Route, Navigate } from 'react-router-dom'
import { useTheme, spacing } from '../../theme.jsx'
import PatientSidebar from '../../components/patient/PatientSidebar.jsx'
import PatientNavbar from '../../components/patient/PatientNavbar.jsx'
import PatientDashboardHome from './PatientDashboardHome.jsx'
import MyProfilePage from '../../components/patient/MyProfilePage.jsx'
import FindTrialsPage from '../../components/patient/FindTrialsPage.jsx'
import NearbyTrialsPage from '../../components/patient/NearbyTrialsPage.jsx'
import MyApplicationsPage from '../../components/patient/MyApplicationsPage.jsx'
import NotificationsPage from '../../components/patient/NotificationsPage.jsx'
import SettingsPage from '../../components/patient/SettingsPage.jsx'
import PatientReports from '../../components/patient/PatientReports.jsx'
import MyClinicalTrialDetails from '../../components/patient/MyClinicalTrialDetails.jsx'
import AIChatbot from '../../components/patient/AIChatbot.jsx'

export default function PatientDashboard() {
  const { colors } = useTheme()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bg }}>
      {/* Sidebar */}
      <PatientSidebar />

      {/* Main area */}
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top navbar */}
        <PatientNavbar />

        {/* Page content */}
        <main style={{ flex: 1, padding: spacing.lg, overflow: 'auto' }}>
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PatientDashboardHome />} />
            <Route path="profile" element={<MyProfilePage />} />
            <Route path="trials" element={<FindTrialsPage />} />
            <Route path="nearby" element={<NearbyTrialsPage />} />
            <Route path="applications" element={<MyApplicationsPage />} />
            <Route path="reports" element={<PatientReports />} />
            <Route path="clinical-details" element={<MyClinicalTrialDetails />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Floating AI Chatbot */}
      <AIChatbot />
    </div>
  )
}

