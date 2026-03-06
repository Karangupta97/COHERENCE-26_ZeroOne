import React, { useState } from 'react';
import { useTheme } from '../theme';
import DoctorLayout from '../components/shared/DoctorLayout';

export default function DoctorSettings() {
    const { colors, fonts, mode, toggleMode } = useTheme();
    const [hoveredCard, setHoveredCard] = useState(null);

    const settings = [
        { icon: '👤', title: 'Profile', desc: 'Update your name, specialty, and contact info' },
        { icon: '🔔', title: 'Notification Preferences', desc: 'Choose which alerts and updates you receive' },
        { icon: '🔒', title: 'Privacy & Security', desc: 'Manage passwords, 2FA, and data sharing' },
        { icon: '📋', title: 'Trial Preferences', desc: 'Set default filters for trial matching criteria' },
        { icon: '💬', title: 'Chat Settings', desc: 'Manage auto-replies and availability hours' },
        { icon: '🎨', title: 'Appearance', desc: 'Theme and display customizations' },
    ];

    return (
        <DoctorLayout>
            <div className="page-enter" style={{ padding: '24px 28px', maxWidth: '800px' }}>
                <p style={{ fontFamily: fonts.body, fontSize: '14px', color: colors.textSecondary, margin: '0 0 24px 0' }}>
                    Manage your account and preferences
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {settings.map((item, i) => (
                        <div
                            key={i}
                            onMouseEnter={() => setHoveredCard(i)}
                            onMouseLeave={() => setHoveredCard(null)}
                            style={{
                                background: colors.card,
                                borderRadius: '12px',
                                padding: '16px 20px',
                                border: `1px solid ${hoveredCard === i ? colors.accent + '40' : colors.border}`,
                                boxShadow: colors.shadow,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                transform: hoveredCard === i ? 'translateY(-1px)' : 'none',
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: `${colors.accent}10`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                flexShrink: 0,
                            }}>
                                {item.icon}
                            </div>
                            <div>
                                <div style={{ fontFamily: fonts.heading, fontSize: '14px', fontWeight: 600, color: colors.textPrimary }}>{item.title}</div>
                                <div style={{ fontFamily: fonts.body, fontSize: '12px', color: colors.textSecondary, marginTop: '2px' }}>{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Theme toggle section */}
                <div style={{
                    marginTop: '20px',
                    background: colors.card,
                    borderRadius: '12px',
                    padding: '16px 20px',
                    border: `1px solid ${colors.border}`,
                    boxShadow: colors.shadow,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: `${colors.accent}10`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                        }}>
                            {mode === 'dark' ? '🌙' : '☀️'}
                        </div>
                        <div>
                            <div style={{ fontFamily: fonts.heading, fontSize: '14px', fontWeight: 600, color: colors.textPrimary }}>Theme</div>
                            <div style={{ fontFamily: fonts.body, fontSize: '12px', color: colors.textSecondary, marginTop: '2px' }}>Currently using {mode} mode</div>
                        </div>
                    </div>
                    <button
                        onClick={toggleMode}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '8px',
                            background: colors.accent,
                            color: '#fff',
                            fontFamily: fonts.body,
                            fontSize: '13px',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Switch to {mode === 'dark' ? 'Light' : 'Dark'}
                    </button>
                </div>
            </div>
        </DoctorLayout>
    );
}
