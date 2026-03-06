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
    const { colors, fonts } = useTheme();
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
            width: '220px',
            minHeight: '100vh',
            background: colors.surface,
            borderRight: `1px solid ${colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 100,
        }}>
            {/* Logo */}
            <div
                onClick={() => isClinicMode ? null : navigate('/doctor/dashboard')}
                style={{
                    padding: '20px 18px 16px',
                    cursor: isClinicMode ? 'default' : 'pointer',
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '2px',
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: `linear-gradient(135deg, ${colors.accent}, #7C3AED)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                    }}>
                        🧬
                    </div>
                    <span style={{
                        fontFamily: fonts.heading,
                        fontSize: '16px',
                        fontWeight: 700,
                        color: colors.textPrimary,
                    }}>
                        TrialMatch <span style={{ color: colors.accent }}>AI</span>
                    </span>
                </div>
                <span style={{
                    fontFamily: fonts.mono,
                    fontSize: '9px',
                    color: colors.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginLeft: '42px',
                }}>
                    {portalLabel}
                </span>
            </div>

            {/* Nav items */}
            <nav style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
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
                                gap: '10px',
                                padding: '9px 12px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: active ? 600 : 400,
                                fontFamily: fonts.body,
                                color: active ? '#FFFFFF' : hovered ? '#FFFFFF' : colors.textSecondary,
                                background: active ? colors.accent : hovered ? `${colors.accent}cc` : 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                width: '100%',
                                textAlign: 'left',
                            }}
                        >
                            <span style={{ fontSize: '14px', width: '18px', textAlign: 'center', filter: (active || hovered) ? 'brightness(10)' : 'none' }}>{item.icon}</span>
                            <span style={{ flex: 1 }}>{item.label}</span>
                            {isClinicMode && item.key === 'notifications' && unreadCount > 0 && (
                                <span style={{
                                    minWidth: '18px',
                                    height: '18px',
                                    borderRadius: '9999px',
                                    background: (active || hovered) ? 'rgba(255,255,255,0.25)' : colors.red,
                                    color: '#fff',
                                    fontSize: '10px',
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
                                    minWidth: '18px',
                                    height: '18px',
                                    borderRadius: '9999px',
                                    background: (active || hovered) ? 'rgba(255,255,255,0.25)' : colors.red,
                                    color: '#fff',
                                    fontSize: '10px',
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
