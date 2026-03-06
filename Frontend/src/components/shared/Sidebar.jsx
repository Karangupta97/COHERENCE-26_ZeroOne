import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../theme';
import { ALERTS } from '../../doctor/data/mockData';

export default function Sidebar() {
    const { colors, fonts } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState(null);

    const navItems = [
        { key: 'dashboard', label: 'Dashboard', path: '/doctor/dashboard', icon: '📊' },
        { key: 'patients', label: 'Patients', path: '/doctor/patients', icon: '👥' },
        { key: 'trials', label: 'Trial Matches', path: '/doctor/trials', icon: '🔬' },
        { key: 'chat', label: 'Chat', path: '/doctor/chat/PT-0041', icon: '💬' },
        { key: 'notifications', label: 'Notifications', path: '/doctor/alerts', icon: '🔔', badge: ALERTS.length },
        { key: 'settings', label: 'Settings', path: '/doctor/settings', icon: '⚙️' },
    ];

    const isActive = (item) => {
        const path = location.pathname;
        switch (item.key) {
            case 'dashboard': return path === '/doctor/dashboard';
            case 'patients': return path === '/doctor/patients' || (path.startsWith('/doctor/patients/'));
            case 'trials': return path === '/doctor/trials';
            case 'chat': return path.startsWith('/doctor/chat');
            case 'notifications': return path === '/doctor/alerts';
            case 'settings': return path === '/doctor/settings';
            default: return false;
        }
    };

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
                onClick={() => navigate('/doctor/dashboard')}
                style={{
                    padding: '20px 18px 16px',
                    cursor: 'pointer',
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
                    DOCTOR PORTAL
                </span>
            </div>

            {/* Nav items */}
            <nav style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {navItems.map((item) => {
                    const active = isActive(item);
                    const hovered = hoveredItem === item.key;
                    return (
                        <button
                            key={item.key}
                            onClick={() => navigate(item.path)}
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
                            {item.badge && (
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
