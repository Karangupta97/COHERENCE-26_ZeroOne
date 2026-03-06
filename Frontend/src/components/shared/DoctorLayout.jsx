import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../theme';
import Sidebar from './Sidebar';
import { ALERTS } from '../../doctor/data/mockData';

function TopBar() {
    const { colors, fonts, mode, toggleMode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [toggleHover, setToggleHover] = useState(false);
    const [bellHover, setBellHover] = useState(false);

    const alertCount = ALERTS.length;

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/dashboard')) return 'Doctor Dashboard';
        if (path.includes('/patients/') && !path.endsWith('/patients')) return 'Patient Details';
        if (path.includes('/patients')) return 'Patients';
        if (path.includes('/trials')) return 'Trial Matches';
        if (path.includes('/chat')) return 'Messages';
        if (path.includes('/alerts')) return 'Notifications';
        if (path.includes('/settings')) return 'Settings';
        return 'Doctor Portal';
    };

    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            height: '56px',
            background: colors.surface,
            borderBottom: `1px solid ${colors.border}`,
            position: 'sticky',
            top: 0,
            zIndex: 50,
        }}>
            <h1 style={{
                fontFamily: fonts.heading,
                fontSize: '18px',
                fontWeight: 700,
                color: colors.textPrimary,
                margin: 0,
            }}>
                {getPageTitle()}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Dark/Light toggle pill */}
                <button
                    onClick={toggleMode}
                    onMouseEnter={() => setToggleHover(true)}
                    onMouseLeave={() => setToggleHover(false)}
                    style={{
                        padding: '5px 14px',
                        borderRadius: '9999px',
                        background: toggleHover ? colors.card : colors.surface,
                        border: `1px solid ${colors.border}`,
                        color: colors.textSecondary,
                        fontFamily: fonts.body,
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                    }}
                >
                    <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: mode === 'dark' ? '#818CF8' : '#10B981',
                    }} />
                    {mode === 'dark' ? 'Light' : 'Dark'}
                </button>

                {/* Bell */}
                <button
                    onClick={() => navigate('/doctor/alerts')}
                    onMouseEnter={() => setBellHover(true)}
                    onMouseLeave={() => setBellHover(false)}
                    style={{
                        position: 'relative',
                        fontSize: '16px',
                        padding: '6px',
                        borderRadius: '8px',
                        background: bellHover ? `${colors.accent}08` : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                >
                    🔔
                    {alertCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '0px',
                            right: '0px',
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: colors.red,
                            color: '#fff',
                            fontSize: '9px',
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

                {/* Avatar */}
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.accent}, #7C3AED)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontFamily: fonts.mono,
                    fontWeight: 700,
                    color: '#fff',
                    cursor: 'pointer',
                }}>
                    PS
                </div>
            </div>
        </header>
    );
}

export default function DoctorLayout({ children }) {
    const { colors } = useTheme();

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            background: colors.bg,
        }}>
            <Sidebar />
            <div style={{
                flex: 1,
                marginLeft: '220px',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <TopBar />
                <main style={{ flex: 1 }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
