import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiOutlineLightBulb,
  HiOutlineBolt,
  HiOutlineCursorArrowRays,
  HiOutlineChartBar,
  HiOutlineBellAlert,
} from 'react-icons/hi2'

const INSIGHTS = [
  {
    Icon: HiOutlineBolt,
    title: 'New Trials Available',
    desc: '3 new clinical trials available near your location that match your profile.',
    type: 'accent',
    action: 'View Nearby Trials →',
    link: '/patient/nearby',
  },
  {
    Icon: HiOutlineCursorArrowRays,
    title: 'High Match Score',
    desc: 'GLYCO-ADVANCE has a 94% match score for your condition. Consider applying soon — only 12 slots left.',
    type: 'green',
    action: 'View Trial →',
    link: '/patient/trials',
  },
  {
    Icon: HiOutlineChartBar,
    title: 'Profile Completeness',
    desc: 'Adding your latest lab results could improve match accuracy by ~15%. Upload in My Profile.',
    type: 'accent',
    action: 'Go to Profile →',
    link: '/patient/profile',
  },
  {
    Icon: HiOutlineBellAlert,
    title: 'Application Update',
    desc: 'Your ONCO-TARGET application has been approved! Next step: screening appointment.',
    type: 'green',
    action: 'View Applications →',
    link: '/patient/applications',
  },
]

export default function AIInsights() {
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
      <h2 style={{ margin: `0 0 ${spacing.lg}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
        <HiOutlineLightBulb style={{ width: 22, height: 22, color: colors.accent }} />
        AI Insights
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        {INSIGHTS.map((ins, i) => {
          const borderColor = ins.type === 'green' ? colors.green : colors.accent
          const bgColor = ins.type === 'green' ? colors.greenGlow : colors.accentGlow
          const InsIcon = ins.Icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              style={{
                background: bgColor,
                borderLeft: `3px solid ${borderColor}`,
                borderRadius: radius.sm,
                padding: spacing.md,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => navigate(ins.link)}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: 4 }}>
                <InsIcon style={{ width: 16, height: 16, color: borderColor }} />
                <span style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>
                  {ins.title}
                </span>
              </div>
              <p style={{ margin: `0 0 ${spacing.sm}`, fontSize: fontSize.xs, color: colors.textSecondary, lineHeight: 1.5, fontFamily: fonts.body }}>
                {ins.desc}
              </p>
              <span style={{ fontSize: fontSize.xs, fontWeight: 600, color: borderColor, fontFamily: fonts.body }}>
                {ins.action}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
