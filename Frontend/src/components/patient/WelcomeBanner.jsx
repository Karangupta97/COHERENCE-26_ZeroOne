import { useTheme, radius, spacing, fontSize, PATIENTS } from '../../theme.jsx'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const PATIENT = PATIENTS[0]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return { text: 'Good Morning', emoji: '🌅' }
  if (hour < 17) return { text: 'Good Afternoon', emoji: '☀️' }
  return { text: 'Good Evening', emoji: '🌙' }
}

const TIPS = [
  '💡 Tip: Upload your latest lab results to improve trial matching accuracy by ~15%.',
  '💡 Tip: Your GLYCO-ADVANCE trial has only 12 slots left — consider applying soon!',
  '💡 Tip: Complete your profile to unlock personalized AI health insights.',
  '💡 Tip: Check the Nearby Trials page for new trials added this week.',
  '💡 Tip: Your ONCO-TARGET application was approved! Schedule your screening visit.',
]

export default function WelcomeBanner() {
  const { colors, fonts } = useTheme()
  const navigate = useNavigate()
  const greet = getGreeting()
  const tip = TIPS[Math.floor(Date.now() / 86400000) % TIPS.length] // Rotates daily

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: `linear-gradient(135deg, ${colors.accent}18, ${colors.green}18)`,
        border: `1px solid ${colors.accent}30`,
        borderRadius: radius.lg,
        padding: `${spacing.lg} ${spacing.xl}`,
        display: 'flex', alignItems: 'center', gap: spacing.xl,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: `${colors.accent}10` }} />
      <div style={{ position: 'absolute', bottom: -30, right: 80, width: 80, height: 80, borderRadius: '50%', background: `${colors.green}10` }} />

      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 4, display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          {greet.emoji} {greet.text}
        </div>
        <h2 style={{ margin: 0, fontSize: '22px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, lineHeight: 1.3 }}>
          Welcome back, <span style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.green})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Rajesh</span> 👋
        </h2>
        <p style={{ margin: `${spacing.xs} 0 0`, fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.body, lineHeight: 1.5 }}>
          {tip}
        </p>
      </div>

      <div style={{ display: 'flex', gap: spacing.sm, flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <button
          onClick={() => navigate('/patient/trials')}
          style={{
            padding: `10px ${spacing.lg}`, borderRadius: radius.sm,
            background: colors.accent, color: '#fff', border: 'none',
            fontSize: fontSize.sm, fontWeight: 600, fontFamily: fonts.body,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          🔍 Find Trials
        </button>
        <button
          onClick={() => navigate('/patient/profile')}
          style={{
            padding: `10px ${spacing.lg}`, borderRadius: radius.sm,
            background: colors.surface, color: colors.textPrimary,
            border: `1px solid ${colors.border}`,
            fontSize: fontSize.sm, fontWeight: 600, fontFamily: fonts.body,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          📋 My Profile
        </button>
      </div>
    </motion.div>
  )
}
