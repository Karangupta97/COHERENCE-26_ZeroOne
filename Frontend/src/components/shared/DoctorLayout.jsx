import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import Sidebar from './Sidebar'
import { ALERTS } from '../../pages/doctor/data/mockData'
import { HiOutlineBell, HiOutlineMagnifyingGlass, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2'
import useDoctor from '../../hooks/useDoctor'

function TopBar() {
    const { colors, fonts, mode, toggleMode } = useTheme()
    const navigate = useNavigate()
    const location = useLocation()
    const { initials, fullName } = useDoctor()

    const alertCount = ALERTS.length

    const getPageTitle = () => {
        const path = location.pathname
        if (path.includes('/dashboard')) return 'Dashboard'
        if (path.includes('/patients/') && !path.endsWith('/patients')) return 'Patient Details'
        if (path.includes('/patients')) return 'Patients'
        if (path.includes('/trials')) return 'Trial Matches'
        if (path.includes('/chat')) return 'Messages'
        if (path.includes('/alerts')) return 'Notifications'
        if (path.includes('/add-patient-trial')) return 'Add Patient to Trial'
        if (path.includes('/settings')) return 'Settings'
        return 'Doctor Portal'
    }

    return (
        <header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 28px',
                borderBottom: `1px solid ${colors.border}`,
                background: colors.surface,
                fontFamily: fonts.body,
                minHeight: 60,
                position: 'sticky', top: 0, zIndex: 30,
                backdropFilter: 'blur(12px)',
            }}
        >
            <div>
                <h1 style={{ margin: 0, fontSize: '20px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, letterSpacing: '-0.3px' }}>
                    {getPageTitle()}
                </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Dark/Light toggle */}
                <button
                    onClick={toggleMode}
                    title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
                    style={{
                        background: colors.card,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '10px',
                        padding: '6px 14px',
                        cursor: 'pointer',
                        color: colors.textSecondary,
                        fontFamily: fonts.body,
                        fontSize: '12px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = colors.accent}
                    onMouseLeave={e => e.currentTarget.style.borderColor = colors.border}
                >
                    {mode === 'dark'
                        ? <><HiOutlineSun style={{ width: 14, height: 14 }} /> Light</>
                        : <><HiOutlineMoon style={{ width: 14, height: 14 }} /> Dark</>
                    }
                </button>

                {/* Notification bell */}
                <button
                    onClick={() => navigate('/doctor/alerts')}
                    style={{
                        position: 'relative',
                        background: colors.card,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '10px',
                        width: 38, height: 38,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        color: colors.textSecondary,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = colors.accent}
                    onMouseLeave={e => e.currentTarget.style.borderColor = colors.border}
                >
                    <HiOutlineBell style={{ width: 17, height: 17 }} />
                    {alertCount > 0 && (
                        <span style={{
                            position: 'absolute', top: -4, right: -4,
                            minWidth: 18, height: 18, borderRadius: '9px',
                            background: colors.red || '#EF4444', color: '#fff',
                            fontSize: '10px', fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '0 4px',
                            border: `2px solid ${colors.surface}`,
                        }}>
                            {alertCount}
                        </span>
                    )}
                </button>

                {/* Profile avatar */}
                <div
                    onClick={() => navigate('/doctor/settings')}
                    style={{
                        width: 38, height: 38, borderRadius: '10px',
                        background: `linear-gradient(135deg, ${colors.accent}, ${colors.green || colors.accent})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '13px', fontWeight: 700, fontFamily: fonts.heading,
                        cursor: 'pointer', transition: 'all 0.2s',
                        boxShadow: `0 2px 8px ${colors.accent}30`,
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {initials}
                </div>
            </div>
        </header>
    )
}

export default function DoctorLayout({ children }) {
    const { colors } = useTheme()

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            background: colors.bg,
        }}>
            <Sidebar />
            <div style={{
                flex: 1,
                marginLeft: 240,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <TopBar />
                <main style={{ flex: 1, padding: '20px 24px', overflow: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    )
}
