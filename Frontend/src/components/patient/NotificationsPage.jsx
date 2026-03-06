import { useState } from 'react'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion } from 'framer-motion'
import {
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlinePaperAirplane,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
} from 'react-icons/hi2'

const NOTIFICATIONS = [
  { id: 1, icon: HiOutlineSparkles,              type: 'match',    title: 'New Trial Match',           desc: 'CARDIO-PROTECT matched with your profile at 81% score.',                    time: '5 min ago',  read: false },
  { id: 2, icon: HiOutlineCheckCircle,            type: 'approved', title: 'Application Approved',      desc: 'Your application for ONCO-TARGET Phase III has been approved by the clinic.', time: '1 hr ago',   read: false },
  { id: 3, icon: HiOutlinePaperAirplane,          type: 'applied',  title: 'Application Submitted',     desc: 'Your application for GLYCO-ADVANCE has been submitted successfully.',        time: '3 hrs ago',  read: false },
  { id: 4, icon: HiOutlineExclamationTriangle,    type: 'alert',    title: 'Profile Incomplete',        desc: 'Upload recent lab results to improve your AI match accuracy by ~15%.',       time: '6 hrs ago',  read: true },
  { id: 5, icon: HiOutlineSparkles,              type: 'match',    title: '3 New Nearby Trials',        desc: 'New clinical trials are recruiting within 25km of your location.',           time: '1 day ago',  read: true },
  { id: 6, icon: HiOutlineInformationCircle,      type: 'info',     title: 'Screening Scheduled',       desc: 'Your screening appointment for ONCO-TARGET is on 10 Mar 2026 at 10am.',     time: '2 days ago', read: true },
  { id: 7, icon: HiOutlineCheckCircle,            type: 'approved', title: 'Doctor Review Complete',     desc: 'Dr. Sharma has reviewed and approved your GLYCO-ADVANCE referral.',          time: '3 days ago', read: true },
]

export default function NotificationsPage() {
  const { colors, fonts } = useTheme()
  const [notifications, setNotifications] = useState(NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })))

  const typeColors = {
    match:    { bg: colors.accentGlow, color: colors.accent },
    approved: { bg: colors.greenGlow,  color: colors.green },
    applied:  { bg: colors.accentGlow, color: colors.accent },
    alert:    { bg: `${colors.yellow || '#F59E0B'}18`, color: colors.yellow || '#F59E0B' },
    info:     { bg: colors.accentGlow, color: colors.accent },
  }

  const cardStyle = { background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.lg, boxShadow: colors.shadow, padding: spacing.lg }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: fontSize.xl, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
            🔔 Notifications
          </h2>
          <p style={{ margin: `4px 0 0`, fontSize: fontSize.sm, color: colors.textSecondary }}>
            You have <strong style={{ color: colors.accent }}>{unreadCount}</strong> unread notifications
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{
            padding: `8px ${spacing.lg}`, borderRadius: radius.sm, background: colors.accentGlow,
            color: colors.accent, border: `1px solid ${colors.accent}40`, fontSize: fontSize.sm,
            fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
          }}>
            Mark All Read
          </button>
        )}
      </motion.div>

      {/* Notification list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        {notifications.map((notif, i) => {
          const Icon = notif.icon
          const tc = typeColors[notif.type] || typeColors.info
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{
                ...cardStyle,
                display: 'flex', alignItems: 'flex-start', gap: spacing.md,
                opacity: notif.read ? 0.7 : 1,
                borderLeft: notif.read ? `1px solid ${colors.border}` : `3px solid ${tc.color}`,
              }}
              onClick={() => {
                setNotifications(notifications.map((n) => n.id === notif.id ? { ...n, read: true } : n))
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = tc.color }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = notif.read ? colors.border : tc.color }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: radius.md, flexShrink: 0,
                background: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon style={{ width: 18, height: 18, color: tc.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <span style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>{notif.title}</span>
                  {!notif.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: colors.accent, flexShrink: 0 }} />}
                </div>
                <p style={{ margin: `4px 0 0`, fontSize: fontSize.xs, color: colors.textSecondary, lineHeight: 1.5, fontFamily: fonts.body }}>
                  {notif.desc}
                </p>
              </div>
              <span style={{ fontSize: fontSize.xs, color: colors.textSecondary, flexShrink: 0, fontFamily: fonts.mono || fonts.body, whiteSpace: 'nowrap' }}>
                {notif.time}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
