import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme';

/* ── Professional SVG Icon Components ── */

const EmailIcon = ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const LockIcon = ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);

const ArrowIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

// Logo / DNA helix icon
const DnaIcon = ({ size = 28, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 15c6.667-6 13.333 0 20-6" />
        <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
        <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
        <path d="M17 6l-2.5-2.5" />
        <path d="M14 8l-1.5-1.5" />
        <path d="M7 18l2.5 2.5" />
        <path d="M3.5 14.5l.5.5" />
        <path d="M20 9l.5.5" />
        <path d="M6.5 12.5l1 1" />
        <path d="M16.5 10.5l1 1" />
        <path d="M10 16l1.5 1.5" />
    </svg>
);

// Role icons - professional SVGs
const PatientIcon = ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const DoctorIcon = ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
    </svg>
);

const ClinicIcon = ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6v4" />
        <path d="M14 14H9.5a2.5 2.5 0 0 1 0-5H14" />
        <path d="M14 8V6" />
        <path d="M14 14v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
        <rect x="14" y="6" width="6" height="12" rx="2" />
    </svg>
);

// Feature icons for left panel
const SparklesIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" /><path d="M19 17v4" />
        <path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
);

const ChartIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
    </svg>
);

const ShieldCheckIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

const GlobeIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
    </svg>
);

// Dark / Light mode toggle icons
const SunIcon = ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" /><path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" /><path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
);

const MoonIcon = ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
);

// Trust bar icons
const LockClosedIcon = ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const roleIconMap = {
    patient: PatientIcon,
    doctor: DoctorIcon,
    clinic: ClinicIcon,
};

