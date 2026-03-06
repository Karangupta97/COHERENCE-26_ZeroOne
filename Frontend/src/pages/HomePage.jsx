import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme';

/* ════════════════════════════════════════════════
   Professional SVG Icon Components
   ════════════════════════════════════════════════ */

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

const SparklesIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" /><path d="M19 17v4" />
        <path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
);

const ShieldCheckIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

const ChartIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
    </svg>
);

const GlobeIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
    </svg>
);

const ClipboardIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M12 11h4" /><path d="M12 16h4" />
        <path d="M8 11h.01" /><path d="M8 16h.01" />
    </svg>
);

const UserIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const StethoscopeIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
    </svg>
);

const BuildingIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01" /><path d="M16 6h.01" />
        <path d="M12 6h.01" /><path d="M12 10h.01" />
        <path d="M12 14h.01" /><path d="M16 10h.01" />
        <path d="M16 14h.01" /><path d="M8 10h.01" />
        <path d="M8 14h.01" />
    </svg>
);

const ArrowRightIcon = ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
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

const MenuIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
);

const CloseIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);

const CheckCircleIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

const QuoteIcon = ({ size = 32, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} opacity="0.15">
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
    </svg>
);


/* ════════════════════════════════════════════════
   HomePage Component
   ════════════════════════════════════════════════ */

