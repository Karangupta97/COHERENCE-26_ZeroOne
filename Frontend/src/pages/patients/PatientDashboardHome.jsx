import { useTheme, spacing } from '../../theme.jsx'
import WelcomeBanner from '../../components/patient/WelcomeBanner.jsx'
import PatientStats from '../../components/patient/PatientStats.jsx'
import HealthScore from '../../components/patient/HealthScore.jsx'
import RecommendedTrials from '../../components/patient/RecommendedTrials.jsx'
import TrialComparison from '../../components/patient/TrialComparison.jsx'
import ApplicationStepper from '../../components/patient/ApplicationStepper.jsx'
import RecentActivity from '../../components/patient/RecentActivity.jsx'
import AIInsights from '../../components/patient/AIInsights.jsx'
import NearbyTrialsMap from '../../components/patient/NearbyTrialsMap.jsx'
import MyApplications from '../../components/patient/MyApplications.jsx'

export default function PatientDashboardHome() {
  const { colors } = useTheme()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Stats */}
      <PatientStats />

      {/* Health Score + Application Progress — side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
        <HealthScore />
        <ApplicationStepper />
      </div>

      {/* AI Recommended Trials */}
      <RecommendedTrials />

      {/* Trial Comparison Tool */}
      <TrialComparison />

      {/* Activity + Insights — side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
        <RecentActivity />
        <AIInsights />
      </div>

      {/* Map */}
      <NearbyTrialsMap />

      {/* Applications table */}
      <MyApplications />
    </div>
  )
}