export default function LoginPage() {
    const { colors, fonts, mode, toggleMode } = useTheme();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('doctor');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [hoveredRole, setHoveredRole] = useState(null);
    const [signInHover, setSignInHover] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    const roles = [
        { key: 'patient', label: 'Patient', desc: 'Find clinical trials' },
        { key: 'doctor', label: 'Doctor', desc: 'Manage patients' },
        { key: 'clinic', label: 'Clinic', desc: 'Run & monitor trials' },
    ];

    const handleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            if (selectedRole === 'doctor') navigate('/doctor/dashboard');
            else if (selectedRole === 'patient') navigate('/patient/dashboard');
            else navigate('/clinic/dashboard');
        }, 600);
    };

    const isDark = mode === 'dark';

    const features = [
        { Icon: SparklesIcon, text: 'AI-Powered Matching', color: colors.accent },
        { Icon: ChartIcon, text: 'Real-time Analytics', color: colors.green },
        { Icon: ShieldCheckIcon, text: 'HIPAA Compliant', color: colors.accent },
        { Icon: GlobeIcon, text: 'Global Trial Access', color: colors.green },
    ];

    // Stat counters for credibility
    const stats = [
        { value: '12K+', label: 'Active Trials' },
        { value: '98%', label: 'Match Accuracy' },
        { value: '50K+', label: 'Patients Matched' },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: colors.bg,
            position: 'relative',
            overflow: 'hidden',
            transition: 'background 0.4s ease',
        }}>
            {/* ── Left Branding Panel ── */}
            <div style={{
                flex: '0 0 46%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '60px 56px',
                position: 'relative',
                overflow: 'hidden',
                background: isDark
                    ? `linear-gradient(160deg, ${colors.surface} 0%, ${colors.card} 60%, ${colors.surface} 100%)`
                    : `linear-gradient(160deg, ${colors.card} 0%, ${colors.surface} 60%, ${colors.card} 100%)`,
                borderRight: `1px solid ${colors.border}`,
            }}>
                {/* Animated gradient orbs */}
                <div style={{
                    position: 'absolute', top: '8%', left: '10%', width: '320px', height: '320px', borderRadius: '50%',
                    background: `radial-gradient(circle, ${colors.accentGlow}, transparent 70%)`,
                    animation: 'float 6s ease-in-out infinite', pointerEvents: 'none', opacity: 0.8,
                }} />
                <div style={{
                    position: 'absolute', bottom: '12%', right: '8%', width: '260px', height: '260px', borderRadius: '50%',
                    background: `radial-gradient(circle, ${colors.greenGlow}, transparent 70%)`,
                    animation: 'float 8s ease-in-out infinite reverse', pointerEvents: 'none', opacity: 0.8,
                }} />
                <div style={{
                    position: 'absolute', top: '55%', left: '55%', width: '200px', height: '200px', borderRadius: '50%',
                    background: `radial-gradient(circle, ${colors.accentGlow}, transparent 70%)`,
                    animation: 'float 10s ease-in-out infinite', opacity: 0.3, pointerEvents: 'none',
                }} />

                {/* Grid pattern overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `radial-gradient(${isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.025)'} 1px, transparent 1px)`,
                    backgroundSize: '28px 28px', pointerEvents: 'none',
                }} />

                {/* Content */}
                <div style={{
                    position: 'relative', zIndex: 1, maxWidth: '400px',
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateX(0)' : 'translateX(-30px)',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                    {/* Logo mark */}
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '14px',
                        background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '28px',
                        boxShadow: `0 8px 32px ${colors.accentGlow}`,
                    }}>
                        <DnaIcon size={26} color="#fff" />
                    </div>

                    <h1 style={{
                        fontFamily: fonts.heading, fontSize: '36px', fontWeight: 800,
                        color: colors.textPrimary, margin: 0, lineHeight: 1.15, letterSpacing: '-0.025em',
                    }}>
                        Welcome to<br />
                        <span style={{
                            color: colors.accent,
                        }}>
                            TrialMatch<span style={{ color: colors.green }}>AI</span>
                        </span>
                    </h1>

                    <p style={{
                        fontFamily: fonts.body, fontSize: '15px', color: colors.textSecondary,
                        marginTop: '14px', lineHeight: 1.7, maxWidth: '360px',
                    }}>
                        The intelligent platform connecting patients, doctors, and clinics
                        for seamless clinical trial matching.
                    </p>

                    {/* Feature grid */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '36px',
                    }}>
                        {features.map((f, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '11px 14px', borderRadius: '12px',
                                background: isDark ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.025)',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                                opacity: mounted ? 1 : 0,
                                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.08}s`,
                            }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '8px',
                                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <f.Icon size={16} color={f.color} />
                                </div>
                                <span style={{
                                    fontFamily: fonts.body, fontSize: '13px', fontWeight: 500,
                                    color: colors.textSecondary,
                                }}>{f.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Stats row */}
                    <div style={{
                        display: 'flex', gap: '24px', marginTop: '36px', paddingTop: '24px',
                        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.65s',
                    }}>
                        {stats.map((s, i) => (
                            <div key={i}>
                                <div style={{
                                    fontFamily: fonts.heading, fontSize: '22px', fontWeight: 700,
                                    color: colors.textPrimary, lineHeight: 1,
                                }}>{s.value}</div>
                                <div style={{
                                    fontFamily: fonts.body, fontSize: '12px', fontWeight: 500,
                                    color: colors.textSecondary, marginTop: '4px',
                                }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right Form Panel ── */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '40px 48px', position: 'relative',
            }}>
                {/* Dark/Light toggle */}
                <button
                    onClick={toggleMode}
                    style={{
                        position: 'absolute', top: '24px', right: '24px',
                        width: '40px', height: '40px', borderRadius: '10px',
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                        border: `1px solid ${colors.border}`,
                        color: colors.textSecondary, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.25s ease', zIndex: 10,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)';
                        e.currentTarget.style.borderColor = colors.accent;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
                        e.currentTarget.style.borderColor = colors.border;
                    }}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
                </button>

                {/* Form container */}
                <div style={{
                    width: '100%', maxWidth: '400px',
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{
                            fontFamily: fonts.heading, fontSize: '24px', fontWeight: 700,
                            color: colors.textPrimary, margin: 0, letterSpacing: '-0.015em',
                        }}>
                            Sign in to your account
                        </h2>
                        <p style={{
                            fontFamily: fonts.body, fontSize: '14px',
                            color: colors.textSecondary, marginTop: '6px', lineHeight: 1.5,
                        }}>
                            Select your role and enter your credentials to continue.
                        </p>
                    </div>

                    {/* Role label */}
                    <label style={{
                        display: 'block', marginBottom: '10px',
                        fontSize: '13px', fontWeight: 600,
                        color: colors.textPrimary, fontFamily: fonts.body,
                        letterSpacing: '0.01em',
                    }}>
                        I am a
                    </label>

                    {/* Role selector — card style */}
                    <div style={{
                        display: 'flex', gap: '10px', marginBottom: '24px',
                    }}>
                        {roles.map(role => {
                            const active = selectedRole === role.key;
                            const hovered = hoveredRole === role.key;
                            const RoleIcon = roleIconMap[role.key];
                            return (
                                <button
                                    key={role.key}
                                    onClick={() => setSelectedRole(role.key)}
                                    onMouseEnter={() => setHoveredRole(role.key)}
                                    onMouseLeave={() => setHoveredRole(null)}
                                    style={{
                                        flex: 1, padding: '14px 10px', borderRadius: '12px',
                                        border: active
                                            ? `1.5px solid ${colors.accent}`
                                            : `1.5px solid ${hovered ? colors.textSecondary + '44' : colors.border}`,
                                        background: active
                                            ? colors.accentGlow
                                            : hovered
                                                ? (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)')
                                                : 'transparent',
                                        cursor: 'pointer',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                        boxShadow: active ? `0 4px 16px ${colors.accentGlow}` : 'none',
                                        transform: active ? 'translateY(-1px)' : 'translateY(0)',
                                    }}
                                >
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '10px',
                                        background: active
                                            ? colors.accent
                                            : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.25s ease',
                                    }}>
                                        <RoleIcon size={18} color={active ? '#fff' : colors.textSecondary} />
                                    </div>
                                    <span style={{
                                        fontFamily: fonts.body, fontSize: '13px',
                                        fontWeight: active ? 600 : 500,
                                        color: active ? colors.accent : colors.textPrimary,
                                        transition: 'color 0.2s ease',
                                    }}>
                                        {role.label}
                                    </span>
                                    <span style={{
                                        fontFamily: fonts.body, fontSize: '11px',
                                        color: colors.textSecondary, lineHeight: 1.2,
                                        opacity: 0.8,
                                    }}>
                                        {role.desc}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Email Input */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block', marginBottom: '8px',
                            fontSize: '13px', fontWeight: 600,
                            color: colors.textPrimary, fontFamily: fonts.body, letterSpacing: '0.01em',
                        }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <span style={{
                                position: 'absolute', left: '14px',
                                color: emailFocused ? colors.accent : colors.textSecondary,
                                transition: 'color 0.2s ease', display: 'flex', pointerEvents: 'none',
                            }}>
                                <EmailIcon />
                            </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={`${selectedRole}@trialmatch.ai`}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                                style={{
                                    width: '100%', padding: '12px 16px 12px 42px', borderRadius: '10px',
                                    border: `1.5px solid ${emailFocused ? colors.accent : colors.border}`,
                                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                    color: colors.textPrimary, fontFamily: fonts.body, fontSize: '14px',
                                    transition: 'all 0.25s ease', outline: 'none',
                                    boxShadow: emailFocused ? `0 0 0 3px ${colors.accentGlow}` : 'none',
                                }}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px',
                        }}>
                            <label style={{
                                fontSize: '13px', fontWeight: 600,
                                color: colors.textPrimary, fontFamily: fonts.body, letterSpacing: '0.01em',
                            }}>
                                Password
                            </label>
                            <button
                                style={{
                                    background: 'none', border: 'none', color: colors.accent,
                                    fontFamily: fonts.body, fontSize: '12px', fontWeight: 500,
                                    cursor: 'pointer', padding: 0,
                                    transition: 'opacity 0.2s ease',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                tabIndex={-1}
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <span style={{
                                position: 'absolute', left: '14px',
                                color: passwordFocused ? colors.accent : colors.textSecondary,
                                transition: 'color 0.2s ease', display: 'flex', pointerEvents: 'none',
                            }}>
                                <LockIcon />
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                                style={{
                                    width: '100%', padding: '12px 44px 12px 42px', borderRadius: '10px',
                                    border: `1.5px solid ${passwordFocused ? colors.accent : colors.border}`,
                                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                    color: colors.textPrimary, fontFamily: fonts.body, fontSize: '14px',
                                    transition: 'all 0.25s ease', outline: 'none',
                                    boxShadow: passwordFocused ? `0 0 0 3px ${colors.accentGlow}` : 'none',
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                style={{
                                    position: 'absolute', right: '12px',
                                    background: 'none', border: 'none',
                                    color: colors.textSecondary, cursor: 'pointer',
                                    display: 'flex', padding: '4px', borderRadius: '6px',
                                    transition: 'color 0.2s ease',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = colors.accent}
                                onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    {/* Sign In Button */}
                    <button
                        onClick={handleLogin}
                        onMouseEnter={() => setSignInHover(true)}
                        onMouseLeave={() => setSignInHover(false)}
                        disabled={isLoading}
                        style={{
                            width: '100%', padding: '13px', borderRadius: '10px',
                            background: signInHover
                                ? `linear-gradient(135deg, ${colors.accent}, ${colors.green})`
                                : colors.accent,
                            color: '#fff', fontFamily: fonts.body, fontSize: '15px', fontWeight: 600,
                            border: 'none', cursor: isLoading ? 'wait' : 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            marginBottom: '20px',
                            boxShadow: signInHover ? `0 8px 30px ${colors.accentGlow}` : `0 2px 8px ${colors.accentGlow}`,
                            transform: signInHover ? 'translateY(-1px)' : 'translateY(0)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            letterSpacing: '0.01em', opacity: isLoading ? 0.8 : 1,
                        }}
                    >
                        {isLoading ? (
                            <span style={{
                                width: '18px', height: '18px',
                                border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
                                borderRadius: '50%', animation: 'spin 0.6s linear infinite',
                                display: 'inline-block',
                            }} />
                        ) : (
                            <>
                                Sign In
                                <ArrowIcon />
                            </>
                        )}
                    </button>

                    {/* Footer */}
                    <p style={{
                        textAlign: 'center', fontSize: '12px', color: colors.textSecondary,
                        fontFamily: fonts.body, marginTop: '24px', opacity: 0.6,
                    }}>
                        &copy; {new Date().getFullYear()} TrialMatchAI. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Keyframe animations */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }
            `}</style>
        </div>
    );
}
