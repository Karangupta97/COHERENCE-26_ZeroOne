import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../theme';

/* ── Professional SVG Icon Components ── */

const UserIcon = ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

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

const PhoneIcon = ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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

const CheckIcon = ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

const XIcon = ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);

const DnaIcon = ({ size = 28, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 15c6.667-6 13.333 0 20-6" />
        <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
        <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
        <path d="M17 6l-2.5-2.5" /><path d="M14 8l-1.5-1.5" />
        <path d="M7 18l2.5 2.5" /><path d="M3.5 14.5l.5.5" />
        <path d="M20 9l.5.5" /><path d="M6.5 12.5l1 1" />
        <path d="M16.5 10.5l1 1" /><path d="M10 16l1.5 1.5" />
    </svg>
);

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
        <path d="M12 6v4" /><path d="M14 14H9.5a2.5 2.5 0 0 1 0-5H14" />
        <path d="M14 8V6" />
        <path d="M14 14v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
        <rect x="14" y="6" width="6" height="12" rx="2" />
    </svg>
);

const SparklesIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" /><path d="M19 17v4" />
        <path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
);

const ChartIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
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

const roleIconMap = {
    patient: PatientIcon,
    doctor: DoctorIcon,
    clinic: ClinicIcon,
};

/* ── Password strength helpers ── */
const passwordRules = [
    { label: '8+ characters', test: (v) => v.length >= 8 },
    { label: 'Uppercase letter', test: (v) => /[A-Z]/.test(v) },
    { label: 'Lowercase letter', test: (v) => /[a-z]/.test(v) },
    { label: 'Number', test: (v) => /[0-9]/.test(v) },
    { label: 'Special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const getStrength = (pw) => {
    const passed = passwordRules.filter(r => r.test(pw)).length;
    if (passed <= 1) return { level: 0, label: '', color: 'transparent' };
    if (passed <= 2) return { level: 1, label: 'Weak', color: '#EF4444' };
    if (passed <= 3) return { level: 2, label: 'Fair', color: '#F59E0B' };
    if (passed <= 4) return { level: 3, label: 'Good', color: '#3B82F6' };
    return { level: 4, label: 'Strong', color: '#22C55E' };
};

export default function SignupPage() {
    const { colors, fonts, mode, toggleMode } = useTheme();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1 = role + name, 2 = credentials
    const [selectedRole, setSelectedRole] = useState('doctor');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

    const [hoveredRole, setHoveredRole] = useState(null);
    const [submitHover, setSubmitHover] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    const isDark = mode === 'dark';
    const strength = getStrength(password);
    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

    const roles = [
        { key: 'patient', label: 'Patient', desc: 'Find clinical trials' },
        { key: 'doctor', label: 'Doctor', desc: 'Manage patients' },
        { key: 'clinic', label: 'Clinic', desc: 'Run & monitor trials' },
    ];

    const features = [
        { Icon: SparklesIcon, text: 'AI-Powered Matching', color: colors.accent },
        { Icon: ChartIcon, text: 'Real-time Analytics', color: colors.green },
        { Icon: ShieldCheckIcon, text: 'HIPAA Compliant', color: colors.accent },
        { Icon: GlobeIcon, text: 'Global Trial Access', color: colors.green },
    ];

    const stats = [
        { value: '12K+', label: 'Active Trials' },
        { value: '98%', label: 'Match Accuracy' },
        { value: '50K+', label: 'Patients Matched' },
    ];

    const canProceed = firstName.trim() && lastName.trim() && selectedRole;
    const canSubmit = email.trim() && password && password === confirmPassword && strength.level >= 3 && agreeTerms;

    const handleSubmit = () => {
        if (!canSubmit) return;
        setIsLoading(true);
        setTimeout(() => {
            navigate('/login');
        }, 800);
    };

    /* ── Reusable input builder ── */
    const renderInput = ({ id, label, type = 'text', value, onChange, placeholder, icon: Icon, rightElement, autoComplete }) => {
        const focused = focusedField === id;
        return (
            <div>
                <label style={{
                    display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600,
                    color: colors.textPrimary, fontFamily: fonts.body, letterSpacing: '0.01em',
                }}>
                    {label}
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    {Icon && (
                        <span style={{
                            position: 'absolute', left: '14px',
                            color: focused ? colors.accent : colors.textSecondary,
                            transition: 'color 0.2s ease', display: 'flex', pointerEvents: 'none',
                        }}>
                            <Icon size={18} />
                        </span>
                    )}
                    <input
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        onFocus={() => setFocusedField(id)}
                        onBlur={() => setFocusedField(null)}
                        style={{
                            width: '100%',
                            padding: Icon ? '12px 16px 12px 42px' : '12px 16px',
                            paddingRight: rightElement ? '44px' : '16px',
                            borderRadius: '10px',
                            border: `1.5px solid ${focused ? colors.accent : colors.border}`,
                            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                            color: colors.textPrimary, fontFamily: fonts.body, fontSize: '14px',
                            transition: 'all 0.25s ease', outline: 'none',
                            boxShadow: focused ? `0 0 0 3px ${colors.accentGlow}` : 'none',
                        }}
                    />
                    {rightElement}
                </div>
            </div>
        );
    };

    const eyeButton = (show, toggle) => (
        <button type="button" onClick={toggle} tabIndex={-1} style={{
            position: 'absolute', right: '12px', background: 'none', border: 'none',
            color: colors.textSecondary, cursor: 'pointer', display: 'flex', padding: '4px',
            borderRadius: '6px', transition: 'color 0.2s ease',
        }}
            onMouseEnter={(e) => e.currentTarget.style.color = colors.accent}
            onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
        >
            {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
    );

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            background: colors.bg, position: 'relative', overflow: 'hidden',
            transition: 'background 0.4s ease',
        }}>
            {/* ── Mobile-first: single column, desktop: split layout ── */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'row',
                minHeight: '100vh',
            }}>
                {/* ── Left Branding Panel (hidden on mobile) ── */}
                <div className="signup-brand" style={{
                    flex: '0 0 44%', display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center',
                    padding: '48px 48px', position: 'relative', overflow: 'hidden',
                    background: isDark
                        ? `linear-gradient(160deg, ${colors.surface} 0%, ${colors.card} 60%, ${colors.surface} 100%)`
                        : `linear-gradient(160deg, ${colors.card} 0%, ${colors.surface} 60%, ${colors.card} 100%)`,
                    borderRight: `1px solid ${colors.border}`,
                }}>
                    {/* Animated gradient orbs */}
                    <div style={{
                        position: 'absolute', top: '8%', left: '10%', width: '300px', height: '300px', borderRadius: '50%',
                        background: `radial-gradient(circle, ${colors.accentGlow}, transparent 70%)`,
                        animation: 'float 6s ease-in-out infinite', pointerEvents: 'none', opacity: 0.8,
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '12%', right: '8%', width: '240px', height: '240px', borderRadius: '50%',
                        background: `radial-gradient(circle, ${colors.greenGlow}, transparent 70%)`,
                        animation: 'float 8s ease-in-out infinite reverse', pointerEvents: 'none', opacity: 0.8,
                    }} />

                    {/* Grid pattern */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `radial-gradient(${isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.025)'} 1px, transparent 1px)`,
                        backgroundSize: '28px 28px', pointerEvents: 'none',
                    }} />

                    {/* Content */}
                    <div style={{
                        position: 'relative', zIndex: 1, maxWidth: '380px',
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateX(0)' : 'translateX(-30px)',
                        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}>
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '14px',
                            background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '24px', boxShadow: `0 8px 32px ${colors.accentGlow}`,
                        }}>
                            <DnaIcon size={24} color="#fff" />
                        </div>

                        <h1 style={{
                            fontFamily: fonts.heading, fontSize: '34px', fontWeight: 800,
                            color: colors.textPrimary, margin: 0, lineHeight: 1.15, letterSpacing: '-0.025em',
                        }}>
                            Join<br />
                            <span style={{ color: colors.accent }}>
                                TrialMatch<span style={{ color: colors.green }}>AI</span>
                            </span>
                        </h1>

                        <p style={{
                            fontFamily: fonts.body, fontSize: '15px', color: colors.textSecondary,
                            marginTop: '12px', lineHeight: 1.7, maxWidth: '340px',
                        }}>
                            Create your account and start connecting with clinical trials powered by artificial intelligence.
                        </p>

                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '32px',
                        }}>
                            {features.map((f, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '10px 12px', borderRadius: '12px',
                                    background: isDark ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.025)',
                                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                                    opacity: mounted ? 1 : 0,
                                    transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                                    transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.08}s`,
                                }}>
                                    <div style={{
                                        width: '30px', height: '30px', borderRadius: '8px',
                                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <f.Icon size={15} color={f.color} />
                                    </div>
                                    <span style={{
                                        fontFamily: fonts.body, fontSize: '12px', fontWeight: 500,
                                        color: colors.textSecondary,
                                    }}>{f.text}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            display: 'flex', gap: '24px', marginTop: '32px', paddingTop: '20px',
                            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                            opacity: mounted ? 1 : 0,
                            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.65s',
                        }}>
                            {stats.map((s, i) => (
                                <div key={i}>
                                    <div style={{
                                        fontFamily: fonts.heading, fontSize: '20px', fontWeight: 700,
                                        color: colors.textPrimary, lineHeight: 1,
                                    }}>{s.value}</div>
                                    <div style={{
                                        fontFamily: fonts.body, fontSize: '11px', fontWeight: 500,
                                        color: colors.textSecondary, marginTop: '3px',
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
                    padding: '32px 24px', position: 'relative',
                    overflowY: 'auto',
                }}>
                    {/* Theme toggle */}
                    <button onClick={toggleMode} style={{
                        position: 'absolute', top: '20px', right: '20px',
                        width: '40px', height: '40px', borderRadius: '10px',
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                        border: `1px solid ${colors.border}`, color: colors.textSecondary,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
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
                        width: '100%', maxWidth: '440px',
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
                    }}>
                        {/* Mobile logo (hidden on desktop) */}
                        <div className="signup-mobile-logo" style={{
                            display: 'none', alignItems: 'center', gap: '10px', marginBottom: '24px',
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '10px',
                                background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: `0 4px 16px ${colors.accentGlow}`,
                            }}>
                                <DnaIcon size={20} color="#fff" />
                            </div>
                            <span style={{
                                fontFamily: fonts.heading, fontSize: '20px', fontWeight: 700,
                                color: colors.textPrimary,
                            }}>
                                TrialMatch<span style={{ color: colors.accent }}>AI</span>
                            </span>
                        </div>

                        {/* Header */}
                        <div style={{ marginBottom: '24px' }}>
                            <h2 style={{
                                fontFamily: fonts.heading, fontSize: '24px', fontWeight: 700,
                                color: colors.textPrimary, margin: 0, letterSpacing: '-0.015em',
                            }}>
                                Create your account
                            </h2>
                            <p style={{
                                fontFamily: fonts.body, fontSize: '14px',
                                color: colors.textSecondary, marginTop: '6px', lineHeight: 1.5,
                            }}>
                                {step === 1
                                    ? 'Choose your role and tell us your name.'
                                    : 'Set up your login credentials to get started.'}
                            </p>
                        </div>

                        {/* Step indicator */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px',
                        }}>
                            {[1, 2].map(s => (
                                <React.Fragment key={s}>
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '12px', fontWeight: 600, fontFamily: fonts.body,
                                        background: step >= s ? colors.accent : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                                        color: step >= s ? '#fff' : colors.textSecondary,
                                        transition: 'all 0.3s ease',
                                        boxShadow: step === s ? `0 2px 10px ${colors.accentGlow}` : 'none',
                                    }}>
                                        {step > s ? <CheckIcon size={13} color="#fff" /> : s}
                                    </div>
                                    {s < 2 && (
                                        <div style={{
                                            flex: 1, height: '2px', borderRadius: '1px',
                                            background: step > 1 ? colors.accent : colors.border,
                                            transition: 'background 0.3s ease',
                                        }} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* ── STEP 1: Role + Name ── */}
                        {step === 1 && (
                            <div style={{
                                animation: 'fadeSlideIn 0.35s ease forwards',
                            }}>
                                {/* Role selector */}
                                <label style={{
                                    display: 'block', marginBottom: '10px',
                                    fontSize: '13px', fontWeight: 600,
                                    color: colors.textPrimary, fontFamily: fonts.body,
                                }}>
                                    I am a
                                </label>
                                <div style={{
                                    display: 'flex', gap: '10px', marginBottom: '20px',
                                }}>
                                    {roles.map(role => {
                                        const active = selectedRole === role.key;
                                        const hovered = hoveredRole === role.key;
                                        const RoleIcon = roleIconMap[role.key];
                                        return (
                                            <button key={role.key}
                                                onClick={() => setSelectedRole(role.key)}
                                                onMouseEnter={() => setHoveredRole(role.key)}
                                                onMouseLeave={() => setHoveredRole(null)}
                                                style={{
                                                    flex: 1, padding: '14px 8px', borderRadius: '12px',
                                                    border: active
                                                        ? `1.5px solid ${colors.accent}`
                                                        : `1.5px solid ${hovered ? colors.textSecondary + '44' : colors.border}`,
                                                    background: active ? colors.accentGlow
                                                        : hovered ? (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)') : 'transparent',
                                                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                                                    alignItems: 'center', gap: '6px',
                                                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                                    boxShadow: active ? `0 4px 16px ${colors.accentGlow}` : 'none',
                                                    transform: active ? 'translateY(-1px)' : 'translateY(0)',
                                                }}
                                            >
                                                <div style={{
                                                    width: '36px', height: '36px', borderRadius: '10px',
                                                    background: active ? colors.accent : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'all 0.25s ease',
                                                }}>
                                                    <RoleIcon size={18} color={active ? '#fff' : colors.textSecondary} />
                                                </div>
                                                <span style={{
                                                    fontFamily: fonts.body, fontSize: '13px',
                                                    fontWeight: active ? 600 : 500,
                                                    color: active ? colors.accent : colors.textPrimary,
                                                }}>{role.label}</span>
                                                <span style={{
                                                    fontFamily: fonts.body, fontSize: '11px',
                                                    color: colors.textSecondary, opacity: 0.8,
                                                }}>{role.desc}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Name fields — side by side on larger, stacked on mobile */}
                                <div style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px',
                                }} className="signup-name-grid">
                                    {renderInput({
                                        id: 'firstName', label: 'First Name', value: firstName,
                                        onChange: (e) => setFirstName(e.target.value),
                                        placeholder: 'John', icon: UserIcon, autoComplete: 'given-name',
                                    })}
                                    {renderInput({
                                        id: 'lastName', label: 'Last Name', value: lastName,
                                        onChange: (e) => setLastName(e.target.value),
                                        placeholder: 'Doe', icon: UserIcon, autoComplete: 'family-name',
                                    })}
                                </div>

                                {/* Phone (optional) */}
                                <div style={{ marginBottom: '24px' }}>
                                    {renderInput({
                                        id: 'phone', label: 'Phone (optional)', type: 'tel', value: phone,
                                        onChange: (e) => setPhone(e.target.value),
                                        placeholder: '+1 (555) 000-0000', icon: PhoneIcon, autoComplete: 'tel',
                                    })}
                                </div>

                                {/* Continue button */}
                                <button
                                    onClick={() => canProceed && setStep(2)}
                                    disabled={!canProceed}
                                    style={{
                                        width: '100%', padding: '13px', borderRadius: '10px',
                                        background: canProceed ? colors.accent : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                                        color: canProceed ? '#fff' : colors.textSecondary,
                                        fontFamily: fonts.body, fontSize: '15px', fontWeight: 600,
                                        border: 'none',
                                        cursor: canProceed ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        boxShadow: canProceed ? `0 2px 8px ${colors.accentGlow}` : 'none',
                                        opacity: canProceed ? 1 : 0.7,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (canProceed) {
                                            e.currentTarget.style.boxShadow = `0 8px 30px ${colors.accentGlow}`;
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = canProceed ? `0 2px 8px ${colors.accentGlow}` : 'none';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    Continue
                                    <ArrowIcon />
                                </button>
                            </div>
                        )}

                        {/* ── STEP 2: Credentials ── */}
                        {step === 2 && (
                            <div style={{
                                animation: 'fadeSlideIn 0.35s ease forwards',
                            }}>
                                {/* Back button */}
                                <button onClick={() => setStep(1)} style={{
                                    background: 'none', border: 'none', color: colors.textSecondary,
                                    fontFamily: fonts.body, fontSize: '13px', fontWeight: 500,
                                    cursor: 'pointer', padding: 0, marginBottom: '16px',
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    transition: 'color 0.2s ease',
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = colors.accent}
                                    onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m15 18-6-6 6-6" />
                                    </svg>
                                    Back
                                </button>

                                {/* Email */}
                                <div style={{ marginBottom: '14px' }}>
                                    {renderInput({
                                        id: 'email', label: 'Email Address', type: 'email', value: email,
                                        onChange: (e) => setEmail(e.target.value),
                                        placeholder: `${selectedRole}@example.com`, icon: EmailIcon, autoComplete: 'email',
                                    })}
                                </div>

                                {/* Password */}
                                <div style={{ marginBottom: '4px' }}>
                                    {renderInput({
                                        id: 'password', label: 'Password', type: showPassword ? 'text' : 'password',
                                        value: password, onChange: (e) => setPassword(e.target.value),
                                        placeholder: 'Create a strong password', icon: LockIcon,
                                        autoComplete: 'new-password',
                                        rightElement: eyeButton(showPassword, () => setShowPassword(!showPassword)),
                                    })}
                                </div>

                                {/* Strength bar */}
                                {password.length > 0 && (
                                    <div style={{ marginBottom: '14px' }}>
                                        <div style={{
                                            display: 'flex', gap: '4px', marginTop: '8px', marginBottom: '6px',
                                        }}>
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} style={{
                                                    flex: 1, height: '3px', borderRadius: '2px',
                                                    background: i <= strength.level ? strength.color
                                                        : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'),
                                                    transition: 'background 0.3s ease',
                                                }} />
                                            ))}
                                        </div>
                                        <div style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        }}>
                                            <span style={{
                                                fontFamily: fonts.body, fontSize: '11px', fontWeight: 600,
                                                color: strength.color,
                                            }}>
                                                {strength.label}
                                            </span>
                                        </div>
                                        {/* Rule checklist */}
                                        <div style={{
                                            display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px',
                                        }}>
                                            {passwordRules.map((rule, i) => {
                                                const passed = rule.test(password);
                                                return (
                                                    <span key={i} style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                        fontSize: '11px', fontFamily: fonts.body, fontWeight: 500,
                                                        color: passed ? colors.green : colors.textSecondary,
                                                        opacity: passed ? 1 : 0.6,
                                                        transition: 'all 0.2s ease',
                                                    }}>
                                                        {passed
                                                            ? <CheckIcon size={11} color={colors.green} />
                                                            : <XIcon size={11} color={colors.textSecondary} />}
                                                        {rule.label}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Confirm password */}
                                <div style={{ marginBottom: '20px', marginTop: password.length === 0 ? '14px' : 0 }}>
                                    {renderInput({
                                        id: 'confirmPassword', label: 'Confirm Password',
                                        type: showConfirm ? 'text' : 'password',
                                        value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value),
                                        placeholder: 'Re-enter your password', icon: LockIcon,
                                        autoComplete: 'new-password',
                                        rightElement: eyeButton(showConfirm, () => setShowConfirm(!showConfirm)),
                                    })}
                                    {confirmPassword.length > 0 && !passwordsMatch && (
                                        <span style={{
                                            display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px',
                                            fontSize: '12px', color: colors.red, fontFamily: fonts.body, fontWeight: 500,
                                        }}>
                                            <XIcon size={12} color={colors.red} />
                                            Passwords do not match
                                        </span>
                                    )}
                                    {passwordsMatch && (
                                        <span style={{
                                            display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px',
                                            fontSize: '12px', color: colors.green, fontFamily: fonts.body, fontWeight: 500,
                                        }}>
                                            <CheckIcon size={12} color={colors.green} />
                                            Passwords match
                                        </span>
                                    )}
                                </div>

                                {/* Terms checkbox */}
                                <label style={{
                                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                                    marginBottom: '24px', cursor: 'pointer',
                                }}>
                                    <div
                                        onClick={() => setAgreeTerms(!agreeTerms)}
                                        style={{
                                            width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                                            border: `1.5px solid ${agreeTerms ? colors.accent : colors.border}`,
                                            background: agreeTerms ? colors.accent : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.2s ease', marginTop: '1px',
                                        }}
                                    >
                                        {agreeTerms && <CheckIcon size={11} color="#fff" />}
                                    </div>
                                    <span style={{
                                        fontFamily: fonts.body, fontSize: '13px',
                                        color: colors.textSecondary, lineHeight: 1.5,
                                    }}>
                                        I agree to the{' '}
                                        <span style={{ color: colors.accent, fontWeight: 500 }}>Terms of Service</span>
                                        {' '}and{' '}
                                        <span style={{ color: colors.accent, fontWeight: 500 }}>Privacy Policy</span>
                                    </span>
                                </label>

                                {/* Submit button */}
                                <button
                                    onClick={handleSubmit}
                                    onMouseEnter={() => setSubmitHover(true)}
                                    onMouseLeave={() => setSubmitHover(false)}
                                    disabled={!canSubmit || isLoading}
                                    style={{
                                        width: '100%', padding: '13px', borderRadius: '10px',
                                        background: canSubmit
                                            ? (submitHover ? `linear-gradient(135deg, ${colors.accent}, ${colors.green})` : colors.accent)
                                            : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                                        color: canSubmit ? '#fff' : colors.textSecondary,
                                        fontFamily: fonts.body, fontSize: '15px', fontWeight: 600,
                                        border: 'none',
                                        cursor: canSubmit ? (isLoading ? 'wait' : 'pointer') : 'not-allowed',
                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                        boxShadow: canSubmit && submitHover ? `0 8px 30px ${colors.accentGlow}` : (canSubmit ? `0 2px 8px ${colors.accentGlow}` : 'none'),
                                        transform: canSubmit && submitHover ? 'translateY(-1px)' : 'translateY(0)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        opacity: canSubmit ? (isLoading ? 0.8 : 1) : 0.7,
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
                                            Create Account
                                            <ArrowIcon />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Sign in link */}
                        <p style={{
                            textAlign: 'center', fontSize: '13px', color: colors.textSecondary,
                            fontFamily: fonts.body, marginTop: '24px',
                        }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{
                                color: colors.accent, fontWeight: 600, textDecoration: 'none',
                                transition: 'opacity 0.2s ease',
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                            >
                                Sign in
                            </Link>
                        </p>

                        {/* Footer */}
                        <p style={{
                            textAlign: 'center', fontSize: '12px', color: colors.textSecondary,
                            fontFamily: fonts.body, marginTop: '16px', opacity: 0.5,
                        }}>
                            &copy; {new Date().getFullYear()} TrialMatchAI. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Responsive + animation styles ── */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* ── Mobile first (< 768px) ── */
                .signup-brand {
                    display: none !important;
                }
                .signup-mobile-logo {
                    display: flex !important;
                }
                .signup-name-grid {
                    grid-template-columns: 1fr !important;
                }

                /* ── Tablet (768px+) ── */
                @media (min-width: 768px) {
                    .signup-name-grid {
                        grid-template-columns: 1fr 1fr !important;
                    }
                }

                /* ── Desktop (1024px+) ── */
                @media (min-width: 1024px) {
                    .signup-brand {
                        display: flex !important;
                    }
                    .signup-mobile-logo {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
