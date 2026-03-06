import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiOutlineBeaker,
  HiOutlineDocumentText,
  HiOutlineMapPin,
  HiOutlineCheckCircle,
} from 'react-icons/hi2'

const STATS = [
  { label: 'MATCHED TRIALS', value: 5, icon: HiOutlineBeaker, change: '↑ 17%', link: '/patient/trials' },
  { label: 'APPLICATIONS SUBMITTED', value: 5, icon: HiOutlineDocumentText, change: '↑ 23%', link: '/patient/applications' },
  { label: 'NEARBY TRIALS', value: 7, icon: HiOutlineMapPin, change: '↑ 8%', link: '/patient/nearby' },
  { label: 'APPROVED TRIALS', value: 1, icon: HiOutlineCheckCircle, change: '↑ 5%', link: '/patient/applications' },
]

export default function PatientStats() {
  const { colors, fonts } = useTheme()
  const navigate = useNavigate()

  return (
    <div>
      {/* Gradient accent bar — matches Clinic Dashboard */}
      <div style={{
        height: 4,
        borderRadius: 2,
        background: `linear-gradient(90deg, ${colors.accent}, ${colors.green})`,
        marginBottom: spacing.lg,
      }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.md }}>
        {STATS.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              onClick={() => navigate(stat.link)}
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: radius.lg,
                padding: spacing.lg,
                boxShadow: colors.shadow,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.accent; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.md }}>
                <div style={{
                  width: 40, height: 40, borderRadius: radius.md,
                  background: colors.accentGlow,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon style={{ width: 20, height: 20, color: colors.accent }} />
                </div>
                <span style={{
                  fontSize: fontSize.xs,
                  fontWeight: 600,
                  color: colors.green,
                  background: colors.greenGlow,
                  padding: '2px 8px',
                  borderRadius: radius.full,
                  fontFamily: fonts.mono || fonts.body,
                }}>
                  {stat.change}
                </span>
              </div>

              <div style={{ fontSize: fontSize.hero, fontWeight: 800, fontFamily: "'Open Sans', sans-serif", color: colors.textPrimary, lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: fontSize.xs, fontWeight: 600, color: colors.textSecondary,
                letterSpacing: '1.5px', marginTop: spacing.xs,
                fontFamily: fonts.mono || fonts.body,
              }}>
                {stat.label}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
