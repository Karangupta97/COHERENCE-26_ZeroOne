import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme';

// ── Doctor Portal Imports ──
import LoginPage from './Auth/LoginPage';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPatients from './pages/doctor/DoctorPatients';
import PatientDetail from './pages/doctor/PatientDetail';
import DoctorChat from './pages/doctor/DoctorChat';
import DoctorAlerts from './pages/doctor/DoctorAlerts';
import DoctorTrials from './pages/doctor/DoctorTrials';
import DoctorSettings from './pages/doctor/DoctorSettings';

// ── Patient Portal Imports ──
import PatientDashboard from './pages/patients/PatientDashboard';

// ── Clinic Portal Imports ──
import Sidebar from './components/shared/Sidebar';
import NavBar from './components/shared/NavBar';
import ClinicDashboard from './pages/clinic/ClinicDashboard';
import PostTrial from './pages/clinic/PostTrial';
import MatchedCandidates from './pages/clinic/MatchedCandidates';
import CandidateWorkflow from './pages/clinic/CandidateWorkflow';
import EnrollmentFunnel from './pages/clinic/EnrollmentFunnel';
import TrialsManagement from './pages/clinic/TrialsManagement';
import Notifications from './pages/clinic/Notifications';
import Settings from './pages/clinic/Settings';
import { NOTIFICATIONS, CANDIDATES } from './pages/clinic/data/mockData';

import './App.css';

// ── Coming Soon placeholder ──
function ComingSoon({ role }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: 20, fontFamily: "'Source Sans 3', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
        <h2 style={{ margin: '0 0 8px' }}>{role} Portal</h2>
        <p style={{ opacity: 0.6 }}>Coming Soon</p>
      </div>
    </div>
  );
}

// ── Clinic Portal Page Titles ──
const PAGE_TITLES = {
  'dashboard': '📊 Clinic Dashboard',
  'post-trial': '📝 Post New Trial',
  'candidates': '👥 Matched Candidates',
  'workflow': '🔄 Candidate Workflow',
  'funnel': '📈 Enrollment Funnel',
  'trials': '🧪 Trials Management',
  'notifications': '🔔 Notifications',
  'settings': '⚙️ Settings',
};

// ── Clinic Layout (Sidebar + NavBar + pages) ──
function ClinicLayout() {
  const [activePage, setActivePage] = useState('dashboard');
  const [candidates, setCandidates] = useState(CANDIDATES);
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <ClinicDashboard setPage={setActivePage} />;
      case 'post-trial': return <PostTrial setPage={setActivePage} />;
      case 'candidates': return <MatchedCandidates candidates={candidates} setCandidates={setCandidates} />;
      case 'workflow': return <CandidateWorkflow candidates={candidates} setCandidates={setCandidates} />;
      case 'funnel': return <EnrollmentFunnel />;
      case 'trials': return <TrialsManagement setPage={setActivePage} />;
      case 'notifications': return <Notifications />;
      case 'settings': return <Settings />;
      default: return <ClinicDashboard setPage={setActivePage} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <Sidebar activePage={activePage} setPage={setActivePage} />
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh', width: 'calc(100vw - 240px)', maxWidth: 'calc(100vw - 240px)', overflow: 'hidden' }}>
        <NavBar
          title={PAGE_TITLES[activePage] || 'Clinic Portal'}
          unreadCount={unreadCount}
          onBellClick={() => setActivePage('notifications')}
        />
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative', padding: '24px' }}>
          <div key={activePage} style={{ animation: 'pageTransition 0.3s ease' }}>
            {renderPage()}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pageTransition {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Main App ──
export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        {/* Landing / Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Doctor Portal */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/patients" element={<DoctorPatients />} />
        <Route path="/doctor/patients/:id" element={<PatientDetail />} />
        <Route path="/doctor/chat/:patientId" element={<DoctorChat />} />
        <Route path="/doctor/alerts" element={<DoctorAlerts />} />
        <Route path="/doctor/trials" element={<DoctorTrials />} />
        <Route path="/doctor/settings" element={<DoctorSettings />} />

        {/* Clinic Portal */}
        <Route path="/clinic/*" element={<ClinicLayout />} />

        {/* Patient Portal */}
        <Route path="/patient/*" element={<PatientDashboard />} />
      </Routes>
    </ThemeProvider>
  );
}
