import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme';

export default function LoginPage() {
    const { colors, fonts, mode, toggleMode } = useTheme();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('doctor');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hoveredRole, setHoveredRole] = useState(null);
    const [hoveredDemo, setHoveredDemo] = useState(null);
    const [signInHover, setSignInHover] = useState(false);
    const [toggleHover, setToggleHover] = useState(false);

    const roles = [
        { key: 'patient', label: 'Patient', icon: '🏥' },
        { key: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
        { key: 'clinic', label: 'Clinic', icon: '🏛️' },
    ];

    const demoCredentials = {
        patient: { email: 'patient@trialmatch.ai', password: 'demo123' },
        doctor: { email: 'doctor@trialmatch.ai', password: 'demo123' },
        clinic: { email: 'clinic@trialmatch.ai', password: 'demo123' },
    };

    const handleLogin = () => {
        if (selectedRole === 'doctor') navigate('/doctor/dashboard');
        else if (selectedRole === 'patient') navigate('/patient/dashboard');
        else navigate('/clinic/dashboard');
    };

    const handleDemoLogin = (role) => {
        setSelectedRole(role);
        setEmail(demoCredentials[role].email);
        setPassword(demoCredentials[role].password);
        setTimeout(() => {
            if (role === 'doctor') navigate('/doctor/dashboard');
            else if (role === 'patient') navigate('/patient/dashboard');
            else navigate('/clinic/dashboard');
        }, 400);
    };

    const inputStyle = (focused) => ({
        width: '100%',
        padding: '14px 16px',
        borderRadius: '10px',
        border: `1.5px solid ${colors.border}`,
        background: colors.bg,
        color: colors.textPrimary,
        fontFamily: fonts.body,
        fontSize: '15px',
        transition: 'all 0.3s ease',
        outline: 'none',
    });

    return (
        <div className="page-enter" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: colors.bg,
            position: 'relative',
            transition: 'all 0.3s ease',
        }}>
            {/* Decorative gradients */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                left: '-10%',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${colors.accentGlow}, transparent 70%)`,
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                right: '-10%',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${colors.greenGlow}, transparent 70%)`,
                pointerEvents: 'none',
            }} />

            {/* Dark/Light toggle */}
            <button
                onClick={toggleMode}
                onMouseEnter={() => setToggleHover(true)}
                onMouseLeave={() => setToggleHover(false)}
                style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    padding: '10px 18px',
                    borderRadius: '9999px',
                    background: toggleHover ? colors.card : colors.surface,
                    border: `1px solid ${colors.border}`,
                    color: colors.textSecondary,
                    fontFamily: fonts.mono,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                }}
            >
                {mode === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>

            {/* Login Card */}
            <div style={{
                width: '440px',
                maxWidth: '90vw',
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: '14px',
                padding: '40px',
                boxShadow: colors.shadow,
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.3s ease',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <span style={{ fontSize: '36px', display: 'block', marginBottom: '8px' }}>🧬</span>
                    <h1 style={{
                        fontFamily: fonts.heading,
                        fontSize: '28px',
                        fontWeight: 800,
                        color: colors.textPrimary,
                        margin: 0,
                        transition: 'color 0.3s ease',
                    }}>
                        TrialMatch<span style={{ color: colors.accent }}>AI</span>
                    </h1>
                    <p style={{
                        fontFamily: fonts.body,
                        fontSize: '14px',
                        color: colors.textSecondary,
                        marginTop: '6px',
                        transition: 'color 0.3s ease',
                    }}>
                        AI-Powered Clinical Trial Matching
                    </p>
                </div>

                {/* Role selector */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '24px',
                }}>
                    {roles.map(role => {
                        const active = selectedRole === role.key;
                        const hovered = hoveredRole === role.key;
                        return (
                            <button
                                key={role.key}
                                onClick={() => setSelectedRole(role.key)}
                                onMouseEnter={() => setHoveredRole(role.key)}
                                onMouseLeave={() => setHoveredRole(null)}
                                style={{
                                    flex: 1,
                                    padding: '12px 8px',
                                    borderRadius: '10px',
                                    border: active ? `2px solid ${colors.accent}` : `1.5px solid ${colors.border}`,
                                    background: active ? colors.accentGlow : hovered ? colors.card : 'transparent',
                                    color: active ? colors.accent : colors.textSecondary,
                                    fontFamily: fonts.body,
                                    fontSize: '14px',
                                    fontWeight: active ? 600 : 500,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <span style={{ fontSize: '20px' }}>{role.icon}</span>
                                {role.label}
                            </button>
                        );
                    })}
                </div>

                {/* Email */}
                <div style={{ marginBottom: '14px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: colors.textSecondary,
                        fontFamily: fonts.body,
                        transition: 'color 0.3s ease',
                    }}>
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="doctor@trialmatch.ai"
                        onFocus={(e) => e.target.style.borderColor = colors.accent}
                        onBlur={(e) => e.target.style.borderColor = colors.border}
                        style={inputStyle()}
                    />
                </div>

                {/* Password */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: colors.textSecondary,
                        fontFamily: fonts.body,
                        transition: 'color 0.3s ease',
                    }}>
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        onFocus={(e) => e.target.style.borderColor = colors.accent}
                        onBlur={(e) => e.target.style.borderColor = colors.border}
                        style={inputStyle()}
                    />
                </div>

                {/* Sign In */}
                <button
                    onClick={handleLogin}
                    onMouseEnter={() => setSignInHover(true)}
                    onMouseLeave={() => setSignInHover(false)}
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '10px',
                        background: signInHover ? `${colors.accent}dd` : colors.accent,
                        color: '#fff',
                        fontFamily: fonts.body,
                        fontSize: '16px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        marginBottom: '20px',
                        boxShadow: signInHover ? `0 4px 20px ${colors.accentGlow}` : 'none',
                    }}
                >
                    Sign In
                </button>

                {/* Demo login shortcuts */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginBottom: '20px',
                }}>
                    {roles.map(role => (
                        <button
                            key={role.key}
                            onClick={() => handleDemoLogin(role.key)}
                            onMouseEnter={() => setHoveredDemo(role.key)}
                            onMouseLeave={() => setHoveredDemo(null)}
                            style={{
                                padding: '8px 14px',
                                borderRadius: '8px',
                                border: `1px solid ${colors.border}`,
                                background: hoveredDemo === role.key ? colors.card : 'transparent',
                                color: colors.textSecondary,
                                fontFamily: fonts.mono,
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Demo {role.label}
                        </button>
                    ))}
                </div>

                {/* HIPAA notice */}
                <p style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    color: colors.textSecondary,
                    fontFamily: fonts.body,
                    transition: 'color 0.3s ease',
                    opacity: 0.7,
                }}>
                    🔒 All patient data is anonymized and HIPAA compliant
                </p>
            </div>
        </div>
    );
}