export default function HomePage() {
    const { colors, fonts, mode, toggleMode } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [visibleSections, setVisibleSections] = useState({});
    const sectionRefs = useRef({});

    const isDark = mode === 'dark';

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    // Intersection observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.15 }
        );
        Object.values(sectionRefs.current).forEach((ref) => {
            if (ref) observer.observe(ref);
        });
        return () => observer.disconnect();
    }, []);

    // Auto-rotate testimonials
    const testimonialsCount = 3;
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((p) => (p + 1) % testimonialsCount);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const navLinks = [
        { label: 'Features', href: '#features' },
        { label: 'Roles', href: '#roles' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Testimonials', href: '#testimonials' },
    ];

    const features = [
        { Icon: SparklesIcon, title: 'AI-Powered Matching', desc: 'Intelligent algorithms scan thousands of trials to find the best matches for each patient profile.', color: colors.accent },
        { Icon: ChartIcon, title: 'Real-time Analytics', desc: 'Track enrollment metrics, match rates, and trial performance with live dashboards.', color: colors.green },
        { Icon: GlobeIcon, title: 'Global Trial Access', desc: 'Access clinical trials from research centers worldwide with geo-aware recommendations.', color: colors.accent },
        { Icon: ClipboardIcon, title: 'Smart Eligibility Reports', desc: 'AI generates clear explanations of why a patient qualifies or doesn\'t — no medical jargon.', color: colors.green },
        { Icon: ShieldCheckIcon, title: 'Automated Workflows', desc: 'Streamline screening, enrollment, and follow-up with configurable automation pipelines.', color: colors.accent },
    ];

    const roles = [
        {
            Icon: UserIcon, key: 'patient', title: 'Patient',
            desc: 'Discover trials tailored to your condition, track applications, and get AI-powered health insights.',
            points: ['Personalized trial recommendations', 'Health score & AI insights', 'Application tracking dashboard'],
        },
        {
            Icon: StethoscopeIcon, key: 'doctor', title: 'Doctor',
            desc: 'Refer patients to matching trials, monitor progress, and communicate securely with clinics.',
            points: ['Patient referral management', 'AI-assisted match review', 'Secure messaging & alerts'],
        },
        {
            Icon: BuildingIcon, key: 'clinic', title: 'Clinic',
            desc: 'Post trials, manage candidate pipelines, and view real-time enrollment analytics.',
            points: ['Trial posting & management', 'Candidate workflow board', 'Enrollment funnel analytics'],
        },
    ];

    const steps = [
        { num: '01', title: 'Create Your Account', desc: 'Sign up as a Patient, Doctor, or Clinic in under a minute.' },
        { num: '02', title: 'Complete Your Profile', desc: 'Add medical history, specializations, or trial details depending on your role.' },
        { num: '03', title: 'Get AI Matches', desc: 'Our engine analyzes profiles and surfaces the best trial-patient matches instantly.' },
        { num: '04', title: 'Track & Manage', desc: 'Monitor applications, enrollment funnels, and outcomes from your dashboard.' },
    ];

    const testimonials = [
        { name: 'Dr. Sarah Mitchell', role: 'Oncologist', text: 'TrialMatchAI cut our patient-trial matching time from weeks to minutes. The AI recommendations are remarkably accurate.' },
        { name: 'James Cooper', role: 'Patient', text: 'I found a clinical trial for my condition within days of signing up. The eligibility reports made everything crystal clear.' },
        { name: 'Mayo Clinical Research', role: 'Research Clinic', text: 'Our enrollment rates increased by 40% after switching to TrialMatchAI. The workflow automation is a game-changer.' },
    ];

    const stats = [
        { value: '12,000+', label: 'Active Trials' },
        { value: '98.5%', label: 'Match Accuracy' },
        { value: '50,000+', label: 'Patients Matched' },
        { value: '200+', label: 'Partner Clinics' },
    ];

    const registerRef = (id) => (el) => { sectionRefs.current[id] = el; };
    const sectionVisible = (id) => visibleSections[id];

    return (
        <div style={{
            minHeight: '100vh', background: colors.bg, color: colors.textPrimary,
            fontFamily: fonts.body, transition: 'background 0.4s ease, color 0.4s ease',
            overflowX: 'hidden',
        }}>
            {/* ── Responsive Styles ── */}
            <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }
                html { scroll-behavior: smooth; }

                /* Smooth dark/light mode transition on ALL elements */
                *, *::before, *::after {
                    transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .hp-section-animate {
                    opacity: 0; transform: translateY(30px);
                    transition: opacity 0.7s ease, transform 0.7s ease;
                }
                .hp-section-visible {
                    opacity: 1 !important; transform: translateY(0) !important;
                }

                /* Mobile-first grid defaults */
                .hp-nav-links { display: none; }
                .hp-mobile-toggle { display: flex; }
                .hp-hero-grid { flex-direction: column; text-align: center; padding: 0 20px; }
                .hp-hero-text { max-width: 100%; }
                .hp-hero-visual { display: none; }
                .hp-features-grid { grid-template-columns: 1fr; }
                .hp-roles-grid { grid-template-columns: 1fr; }
                .hp-steps-grid { grid-template-columns: 1fr; }
                .hp-stats-grid { grid-template-columns: 1fr 1fr; }
                .hp-cta-buttons { flex-direction: column; align-items: center; }
                .hp-cta-buttons a { width: 100%; text-align: center; }
                .hp-footer-grid { grid-template-columns: 1fr; text-align: center; }
                .hp-hero-title { font-size: 32px; }
                .hp-hero-sub { font-size: 16px; }
                .hp-section-title { font-size: 26px; }
                .hp-mobile-menu { display: flex; }

                /* Tablet (768px+) */
                @media (min-width: 768px) {
                    .hp-features-grid { grid-template-columns: 1fr 1fr; }
                    .hp-roles-grid { grid-template-columns: 1fr 1fr 1fr; }
                    .hp-steps-grid { grid-template-columns: 1fr 1fr; }
                    .hp-stats-grid { grid-template-columns: repeat(4, 1fr); }
                    .hp-cta-buttons { flex-direction: row; }
                    .hp-cta-buttons a { width: auto; }
                    .hp-hero-title { font-size: 42px; }
                    .hp-hero-sub { font-size: 18px; }
                    .hp-section-title { font-size: 32px; }
                    .hp-footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; text-align: left; }
                }

                /* Desktop (1024px+) */
                @media (min-width: 1024px) {
                    .hp-nav-links { display: flex; }
                    .hp-mobile-toggle { display: none; }
                    .hp-hero-grid { flex-direction: row; text-align: left; padding: 0; }
                    .hp-hero-visual { display: flex; }
                    .hp-features-grid { grid-template-columns: 1fr 1fr 1fr; }
                    .hp-steps-grid { grid-template-columns: repeat(4, 1fr); }
                    .hp-hero-title { font-size: 52px; }
                    .hp-hero-sub { font-size: 19px; }
                    .hp-section-title { font-size: 36px; }
                }

                /* Large (1280px+) */
                @media (min-width: 1280px) {
                    .hp-hero-title { font-size: 58px; }
                }
            `}</style>

            {/* ═══════════════════════════════════════════
                NAVBAR
            ═══════════════════════════════════════════ */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                background: isDark ? 'rgba(4,5,26,0.85)' : 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                borderBottom: `1px solid ${colors.border}`,
                transition: 'background 0.4s ease, border-color 0.4s ease',
            }}>
                <div style={{
                    maxWidth: 1200, margin: '0 auto', padding: '0 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    height: 64,
                }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <DnaIcon size={20} color="#fff" />
                        </div>
                        <span style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 20, color: colors.textPrimary }}>
                            Trial<span style={{ color: colors.accent }}>Match</span><span style={{ color: colors.green }}>AI</span>
                        </span>
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hp-nav-links" style={{ alignItems: 'center', gap: 32 }}>
                        {navLinks.map((link) => (
                            <a key={link.label} href={link.href} style={{
                                color: colors.textSecondary, textDecoration: 'none', fontSize: 14,
                                fontWeight: 500, transition: 'color 0.2s',
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.color = colors.accent}
                                onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Right actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={toggleMode} style={{
                            width: 36, height: 36, borderRadius: 10, border: `1px solid ${colors.border}`,
                            background: colors.surface, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: colors.textSecondary, transition: 'all 0.2s',
                        }}>
                            {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
                        </button>

                        <Link to="/login" className="hp-nav-links" style={{
                            color: colors.textSecondary, textDecoration: 'none', fontSize: 14,
                            fontWeight: 500, padding: '8px 16px', borderRadius: 8,
                            border: `1px solid ${colors.border}`, transition: 'all 0.2s',
                        }}>
                            Sign In
                        </Link>

                        <Link to="/signup" className="hp-nav-links" style={{
                            color: '#fff', textDecoration: 'none', fontSize: 14,
                            fontWeight: 600, padding: '8px 20px', borderRadius: 8,
                            background: colors.accent, transition: 'all 0.2s',
                        }}>
                            Get Started
                        </Link>

                        {/* Mobile menu button */}
                        <button className="hp-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
                            width: 36, height: 36, borderRadius: 10, border: `1px solid ${colors.border}`,
                            background: colors.surface, alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: colors.textPrimary,
                        }}>
                            {mobileMenuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu dropdown */}
                {mobileMenuOpen && (
                    <div style={{
                        background: colors.surface, borderTop: `1px solid ${colors.border}`,
                        padding: '16px 24px', animation: 'slideDown 0.25s ease',
                    }}>
                        {navLinks.map((link) => (
                            <a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} style={{
                                display: 'block', padding: '12px 0', color: colors.textSecondary,
                                textDecoration: 'none', fontSize: 15, fontWeight: 500,
                                borderBottom: `1px solid ${colors.border}`,
                            }}>
                                {link.label}
                            </a>
                        ))}
                        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{
                                flex: 1, textAlign: 'center', padding: '10px', borderRadius: 8,
                                border: `1px solid ${colors.border}`, color: colors.textPrimary,
                                textDecoration: 'none', fontSize: 14, fontWeight: 500,
                            }}>
                                Sign In
                            </Link>
                            <Link to="/signup" onClick={() => setMobileMenuOpen(false)} style={{
                                flex: 1, textAlign: 'center', padding: '10px', borderRadius: 8,
                                background: colors.accent, color: '#fff',
                                textDecoration: 'none', fontSize: 14, fontWeight: 600,
                            }}>
                                Get Started
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* ═══════════════════════════════════════════
                HERO SECTION
            ═══════════════════════════════════════════ */}
            <section style={{
                paddingTop: 120, paddingBottom: 80, position: 'relative', overflow: 'hidden',
            }}>
                {/* Background orbs */}
                <div style={{
                    position: 'absolute', top: -120, right: -120, width: 400, height: 400,
                    borderRadius: '50%', background: `radial-gradient(circle, ${colors.accentGlow}, transparent 70%)`,
                    filter: 'blur(60px)', animation: 'pulse 6s ease-in-out infinite', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: -80, left: -100, width: 350, height: 350,
                    borderRadius: '50%', background: `radial-gradient(circle, ${colors.greenGlow}, transparent 70%)`,
                    filter: 'blur(60px)', animation: 'pulse 8s ease-in-out infinite 2s', pointerEvents: 'none',
                }} />

                <div className="hp-hero-grid" style={{
                    maxWidth: 1200, margin: '0 auto', padding: '0 24px',
                    display: 'flex', alignItems: 'center', gap: 60,
                    opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                    {/* Text */}
                    <div className="hp-hero-text" style={{ flex: 1 }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
                            borderRadius: 20, background: isDark ? 'rgba(129,140,248,0.1)' : 'rgba(79,70,229,0.06)',
                            border: `1px solid ${isDark ? 'rgba(129,140,248,0.2)' : 'rgba(79,70,229,0.15)'}`,
                            marginBottom: 24, fontSize: 13, fontWeight: 600, color: colors.accent,
                        }}>
                            <SparklesIcon size={14} color={colors.accent} />
                            AI-Powered Clinical Trial Platform
                        </div>

                        <h1 className="hp-hero-title" style={{
                            fontFamily: fonts.heading, fontWeight: 800, lineHeight: 1.12,
                            marginBottom: 20, letterSpacing: '-0.02em', color: colors.textPrimary,
                        }}>
                            Connecting Patients to{' '}
                            <span style={{ color: colors.accent }}>Life-Changing</span>{' '}
                            Clinical Trials
                        </h1>

                        <p className="hp-hero-sub" style={{
                            color: colors.textSecondary, lineHeight: 1.7, marginBottom: 36,
                            maxWidth: 520,
                        }}>
                            TrialMatchAI uses advanced AI to match patients with the right clinical trials,
                            streamline enrollment for clinics, and empower doctors with data-driven insights.
                        </p>

                        <div className="hp-cta-buttons" style={{ display: 'flex', gap: 14 }}>
                            <Link to="/signup" style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                padding: '14px 28px', borderRadius: 10, background: colors.accent,
                                color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 15,
                                boxShadow: `0 4px 20px ${colors.accentGlow}`,
                                transition: 'all 0.3s ease',
                            }}>
                                Get Started Free <ArrowRightIcon size={16} color="#fff" />
                            </Link>
                            <a href="#how-it-works" style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                padding: '14px 28px', borderRadius: 10,
                                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                border: `1px solid ${colors.border}`, color: colors.textPrimary,
                                textDecoration: 'none', fontWeight: 500, fontSize: 15,
                                transition: 'all 0.3s ease',
                            }}>
                                See How It Works
                            </a>
                        </div>
                    </div>

                    {/* Visual - floating cards (desktop only) */}
                    <div className="hp-hero-visual" style={{
                        flex: 1, justifyContent: 'center', alignItems: 'center',
                        position: 'relative', minHeight: 380,
                    }}>
                        {/* Main card */}
                        <div style={{
                            position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
                            width: 280, padding: '24px', borderRadius: 16,
                            background: colors.surface, border: `1px solid ${colors.border}`,
                            boxShadow: colors.shadow, animation: 'float 6s ease-in-out infinite',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10,
                                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <SparklesIcon size={20} color="#fff" />
                                </div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>Match Found!</div>
                                    <div style={{ fontSize: 12, color: colors.textSecondary }}>98% compatibility</div>
                                </div>
                            </div>
                            <div style={{
                                height: 6, borderRadius: 3, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    width: '98%', height: '100%', borderRadius: 3,
                                    background: `linear-gradient(90deg, ${colors.accent}, ${colors.green})`,
                                }} />
                            </div>
                        </div>

                        {/* Secondary card */}
                        <div style={{
                            position: 'absolute', top: 160, left: 20, width: 200, padding: '16px',
                            borderRadius: 12, background: colors.surface, border: `1px solid ${colors.border}`,
                            boxShadow: colors.shadow, animation: 'float 7s ease-in-out infinite 1s',
                        }}>
                            <div style={{ fontSize: 24, fontWeight: 700, color: colors.accent, fontFamily: fonts.heading }}>12K+</div>
                            <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>Active Clinical Trials</div>
                        </div>

                        {/* Tertiary card */}
                        <div style={{
                            position: 'absolute', top: 180, right: 20, width: 180, padding: '16px',
                            borderRadius: 12, background: colors.surface, border: `1px solid ${colors.border}`,
                            boxShadow: colors.shadow, animation: 'float 5s ease-in-out infinite 0.5s',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <ShieldCheckIcon size={16} color={colors.green} />
                                <span style={{ fontSize: 12, fontWeight: 600, color: colors.green }}>Secure Platform</span>
                            </div>
                            <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>
                                Encrypted end-to-end
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                STATS BAR
            ═══════════════════════════════════════════ */}
            <section style={{
                borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}`,
                background: colors.surface, padding: '40px 24px',
            }}>
                <div className="hp-stats-grid" style={{
                    maxWidth: 1000, margin: '0 auto',
                    display: 'grid', gap: 24, textAlign: 'center',
                }}>
                    {stats.map((s, i) => (
                        <div key={i}>
                            <div style={{
                                fontSize: 28, fontWeight: 800, fontFamily: fonts.heading,
                                color: colors.accent, letterSpacing: '-0.02em',
                            }}>
                                {s.value}
                            </div>
                            <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4, fontWeight: 500 }}>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                FEATURES
            ═══════════════════════════════════════════ */}
            <section id="features" ref={registerRef('features')}
                className={`hp-section-animate ${sectionVisible('features') ? 'hp-section-visible' : ''}`}
                style={{ padding: '80px 24px' }}
            >
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <span style={{
                            display: 'inline-block', padding: '5px 14px', borderRadius: 16,
                            background: isDark ? 'rgba(129,140,248,0.1)' : 'rgba(79,70,229,0.06)',
                            color: colors.accent, fontSize: 12, fontWeight: 600, marginBottom: 16,
                            letterSpacing: '0.04em', textTransform: 'uppercase',
                        }}>
                            Features
                        </span>
                        <h2 className="hp-section-title" style={{
                            fontFamily: fonts.heading, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 14, color: colors.textPrimary,
                        }}>
                            Everything You Need for{' '}
                            <span style={{ color: colors.accent }}>Clinical Trials</span>
                        </h2>
                        <p style={{ color: colors.textSecondary, maxWidth: 560, margin: '0 auto', lineHeight: 1.7, fontSize: 15 }}>
                            Purpose-built tools for patients, doctors, and clinics to accelerate clinical trial discovery and enrollment.
                        </p>
                    </div>

                    <div className="hp-features-grid" style={{ display: 'grid', gap: 20 }}>
                        {features.map((f, i) => (
                            <div key={i} style={{
                                padding: 28, borderRadius: 14, background: colors.surface,
                                border: `1px solid ${colors.border}`, transition: 'all 0.3s ease',
                                cursor: 'default',
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = f.color;
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = `0 12px 32px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = colors.border;
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    width: 44, height: 44, borderRadius: 11, marginBottom: 16,
                                    background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <f.Icon size={22} color={f.color} />
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, fontFamily: fonts.heading, color: colors.textPrimary }}>
                                    {f.title}
                                </h3>
                                <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.65 }}>
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                ROLES
            ═══════════════════════════════════════════ */}
            <section id="roles" ref={registerRef('roles')}
                className={`hp-section-animate ${sectionVisible('roles') ? 'hp-section-visible' : ''}`}
                style={{
                    padding: '80px 24px',
                    background: colors.surface,
                    borderTop: `1px solid ${colors.border}`,
                    borderBottom: `1px solid ${colors.border}`,
                }}
            >
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <span style={{
                            display: 'inline-block', padding: '5px 14px', borderRadius: 16,
                            background: isDark ? 'rgba(52,211,153,0.1)' : 'rgba(5,150,105,0.06)',
                            color: colors.green, fontSize: 12, fontWeight: 600, marginBottom: 16,
                            letterSpacing: '0.04em', textTransform: 'uppercase',
                        }}>
                            Built For Everyone
                        </span>
                        <h2 className="hp-section-title" style={{
                            fontFamily: fonts.heading, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 14, color: colors.textPrimary,
                        }}>
                            One Platform,{' '}
                            <span style={{ color: colors.green }}>Three Roles</span>
                        </h2>
                        <p style={{ color: colors.textSecondary, maxWidth: 520, margin: '0 auto', lineHeight: 1.7, fontSize: 15 }}>
                            Tailored experiences for every stakeholder in the clinical trial ecosystem.
                        </p>
                    </div>

                    <div className="hp-roles-grid" style={{ display: 'grid', gap: 24 }}>
                        {roles.map((r, i) => (
                            <div key={i} style={{
                                padding: 32, borderRadius: 16, background: colors.card,
                                border: `1px solid ${colors.border}`, transition: 'all 0.3s ease',
                                display: 'flex', flexDirection: 'column',
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = colors.accent;
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = `0 16px 40px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = colors.border;
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    width: 52, height: 52, borderRadius: 14, marginBottom: 20,
                                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <r.Icon size={26} color="#fff" />
                                </div>
                                <h3 style={{ fontSize: 20, fontWeight: 700, fontFamily: fonts.heading, marginBottom: 10, color: colors.textPrimary }}>
                                    {r.title}
                                </h3>
                                <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.65, marginBottom: 20 }}>
                                    {r.desc}
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, marginTop: 'auto' }}>
                                    {r.points.map((pt, j) => (
                                        <li key={j} style={{
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            padding: '7px 0', fontSize: 13.5, color: colors.textSecondary,
                                        }}>
                                            <CheckCircleIcon size={16} color={colors.green} />
                                            {pt}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                HOW IT WORKS
            ═══════════════════════════════════════════ */}
            <section id="how-it-works" ref={registerRef('how-it-works')}
                className={`hp-section-animate ${sectionVisible('how-it-works') ? 'hp-section-visible' : ''}`}
                style={{ padding: '80px 24px' }}
            >
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <span style={{
                            display: 'inline-block', padding: '5px 14px', borderRadius: 16,
                            background: isDark ? 'rgba(129,140,248,0.1)' : 'rgba(79,70,229,0.06)',
                            color: colors.accent, fontSize: 12, fontWeight: 600, marginBottom: 16,
                            letterSpacing: '0.04em', textTransform: 'uppercase',
                        }}>
                            How It Works
                        </span>
                        <h2 className="hp-section-title" style={{
                            fontFamily: fonts.heading, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 14, color: colors.textPrimary,
                        }}>
                            Get Started in{' '}
                            <span style={{ color: colors.accent }}>4 Simple Steps</span>
                        </h2>
                    </div>

                    <div className="hp-steps-grid" style={{ display: 'grid', gap: 24 }}>
                        {steps.map((s, i) => (
                            <div key={i} style={{
                                padding: 28, borderRadius: 14, background: colors.surface,
                                border: `1px solid ${colors.border}`, position: 'relative',
                                transition: 'all 0.3s ease',
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = colors.accent;
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = colors.border;
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{
                                    fontSize: 36, fontWeight: 800, fontFamily: fonts.heading,
                                    color: isDark ? 'rgba(129,140,248,0.15)' : 'rgba(79,70,229,0.1)',
                                    marginBottom: 12, lineHeight: 1,
                                }}>
                                    {s.num}
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: fonts.heading, marginBottom: 8, color: colors.textPrimary }}>
                                    {s.title}
                                </h3>
                                <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.65 }}>
                                    {s.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                TESTIMONIALS
            ═══════════════════════════════════════════ */}
            <section id="testimonials" ref={registerRef('testimonials')}
                className={`hp-section-animate ${sectionVisible('testimonials') ? 'hp-section-visible' : ''}`}
                style={{
                    padding: '80px 24px', background: colors.surface,
                    borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}`,
                }}
            >
                <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
                    <span style={{
                        display: 'inline-block', padding: '5px 14px', borderRadius: 16,
                        background: isDark ? 'rgba(52,211,153,0.1)' : 'rgba(5,150,105,0.06)',
                        color: colors.green, fontSize: 12, fontWeight: 600, marginBottom: 16,
                        letterSpacing: '0.04em', textTransform: 'uppercase',
                    }}>
                        Testimonials
                    </span>
                    <h2 className="hp-section-title" style={{
                        fontFamily: fonts.heading, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 48, color: colors.textPrimary,
                    }}>
                        Trusted by{' '}
                        <span style={{ color: colors.green }}>Thousands</span>
                    </h2>

                    {/* Testimonial card */}
                    <div style={{
                        padding: 36, borderRadius: 16, background: colors.card,
                        border: `1px solid ${colors.border}`, position: 'relative',
                        minHeight: 180, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.4s ease',
                    }}>
                        <QuoteIcon size={40} color={colors.accent} />
                        <p style={{
                            fontSize: 16, lineHeight: 1.7, color: colors.textPrimary,
                            fontStyle: 'italic', marginBottom: 24, maxWidth: 520,
                        }}>
                            "{testimonials[activeTestimonial].text}"
                        </p>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 15, fontFamily: fonts.heading, color: colors.textPrimary }}>
                                {testimonials[activeTestimonial].name}
                            </div>
                            <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
                                {testimonials[activeTestimonial].role}
                            </div>
                        </div>
                    </div>

                    {/* Dots */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
                        {testimonials.map((_, i) => (
                            <button key={i} onClick={() => setActiveTestimonial(i)} style={{
                                width: activeTestimonial === i ? 24 : 8, height: 8,
                                borderRadius: 4, border: 'none', cursor: 'pointer',
                                background: activeTestimonial === i ? colors.accent : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'),
                                transition: 'all 0.3s ease',
                            }} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                CTA SECTION
            ═══════════════════════════════════════════ */}
            <section style={{ padding: '80px 24px' }}>
                <div style={{
                    maxWidth: 800, margin: '0 auto', textAlign: 'center',
                    padding: '56px 32px', borderRadius: 20, position: 'relative', overflow: 'hidden',
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                }}>
                    {/* Pattern overlay */}
                    <div style={{
                        position: 'absolute', inset: 0, opacity: 0.06,
                        backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
                        backgroundSize: '24px 24px', pointerEvents: 'none',
                    }} />

                    <h2 style={{
                        fontFamily: fonts.heading, fontWeight: 800, fontSize: 30,
                        color: '#fff', marginBottom: 14, letterSpacing: '-0.02em', position: 'relative',
                    }}>
                        Ready to Transform Clinical Trials?
                    </h2>
                    <p style={{
                        color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.7,
                        maxWidth: 480, margin: '0 auto 32px', position: 'relative',
                    }}>
                        Join thousands of patients, doctors, and clinics already using TrialMatchAI to accelerate medical breakthroughs.
                    </p>
                    <div className="hp-cta-buttons" style={{ display: 'flex', justifyContent: 'center', gap: 14, position: 'relative' }}>
                        <Link to="/signup" style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            padding: '14px 32px', borderRadius: 10, background: '#fff',
                            color: colors.accent, textDecoration: 'none', fontWeight: 700, fontSize: 15,
                            transition: 'transform 0.2s',
                        }}>
                            Create Free Account <ArrowRightIcon size={16} color={colors.accent} />
                        </Link>
                        <Link to="/login" style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            padding: '14px 32px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                            color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: 15,
                            transition: 'transform 0.2s',
                        }}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                FOOTER
            ═══════════════════════════════════════════ */}
            <footer style={{
                borderTop: `1px solid ${colors.border}`, padding: '48px 24px 32px',
                background: colors.surface,
            }}>
                <div className="hp-footer-grid" style={{
                    maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 40,
                }}>
                    {/* Brand col */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, justifyContent: 'inherit' }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: 8,
                                background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <DnaIcon size={18} color="#fff" />
                            </div>
                            <span style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 18, color: colors.textPrimary }}>
                                Trial<span style={{ color: colors.accent }}>Match</span><span style={{ color: colors.green }}>AI</span>
                            </span>
                        </div>
                        <p style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.7, maxWidth: 280 }}>
                            AI-powered platform connecting patients, doctors, and clinics for better clinical trial outcomes.
                        </p>
                    </div>

                    {/* Links cols */}
                    {[
                        { title: 'Platform', links: [{ label: 'Features', href: '#features' }, { label: 'How It Works', href: '#how-it-works' }, { label: 'Testimonials', href: '#testimonials' }] },
                        { title: 'Roles', links: [{ label: 'For Patients', href: '#roles' }, { label: 'For Doctors', href: '#roles' }, { label: 'For Clinics', href: '#roles' }] },
                        { title: 'Account', links: [{ label: 'Sign In', href: '/login', isRoute: true }, { label: 'Create Account', href: '/signup', isRoute: true }] },
                    ].map((col, i) => (
                        <div key={i}>
                            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: colors.textPrimary, marginBottom: 16 }}>
                                {col.title}
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {col.links.map((link, j) => (
                                    <li key={j} style={{ marginBottom: 10 }}>
                                        {link.isRoute ? (
                                            <Link to={link.href} style={{
                                                color: colors.textSecondary, textDecoration: 'none', fontSize: 13.5,
                                                transition: 'color 0.2s',
                                            }}
                                                onMouseEnter={(e) => e.currentTarget.style.color = colors.accent}
                                                onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
                                            >
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <a href={link.href} style={{
                                                color: colors.textSecondary, textDecoration: 'none', fontSize: 13.5,
                                                transition: 'color 0.2s',
                                            }}
                                                onMouseEnter={(e) => e.currentTarget.style.color = colors.accent}
                                                onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
                                            >
                                                {link.label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div style={{
                    maxWidth: 1200, margin: '32px auto 0', paddingTop: 24,
                    borderTop: `1px solid ${colors.border}`,
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16,
                    fontSize: 12, color: colors.textSecondary,
                }}>
                    <span>&copy; {new Date().getFullYear()} TrialMatchAI. All rights reserved.</span>
                </div>
            </footer>
        </div>
    );
}
