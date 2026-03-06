import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { ALERTS } from '../../pages/doctor/data/mockData'
import { NOTIFICATIONS } from '../../pages/clinic/data/mockData'
import {
    HiOutlineHome,
    HiOutlineUserGroup,
    HiOutlineBeaker,
    HiOutlineChatBubbleLeftRight,
    HiOutlineBell,
    HiOutlineCog6Tooth,
    HiOutlineDocumentText,
    HiOutlineUserPlus,
    HiOutlineArrowPath,
    HiOutlineChartBar,
    HiOutlinePencilSquare,
} from 'react-icons/hi2'

// ── Clinic Portal nav items ──
const CLINIC_NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', icon: HiOutlineHome, path: null },
    { key: 'post-trial', label: 'Post Trial', icon: HiOutlinePencilSquare, path: null },
    { key: 'candidates', label: 'Matched Candidates', icon: HiOutlineUserGroup, path: null },
    { key: 'workflow', label: 'Candidate Workflow', icon: HiOutlineArrowPath, path: null },
    { key: 'funnel', label: 'Enrollment Funnel', icon: HiOutlineChartBar, path: null },
    { key: 'trials', label: 'Trials Management', icon: HiOutlineBeaker, path: null },
    { key: 'notifications', label: 'Notifications', icon: HiOutlineBell, path: null },
    { key: 'settings', label: 'Settings', icon: HiOutlineCog6Tooth, path: null },
]

// ── Doctor Portal nav items ──
const DOCTOR_NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', icon: HiOutlineHome, path: '/doctor/dashboard' },
    { key: 'patients', label: 'Patients', icon: HiOutlineUserGroup, path: '/doctor/patients' },
    { key: 'trials', label: 'Trial Matches', icon: HiOutlineBeaker, path: '/doctor/trials' },
    { key: 'chat', label: 'Chat', icon: HiOutlineChatBubbleLeftRight, path: '/doctor/chat/PT-0041' },
    { key: 'notifications', label: 'Notifications', icon: HiOutlineBell, path: '/doctor/alerts', badge: ALERTS.length },
    { key: 'settings', label: 'Settings', icon: HiOutlineCog6Tooth, path: '/doctor/settings' },
]

export default function Sidebar({ activePage, setPage }) {
    const { colors, fonts } = useTheme()
    const navigate = useNavigate()
    const location = useLocation()

    // Determine portal mode based on props
    const isClinicMode = typeof setPage === 'function'

    const unreadCount = isClinicMode
        ? NOTIFICATIONS.filter(n => !n.read).length
        : 0

    const isDoctorActive = (item) => {
        const path = location.pathname
        switch (item.key) {
            case 'dashboard': return path === '/doctor/dashboard'
            case 'patients': return path === '/doctor/patients' || path.startsWith('/doctor/patients/')
            case 'trials': return path === '/doctor/trials'
            case 'chat': return path.startsWith('/doctor/chat')
            case 'notifications': return path === '/doctor/alerts'
            case 'settings': return path === '/doctor/settings'
            default: return false
        }
    }

    const navItems = isClinicMode ? CLINIC_NAV_ITEMS : DOCTOR_NAV_ITEMS
    const portalLabel = isClinicMode ? 'Clinic Portal' : 'Doctor Portal'
    const profileName = isClinicMode ? 'Dr. Priya Sharma' : 'Dr. Priya Sharma'
    const profileSub = isClinicMode ? 'Clinic Admin' : 'Lead Investigator'

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
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, cursor: isClinicMode ? 'default' : 'pointer' }}
                    onClick={() => !isClinicMode && navigate('/doctor/dashboard')}
                >
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
                            {portalLabel}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Navigation ── */}
            <nav style={{ flex: 1, padding: `0 ${spacing.sm}` }}>
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = isClinicMode ? activePage === item.key : isDoctorActive(item)
                    const badgeCount = isClinicMode
                        ? (item.key === 'notifications' && unreadCount > 0 ? unreadCount : null)
                        : (item.badge || null)

                    return (
                        <button
                            key={item.key}
                            onClick={() => isClinicMode ? setPage(item.key) : navigate(item.path)}
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
                            {badgeCount && (
                                <span style={{
                                    marginLeft: 'auto', minWidth: 20, height: 20,
                                    borderRadius: radius.full, background: colors.red || '#EF4444',
                                    color: '#fff', fontSize: '10px', fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    padding: '0 6px',
                                }}>
                                    {badgeCount}
                                </span>
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* ── Profile (bottom) ── */}
            <div style={{ padding: `0 ${spacing.lg}`, borderTop: `1px solid ${colors.border}`, paddingTop: spacing.md }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: radius.full,
                        background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: fontSize.sm, fontWeight: 700, fontFamily: fonts.heading,
                    }}>
                        PS
                    </div>
                    <div>
                        <div style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary }}>{profileName}</div>
                        <div style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{profileSub}</div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
