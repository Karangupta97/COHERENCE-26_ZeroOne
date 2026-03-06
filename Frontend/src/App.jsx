import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import PatientDashboard from './pages/PatientDashboard'
import './App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/patient/*" element={<PatientDashboard />} />
      </Routes>
    </div>
  )
}

export default App
