import { useTheme, radius, spacing, fontSize, PATIENTS } from '../../theme.jsx'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import usePatient from '../../hooks/usePatient'
import {
  HiOutlineSparkles,
  HiOutlineLightBulb,
  HiOutlineHandRaised,
  HiOutlineMagnifyingGlass,
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2'

const PATIENT = PATIENTS[0]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 5) return { text: 'Good Night', Icon: HiOutlineSparkles }
  if (hour < 12) return { text: 'Good Morning', Icon: HiOutlineSparkles }
  if (hour < 17) return { text: 'Good Afternoon', Icon: HiOutlineLightBulb }
  if (hour < 21) return { text: 'Good Evening', Icon: HiOutlineSparkles }
  return { text: 'Good Night', Icon: HiOutlineSparkles }
}

const TIPS = [
  'Upload your latest lab results to improve trial matching accuracy by ~15%.',
  'Your GLYCO-ADVANCE trial has only 12 slots left — consider applying soon!',
  'Complete your profile to unlock personalized AI health insights.',
  'Check the Nearby Trials page for new trials added this week.',
  'Your ONCO-TARGET application was approved! Schedule your screening visit.',
]

export default function WelcomeBanner() {
  const { colors, fonts } = useTheme()
  const navigate = useNavigate()
  const { firstName } = usePatient()
  const greet = getGreeting()
  const GreetIcon = greet.Icon
  const tip = TIPS[Math.floor(Date.now() / 86400000) % TIPS.length]

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
          <GreetIcon style={{ width: 16, height: 16, color: colors.accent }} /> {greet.text}
        </div>
        <h2 style={{ margin: 0, fontSize: '22px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, lineHeight: 1.3, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          Welcome back, <span style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.green})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{firstName}</span>
        </h2>
        <p style={{ margin: `${spacing.xs} 0 0`, fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.body, lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <HiOutlineLightBulb style={{ width: 14, height: 14, color: colors.accent, flexShrink: 0 }} /> Tip: {tip}
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
            display: 'flex', alignItems: 'center', gap: spacing.xs,
          }}
        >
          <HiOutlineMagnifyingGlass style={{ width: 16, height: 16 }} /> Find Trials
        </button>
        <button
          onClick={() => navigate('/patient/profile')}
          style={{
            padding: `10px ${spacing.lg}`, borderRadius: radius.sm,
            background: colors.surface, color: colors.textPrimary,
            border: `1px solid ${colors.border}`,
            fontSize: fontSize.sm, fontWeight: 600, fontFamily: fonts.body,
            cursor: 'pointer', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: spacing.xs,
          }}
        >
          <HiOutlineClipboardDocumentList style={{ width: 16, height: 16 }} /> My Profile
        </button>
      </div>
    </motion.div>
  )
}
