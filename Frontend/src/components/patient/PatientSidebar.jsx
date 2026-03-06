import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { useLocation, useNavigate } from 'react-router-dom'
import usePatient from '../../hooks/usePatient'
import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineDocumentText,
  HiOutlineBell,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2'

const NAV_ITEMS = [
  { label: 'Dashboard',          icon: HiOutlineHome,              path: '/patient/dashboard' },
  { label: 'My Profile',         icon: HiOutlineUserCircle,        path: '/patient/profile' },
  { label: 'Find Clinical Trials', icon: HiOutlineMagnifyingGlass, path: '/patient/trials' },
  { label: 'Nearby Trials',      icon: HiOutlineMapPin,            path: '/patient/nearby' },
  { label: 'My Applications',    icon: HiOutlineDocumentText,      path: '/patient/applications' },
  { label: 'Notifications',      icon: HiOutlineBell,              path: '/patient/notifications', badge: 3 },
  { label: 'Settings',           icon: HiOutlineCog6Tooth,         path: '/patient/settings' },
]

export default function PatientSidebar() {
  const { colors, fonts } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const { fullName, initials, anonymizedId } = usePatient()

  const sidebarBg = colors.card
  const activeBg = colors.accentGlow
  const activeColor = colors.accent

  return (
    <aside
      style={{
        width: 240,
        minHeight: '100vh',
        background: sidebarBg,
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        padding: `${spacing.lg} 0`,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
        fontFamily: fonts.body,
      }}
    >
      {/* ── Logo ── */}
      <div style={{ padding: `0 ${spacing.lg}`, marginBottom: spacing.xl }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: radius.md,
              background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
              color: '#fff', fontSize: fontSize.lg, fontWeight: 800, fontFamily: fonts.heading,
            }}
          >
            C
          </span>
          <div>
            <div style={{ fontSize: fontSize.base, fontWeight: 700, fontFamily: fonts.heading, color: colors.textPrimary, lineHeight: 1.2 }}>
              TrialMatch AI
            </div>
            <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: fonts.mono || fonts.body, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Patient Portal
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: `0 ${spacing.sm}` }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path || (item.path === '/patient/dashboard' && location.pathname === '/patient')
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                padding: `10px ${spacing.md}`,
                marginBottom: 2,
                borderRadius: radius.md,
                border: 'none',
                cursor: 'pointer',
                fontFamily: fonts.body,
                fontSize: fontSize.sm,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? activeColor : colors.textSecondary,
                background: isActive ? activeBg : 'transparent',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                position: 'relative',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = `${colors.border}80` }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              {isActive && (
                <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, borderRadius: 2, background: activeColor }} />
              )}
              <Icon style={{ width: 18, height: 18, flexShrink: 0 }} />
              {item.label}
              {item.badge && (
                <span style={{
                  marginLeft: 'auto', minWidth: 20, height: 20,
                  borderRadius: radius.full, background: colors.red || '#EF4444',
                  color: '#fff', fontSize: '10px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 6px',
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Patient Profile (bottom) ── */}
      <div style={{ padding: `0 ${spacing.lg}`, borderTop: `1px solid ${colors.border}`, paddingTop: spacing.md }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <div style={{
            width: 36, height: 36, borderRadius: radius.full,
            background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: fontSize.sm, fontWeight: 700, fontFamily: fonts.heading,
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary }}>{fullName}</div>
            <div style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Patient ID: {anonymizedId}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
