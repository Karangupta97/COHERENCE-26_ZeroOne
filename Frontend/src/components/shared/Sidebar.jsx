import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../theme';
import { ALERTS } from '../../doctor/data/mockData';
import { NOTIFICATIONS } from '../../pages/clinic/data/mockData';

// ── Clinic Portal nav items ──
const CLINIC_NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'post-trial', label: 'Post Trial', icon: '📝' },
    { key: 'candidates', label: 'Matched Candidates', icon: '👥' },
    { key: 'workflow', label: 'Candidate Workflow', icon: '🔄' },
    { key: 'funnel', label: 'Enrollment Funnel', icon: '📈' },
    { key: 'trials', label: 'Trials Management', icon: '🧪' },
    { key: 'notifications', label: 'Notifications', icon: '🔔' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
];

// ── Doctor Portal nav items ──
const DOCTOR_NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', path: '/doctor/dashboard', icon: '📊' },
    { key: 'patients', label: 'Patients', path: '/doctor/patients', icon: '👥' },
    { key: 'trials', label: 'Trial Matches', path: '/doctor/trials', icon: '🔬' },
    { key: 'chat', label: 'Chat', path: '/doctor/chat/PT-0041', icon: '💬' },
    { key: 'notifications', label: 'Notifications', path: '/doctor/alerts', icon: '🔔', badge: ALERTS.length },
    { key: 'settings', label: 'Settings', path: '/doctor/settings', icon: '⚙️' },
];

export default function Sidebar({ activePage, setPage }) {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState(null);

    // Determine portal mode based on props
    const isClinicMode = typeof setPage === 'function';

    const unreadCount = isClinicMode
        ? NOTIFICATIONS.filter(n => !n.read).length
        : 0;

    const isDoctorActive = (item) => {
        const path = location.pathname;
        switch (item.key) {
            case 'dashboard': return path === '/doctor/dashboard';
            case 'patients': return path === '/doctor/patients' || path.startsWith('/doctor/patients/');
            case 'trials': return path === '/doctor/trials';
            case 'chat': return path.startsWith('/doctor/chat');
            case 'notifications': return path === '/doctor/alerts';
            case 'settings': return path === '/doctor/settings';
            default: return false;
        }
    };

    const navItems = isClinicMode ? CLINIC_NAV_ITEMS : DOCTOR_NAV_ITEMS;
    const portalLabel = isClinicMode ? 'CLINIC PORTAL' : 'DOCTOR PORTAL';

    return (
        <aside style={{
            width: 240,
            minHeight: '100vh',
            background: colors.card,
            borderRight: `1px solid ${colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 100,
            fontFamily: fonts.body,
        }}>
            {/* Logo */}
            <div
                onClick={() => isClinicMode ? null : navigate('/doctor/dashboard')}
                style={{
                    padding: `${spacing.lg} ${spacing.lg} ${spacing.md}`,
                    cursor: isClinicMode ? 'default' : 'pointer',
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    marginBottom: spacing.xs,
                }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: radius.md,
                        background: `linear-gradient(135deg, ${colors.accent}, #7C3AED)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: fontSize.lg,
                    }}>
                        🧬
                    </div>
                    <span style={{
                        fontFamily: fonts.heading,
                        fontSize: fontSize.base,
                        fontWeight: 700,
                        color: colors.textPrimary,
                    }}>
                        TrialMatch <span style={{ color: colors.accent }}>AI</span>
                    </span>
                </div>
                <span style={{
                    fontFamily: fonts.mono,
                fontSize: fontSize.xs,
                    color: colors.textSecondary,
                    textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginLeft: 42,
                }}>
                    {portalLabel}
                </span>
            </div>

            {/* Nav items */}
            <nav style={{ flex: 1, padding: `0 ${spacing.sm}`, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {navItems.map((item) => {
                    const active = isClinicMode ? activePage === item.key : isDoctorActive(item);
                    const hovered = hoveredItem === item.key;
                    return (
                        <button
                            key={item.key}
                            onClick={() => isClinicMode ? setPage(item.key) : navigate(item.path)}
                            onMouseEnter={() => setHoveredItem(item.key)}
                            onMouseLeave={() => setHoveredItem(null)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: spacing.md,
                                padding: `10px ${spacing.md}`,
                                borderRadius: radius.md,
                                fontSize: fontSize.sm,
                                fontWeight: active ? 600 : 400,
                                fontFamily: fonts.body,
                                color: active ? colors.accent : colors.textSecondary,
                                background: active ? colors.accentGlow : hovered ? `${colors.border}80` : 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                width: '100%',
                                textAlign: 'left',
                                position: 'relative',
                            }}
                        >
                            {active && (
                                <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, borderRadius: 2, background: colors.accent }} />
                            )}
                            <span style={{ fontSize: fontSize.base, width: 18, textAlign: 'center' }}>{item.icon}</span>
                            <span style={{ flex: 1 }}>{item.label}</span>
                            {isClinicMode && item.key === 'notifications' && unreadCount > 0 && (
                                <span style={{
                                    minWidth: 18,
                                    height: 18,
                                    borderRadius: radius.full,
                                    background: (active || hovered) ? 'rgba(255,255,255,0.25)' : colors.red,
                                    color: '#fff',
                                    fontSize: 10,
                                    fontWeight: 700,
                                    fontFamily: fonts.mono,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0 5px',
                                }}>
                                    {unreadCount}
                                </span>
                            )}
                            {!isClinicMode && item.badge && (
                                <span style={{
                                    minWidth: 18,
                                    height: 18,
                                    borderRadius: radius.full,
                                    background: (active || hovered) ? 'rgba(255,255,255,0.25)' : colors.red,
                                    color: '#fff',
                                    fontSize: 10,
                                    fontWeight: 700,
                                    fontFamily: fonts.mono,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0 5px',
                                }}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Doctor profile */}
            <div style={{
                padding: '14px 18px',
                borderTop: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
            }}>
                <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.accent}, #7C3AED)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: fonts.mono,
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#fff',
                }}>
                    PS
                </div>
                <div>
                    <div style={{
                        fontFamily: fonts.body,
                        fontSize: '13px',
                        fontWeight: 600,
                        color: colors.textPrimary,
                    }}>
                        Dr. Priya Sharma
                    </div>
                    <div style={{
                        fontFamily: fonts.body,
                        fontSize: '11px',
                        color: colors.textSecondary,
                    }}>
                        Lead Investigator
                    </div>
                </div>
            </div>
        </aside>
    );
}
