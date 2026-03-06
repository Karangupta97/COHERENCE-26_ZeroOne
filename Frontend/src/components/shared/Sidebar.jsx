import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { ALERTS } from '../../pages/doctor/data/mockData'
import { NOTIFICATIONS } from '../../pages/clinic/data/mockData'
import {
    HiOutlineHome,
    HiOutlineUserCircle,
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
import useDoctor from '../../hooks/useDoctor'
import useClinic from '../../hooks/useClinic'

const CLINIC_NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', icon: HiOutlineHome, path: null },
    { key: 'profile', label: 'My Profile', icon: HiOutlineUserCircle, path: null },
    { key: 'post-trial', label: 'Post Trial', icon: HiOutlinePencilSquare, path: null },
    { key: 'candidates', label: 'Matched Candidates', icon: HiOutlineUserGroup, path: null },
    { key: 'workflow', label: 'Candidate Workflow', icon: HiOutlineArrowPath, path: null },
    { key: 'funnel', label: 'Enrollment Funnel', icon: HiOutlineChartBar, path: null },
    { key: 'trials', label: 'Trials Management', icon: HiOutlineBeaker, path: null },
    { key: 'notifications', label: 'Notifications', icon: HiOutlineBell, path: null },
    { key: 'settings', label: 'Settings', icon: HiOutlineCog6Tooth, path: null },
]

const DOCTOR_NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', icon: HiOutlineHome, path: '/doctor/dashboard' },
    { key: 'profile', label: 'My Profile', icon: HiOutlineUserCircle, path: '/doctor/profile' },
    { key: 'patients', label: 'Patients', icon: HiOutlineUserGroup, path: '/doctor/patients' },
    { key: 'trials', label: 'Trial Matches', icon: HiOutlineBeaker, path: '/doctor/trials' },
    { key: 'chat', label: 'Chat', icon: HiOutlineChatBubbleLeftRight, path: '/doctor/chat/ANON-7F3A2B1C' },
    { key: 'notifications', label: 'Notifications', icon: HiOutlineBell, path: '/doctor/alerts', badge: ALERTS.length },
    { key: 'settings', label: 'Settings', icon: HiOutlineCog6Tooth, path: '/doctor/settings' },
]

export default function Sidebar({ activePage, setPage }) {
    const { colors, fonts } = useTheme()
    const navigate = useNavigate()
    const location = useLocation()

    const isClinicMode = typeof setPage === 'function'

    const unreadCount = isClinicMode
        ? NOTIFICATIONS.filter(n => !n.read).length
        : 0

    const isDoctorActive = (item) => {
        const path = location.pathname
        switch (item.key) {
            case 'dashboard': return path === '/doctor/dashboard'
            case 'profile': return path === '/doctor/profile'
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
    const { fullName: doctorFullName, initials: doctorInitials } = useDoctor()
    const { clinicName, initials: clinicInitials } = useClinic()
    const profileName = isClinicMode ? clinicName : doctorFullName
    const profileInitials = isClinicMode ? clinicInitials : doctorInitials
    const profileSub = isClinicMode ? 'Clinic Admin' : 'Lead Investigator'

    return (
        <aside
            style={{
                width: 240,
                minHeight: '100vh',
                background: colors.surface,
                borderRight: `1px solid ${colors.border}`,
                display: 'flex',
                flexDirection: 'column',
                padding: '20px 0',
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 40,
                fontFamily: fonts.body,
            }}
        >
            {/* Logo */}
            <div style={{ padding: '0 20px', marginBottom: '28px' }}>
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: isClinicMode ? 'default' : 'pointer' }}
                    onClick={() => !isClinicMode && navigate('/doctor/dashboard')}
                >
                    <span
                        style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: 38, height: 38, borderRadius: '10px',
                            background: `linear-gradient(135deg, ${colors.accent}, ${colors.green || colors.accent})`,
                            color: '#fff', fontSize: '18px', fontWeight: 800, fontFamily: fonts.heading,
                            boxShadow: `0 2px 10px ${colors.accent}30`,
                        }}
                    >
                        C
                    </span>
                    <div>
                        <div style={{ fontSize: '15px', fontWeight: 700, fontFamily: fonts.heading, color: colors.textPrimary, lineHeight: 1.2 }}>
                            TrialMatch AI
                        </div>
                        <div style={{ fontSize: '10px', color: colors.textSecondary, fontFamily: fonts.body, letterSpacing: '1.2px', textTransform: 'uppercase', fontWeight: 500 }}>
                            {portalLabel}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '0 10px' }}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '1px', padding: '0 12px', marginBottom: '8px' }}>
                    Menu
                </div>
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
                                gap: '12px',
                                padding: '10px 14px',
                                marginBottom: '2px',
                                borderRadius: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: fonts.body,
                                fontSize: '13px',
                                fontWeight: isActive ? 600 : 500,
                                color: isActive ? colors.accent : colors.textSecondary,
                                background: isActive ? colors.accentGlow : 'transparent',
                                transition: 'all 0.2s ease',
                                textAlign: 'left',
                                position: 'relative',
                            }}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = colors.card }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                        >
                            {isActive && (
                                <div style={{ position: 'absolute', left: 0, top: '22%', bottom: '22%', width: 3, borderRadius: 2, background: colors.accent }} />
                            )}
                            <Icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                            {item.label}
                            {badgeCount && (
                                <span style={{
                                    marginLeft: 'auto', minWidth: 20, height: 20,
                                    borderRadius: '10px', background: colors.red || '#EF4444',
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

            {/* Profile (bottom) */}
            <div style={{ padding: '0 16px', borderTop: `1px solid ${colors.border}`, paddingTop: '16px' }}>
                <div
                    style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 12px', borderRadius: '12px',
                        background: colors.card, cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onClick={() => !isClinicMode && navigate('/doctor/settings')}
                    onMouseEnter={e => e.currentTarget.style.background = `${colors.border}`}
                    onMouseLeave={e => e.currentTarget.style.background = colors.card}
                >
                    <div style={{
                        width: 36, height: 36, borderRadius: '10px',
                        background: `linear-gradient(135deg, ${colors.accent}, ${colors.green || colors.accent})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '13px', fontWeight: 700, fontFamily: fonts.heading,
                        flexShrink: 0,
                    }}>
                        {profileInitials}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profileName}</div>
                        <div style={{ fontSize: '11px', color: colors.textSecondary }}>{profileSub}</div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
