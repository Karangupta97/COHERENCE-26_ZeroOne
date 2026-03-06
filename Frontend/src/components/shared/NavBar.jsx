import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../theme';
import { ALERTS } from '../../doctor/data/mockData';

export default function NavBar() {
    const { colors, fonts, mode, toggleMode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [hoveredLink, setHoveredLink] = useState(null);
    const [toggleHover, setToggleHover] = useState(false);
    const [bellHover, setBellHover] = useState(false);

    const links = [
        { label: 'Dashboard', path: '/doctor/dashboard' },
        { label: 'Patients', path: '/doctor/patients' },
        { label: 'Alerts', path: '/doctor/alerts' },
    ];

    const alertCount = ALERTS.length;
    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            height: '64px',
            background: `${colors.surface}ee`,
            backdropFilter: 'blur(16px)',
            borderBottom: `1px solid ${colors.border}`,
            transition: 'all 0.3s ease',
        }}>
            {/* Logo */}
            <div
                onClick={() => navigate('/doctor/dashboard')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                }}
            >
                <span style={{ fontSize: '22px' }}>🧬</span>
                <span style={{
                    fontFamily: fonts.heading,
                    fontSize: '20px',
                    fontWeight: 800,
                    color: colors.textPrimary,
                    transition: 'color 0.3s ease',
                }}>
                    TrialMatch<span style={{ color: colors.accent }}>AI</span>
                </span>
            </div>

            {/* Center links */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {links.map(link => {
                    const active = isActive(link.path);
                    const hovered = hoveredLink === link.label;
                    return (
                        <button
                            key={link.label}
                            onClick={() => navigate(link.path)}
                            onMouseEnter={() => setHoveredLink(link.label)}
                            onMouseLeave={() => setHoveredLink(null)}
                            style={{
                                padding: '8px 18px',
                                borderRadius: '9999px',
                                fontSize: '14px',
                                fontWeight: active ? 600 : 500,
                                fontFamily: fonts.body,
                                color: active ? colors.accent : hovered ? colors.textPrimary : colors.textSecondary,
                                background: active ? colors.accentGlow : hovered ? `${colors.card}` : 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {link.label}
                        </button>
                    );
                })}
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Dark/Light toggle */}
                <button
                    onClick={toggleMode}
                    onMouseEnter={() => setToggleHover(true)}
                    onMouseLeave={() => setToggleHover(false)}
                    style={{
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        background: toggleHover ? colors.card : colors.surface,
                        border: `1px solid ${colors.border}`,
                        color: colors.textSecondary,
                        fontFamily: fonts.mono,
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {mode === 'dark' ? '☀️ Light' : '🌙 Dark'}
                </button>

                {/* Notification bell */}
                <button
                    onClick={() => navigate('/doctor/alerts')}
                    onMouseEnter={() => setBellHover(true)}
                    onMouseLeave={() => setBellHover(false)}
                    style={{
                        position: 'relative',
                        fontSize: '20px',
                        padding: '6px',
                        borderRadius: '10px',
                        background: bellHover ? colors.card : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                >
                    🔔
                    {alertCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: colors.red,
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: 700,
                            fontFamily: fonts.mono,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `2px solid ${colors.surface}`,
                        }}>
                            {alertCount}
                        </span>
                    )}
                </button>

                {/* Doctor avatar */}
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    cursor: 'pointer',
                }}>
                    👨‍⚕️
                </div>
            </div>
        </nav>
    );
}
