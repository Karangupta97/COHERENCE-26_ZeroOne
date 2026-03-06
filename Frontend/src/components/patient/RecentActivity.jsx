import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiOutlinePaperAirplane,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineDocumentText,
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2'

const ACTIVITIES = [
  { id: 1, icon: HiOutlinePaperAirplane, iconBg: 'accent', title: 'Applied to trial', desc: 'GLYCO-ADVANCE Phase III', time: '10 min ago', link: '/patient/applications' },
  { id: 2, icon: HiOutlineSparkles, iconBg: 'green', title: 'New trial matched', desc: 'CARDIO-PROTECT matched with 81% score', time: '25 min ago', link: '/patient/trials' },
  { id: 3, icon: HiOutlineCheckCircle, iconBg: 'green', title: 'Application approved', desc: 'ONCO-TARGET Phase III approved by clinic', time: '1 hr ago', link: '/patient/applications' },
  { id: 4, icon: HiOutlineDocumentText, iconBg: 'accent', title: 'Profile updated', desc: 'Medical records uploaded successfully', time: '2 hrs ago', link: '/patient/profile' },
  { id: 5, icon: HiOutlineSparkles, iconBg: 'green', title: 'AI analysis complete', desc: 'Eligibility reassessed for 3 trials', time: '3 hrs ago', link: '/patient/trials' },
]

export default function RecentActivity() {
  const { colors, fonts } = useTheme()
  const navigate = useNavigate()

  return (
    <div style={{
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: radius.lg,
      boxShadow: colors.shadow,
      padding: spacing.lg,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
        <h2 style={{ margin: 0, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <HiOutlineClipboardDocumentList style={{ width: 22, height: 22, color: colors.accent }} />
          Recent Activity
        </h2>
        <button
          onClick={() => navigate('/patient/notifications')}
          style={{
            padding: `4px ${spacing.sm}`, borderRadius: radius.sm,
            background: 'transparent', color: colors.accent,
            border: 'none', fontSize: fontSize.xs, fontWeight: 600,
            fontFamily: fonts.body, cursor: 'pointer',
          }}
        >
          View All →
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {ACTIVITIES.map((act, i) => {
          const Icon = act.icon
          const color = act.iconBg === 'green' ? colors.green : colors.accent
          const glow = act.iconBg === 'green' ? colors.greenGlow : colors.accentGlow
          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => navigate(act.link)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: spacing.md,
                padding: `${spacing.md} ${spacing.sm}`,
                borderBottom: i < ACTIVITIES.length - 1 ? `1px solid ${colors.border}` : 'none',
                cursor: 'pointer',
                borderRadius: radius.sm,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.card}` }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: radius.md, flexShrink: 0,
                background: glow, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon style={{ width: 16, height: 16, color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>
                  {act.title}
                </div>
                <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2, fontFamily: fonts.body }}>
                  {act.desc}
                </div>
              </div>
              <span style={{ fontSize: fontSize.xs, color: colors.textSecondary, flexShrink: 0, fontFamily: fonts.mono || fonts.body, whiteSpace: 'nowrap' }}>
                {act.time}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
