import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTheme, spacing, radius, fontSize } from '../../theme.jsx'
import {
  HiOutlineBeaker,
  HiOutlineShieldCheck,
  HiOutlineDocumentCheck,
  HiOutlineMapPin,
  HiOutlineUserCircle,
  HiOutlineBuildingOffice2,
  HiOutlineHeart,
  HiBars3,
  HiXMark,
} from 'react-icons/hi2'

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' },
  }),
}
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

/* ─── Data ─── */
const NAV_LINKS = ['Home', 'About', 'Features', 'Contact']

const ROLES = [
  {
    title: 'Patient',
    desc: 'Find trials matched to your health profile and get clear eligibility reports.',
    icon: HiOutlineUserCircle,
    emoji: '🩺',
  },
  {
    title: 'Doctor',
    desc: 'Refer patients, review AI matches, and track their clinical trial journey.',
    icon: HiOutlineHeart,
    emoji: '👨‍⚕️',
  },
  {
    title: 'Clinic',
    desc: 'Post trials, manage candidate enrollment, and view analytics.',
    icon: HiOutlineBuildingOffice2,
    emoji: '🏥',
  },
]

const FEATURES = [
  {
    title: 'AI Trial Matching',
    desc: 'Our intelligent engine scans thousands of clinical trials to find the most relevant ones for each patient.',
    icon: HiOutlineBeaker,
  },
  {
    title: 'Secure Medical Data',
    desc: 'All patient information is encrypted end-to-end and compliant with HIPAA and GDPR regulations.',
    icon: HiOutlineShieldCheck,
  },
  {
    title: 'Eligibility Explanation',
    desc: "Get clear, human-readable reasons why you match or don't match a trial — no medical jargon.",
    icon: HiOutlineDocumentCheck,
  },
  {
    title: 'Nearby Trial Finder',
    desc: 'Discover recruiting clinical trials in your area using location-aware search.',
    icon: HiOutlineMapPin,
  },
]

/* ─── Component ─── */
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { colors, fonts, mode } = useTheme()

  /* ── Derived palette ── */
  const isDark = mode === 'dark'
  const cardBg = colors.surface
  const cardBorder = colors.border
  const accent = colors.accent
  const accentGlow = colors.accentGlow
  const green = colors.green
  const textPri = colors.textPrimary
  const textSec = colors.textSecondary
  const bg = colors.bg
  const shadow = colors.shadow

  /* ── Shared card style (matches dashboard cards) ── */
  const cardStyle = {
    background: cardBg,
    border: `1px solid ${cardBorder}`,
    borderRadius: radius.lg,
    boxShadow: shadow,
    transition: 'all 0.25s ease',
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, color: textPri, fontFamily: fonts.body, overflowX: 'hidden' }}>

      {/* ═══════════ NAVBAR ═══════════ */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: isDark ? `${colors.surface}ee` : `${colors.surface}ee`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${cardBorder}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${spacing.md} ${spacing.lg}` }}>
          {/* Logo */}
          <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, textDecoration: 'none' }}>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 36, height: 36, borderRadius: radius.md,
                background: `linear-gradient(135deg, ${accent}, ${green})`,
                color: '#fff', fontSize: fontSize.lg, fontWeight: 800, fontFamily: fonts.heading,
                boxShadow: `0 2px 12px ${accentGlow}`,
              }}
            >
              C
            </span>
            <span style={{ fontSize: fontSize.xl, fontWeight: 700, fontFamily: fonts.heading, color: textPri, letterSpacing: '-0.5px' }}>
              Trial<span style={{ color: accent }}>Match</span>{' '}
              <span style={{ fontWeight: 400, color: textSec, fontSize: fontSize.base }}>AI</span>
            </span>
          </a>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xl }} className="nav-desktop">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                style={{
                  fontSize: fontSize.sm, fontWeight: 500, color: textSec,
                  textDecoration: 'none', transition: 'color 0.2s',
                  fontFamily: fonts.body, letterSpacing: '0.3px',
                }}
                onMouseEnter={(e) => (e.target.style.color = accent)}
                onMouseLeave={(e) => (e.target.style.color = textSec)}
              >
                {l}
              </a>
            ))}
            <button
              onClick={() => navigate('/patient/dashboard')}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                borderRadius: radius.full,
                background: accent,
                color: '#fff',
                fontSize: fontSize.sm,
                fontWeight: 600,
                fontFamily: fonts.body,
                border: 'none',
                cursor: 'pointer',
                boxShadow: `0 2px 16px ${accentGlow}`,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = `0 4px 24px ${accentGlow}` }}
              onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = `0 2px 16px ${accentGlow}` }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ display: 'none', background: 'none', border: 'none', color: textPri, cursor: 'pointer', padding: spacing.xs }}
          >
            {menuOpen ? <HiXMark size={24} /> : <HiBars3 size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ background: cardBg, borderTop: `1px solid ${cardBorder}`, padding: `0 ${spacing.lg} ${spacing.md}` }}
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block', padding: `${spacing.md} 0`,
                  fontSize: fontSize.sm, fontWeight: 500, color: textSec,
                  textDecoration: 'none', borderBottom: `1px solid ${cardBorder}`,
                  fontFamily: fonts.body,
                }}
              >
                {l}
              </a>
            ))}
            <button
              onClick={() => navigate('/patient/dashboard')}
              style={{
                marginTop: spacing.md, width: '100%', padding: `${spacing.sm} 0`,
                borderRadius: radius.full, background: accent, color: '#fff',
                fontSize: fontSize.sm, fontWeight: 600, fontFamily: fonts.body, border: 'none', cursor: 'pointer',
              }}
            >
              Get Started
            </button>
          </motion.div>
        )}
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section id="home" style={{ position: 'relative', paddingTop: 140, paddingBottom: 80, overflow: 'hidden' }}>
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 420, height: 420, borderRadius: '50%', background: accentGlow, filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 200, left: -120, width: 340, height: 340, borderRadius: '50%', background: colors.greenGlow, filter: 'blur(100px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto', padding: `0 ${spacing.lg}`, textAlign: 'center' }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.span
              variants={fadeUp}
              custom={0}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: spacing.sm,
                padding: `6px ${spacing.md}`, borderRadius: radius.full,
                background: accentGlow, color: accent,
                fontSize: fontSize.xs, fontWeight: 600, fontFamily: fonts.mono || fonts.body,
                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: spacing.lg,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, display: 'inline-block' }} />
              AI-Powered Clinical Trial Platform
            </motion.span>

            <motion.h1
              variants={fadeUp}
              custom={1}
              style={{
                fontSize: fontSize.hero, fontFamily: fonts.heading, fontWeight: 800,
                lineHeight: 1.15, letterSpacing: '-1px', color: textPri, margin: `${spacing.lg} 0 0`,
              }}
            >
              Find the Right Clinical Trials{' '}
              <br />
              for You with{' '}
              <span style={{ color: accent }}>AI</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              style={{
                marginTop: spacing.lg, fontSize: fontSize.lg, color: textSec,
                maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7,
                fontFamily: fonts.body,
              }}
            >
              TrialMatch AI uses advanced machine learning to connect patients
              with the most suitable clinical trials — faster, smarter, and
              more transparently than ever before.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              style={{ marginTop: spacing.xxl, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.md, flexWrap: 'wrap' }}
            >
              <button
                onClick={() => navigate('/patient/dashboard')}
                style={{
                  padding: `14px ${spacing.xl}`, borderRadius: radius.full,
                  background: accent, color: '#fff',
                  fontWeight: 600, fontSize: fontSize.base, fontFamily: fonts.body,
                  border: 'none', cursor: 'pointer',
                  boxShadow: `0 4px 24px ${accentGlow}`,
                  transition: 'all 0.25s',
                }}
                onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 8px 32px ${accentGlow}` }}
                onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = `0 4px 24px ${accentGlow}` }}
              >
                Get Started
              </button>
              <a
                href="#features"
                style={{
                  padding: `14px ${spacing.xl}`, borderRadius: radius.full,
                  background: 'transparent', color: textPri,
                  fontWeight: 600, fontSize: fontSize.base, fontFamily: fonts.body,
                  border: `1px solid ${cardBorder}`, textDecoration: 'none',
                  cursor: 'pointer', transition: 'all 0.25s',
                }}
                onMouseEnter={(e) => { e.target.style.borderColor = accent; e.target.style.color = accent }}
                onMouseLeave={(e) => { e.target.style.borderColor = cardBorder; e.target.style.color = textPri }}
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ ROLE SELECTION ═══════════ */}
      <section id="about" style={{ padding: `80px 0`, background: isDark ? colors.surface : `${colors.card}55` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: `0 ${spacing.lg}` }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger} style={{ textAlign: 'center', marginBottom: spacing.xxl }}>
            <motion.p variants={fadeUp} style={{ fontSize: fontSize.xs, fontWeight: 600, color: accent, textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: fonts.mono || fonts.body, marginBottom: spacing.sm }}>
              Choose Your Role
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} style={{ fontSize: fontSize.xxl, fontFamily: fonts.heading, fontWeight: 700, color: textPri, margin: 0 }}>
              Who Are You?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} style={{ marginTop: spacing.sm, color: textSec, fontSize: fontSize.base, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', fontFamily: fonts.body }}>
              Select your role to get a personalized experience tailored to your needs.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: spacing.lg }}>
            {ROLES.map((role, i) => {
              const Icon = role.icon
              return (
                <motion.div
                  key={role.title}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -6, scale: 1.02 }}
                  style={{ ...cardStyle, padding: spacing.xl, textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                >
                  {/* Accent top bar — matches dashboard card style */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, ${green})`, borderRadius: `${radius.lg} ${radius.lg} 0 0` }} />

                  <div style={{
                    width: 56, height: 56, borderRadius: radius.md, margin: `${spacing.md} auto ${spacing.md}`,
                    background: accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px',
                  }}>
                    {role.emoji}
                  </div>
                  <h3 style={{ fontSize: fontSize.xl, fontFamily: fonts.heading, fontWeight: 700, color: textPri, margin: `0 0 ${spacing.sm}` }}>
                    {role.title}
                  </h3>
                  <p style={{ fontSize: fontSize.sm, color: textSec, lineHeight: 1.6, fontFamily: fonts.body, margin: 0 }}>
                    {role.desc}
                  </p>
                  <div style={{ marginTop: spacing.md }}>
                    <span style={{ fontSize: fontSize.sm, fontWeight: 600, color: accent, fontFamily: fonts.body }}>
                      Continue →
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: `0 ${spacing.lg}` }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger} style={{ textAlign: 'center', marginBottom: spacing.xxl }}>
            <motion.span
              variants={fadeUp}
              style={{
                display: 'inline-block', padding: `6px ${spacing.md}`, borderRadius: radius.full,
                background: colors.greenGlow, color: green, fontSize: fontSize.xs, fontWeight: 600,
                letterSpacing: '1px', textTransform: 'uppercase', fontFamily: fonts.mono || fonts.body,
                marginBottom: spacing.md,
              }}
            >
              Features
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} style={{ fontSize: fontSize.xxl, fontFamily: fonts.heading, fontWeight: 700, color: textPri, margin: 0 }}>
              Why TrialMatch AI?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} style={{ marginTop: spacing.sm, color: textSec, fontSize: fontSize.base, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', fontFamily: fonts.body }}>
              We combine cutting-edge AI with healthcare expertise to make
              clinical trial discovery simple and transparent.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: spacing.lg }}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -4 }}
                  style={{ ...cardStyle, padding: spacing.lg, position: 'relative' }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: radius.md,
                    background: `linear-gradient(135deg, ${accent}, ${green})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: spacing.md, boxShadow: `0 4px 12px ${accentGlow}`,
                  }}>
                    <Icon style={{ width: 22, height: 22, color: '#fff' }} />
                  </div>
                  <h3 style={{ fontSize: fontSize.base, fontFamily: fonts.heading, fontWeight: 700, color: textPri, margin: `0 0 ${spacing.sm}` }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: fontSize.sm, color: textSec, lineHeight: 1.65, fontFamily: fonts.body, margin: 0 }}>
                    {f.desc}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ CTA BANNER ═══════════ */}
      <section style={{ padding: `${spacing.xxl} 0` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: `0 ${spacing.lg}` }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{
              position: 'relative', overflow: 'hidden',
              background: `linear-gradient(135deg, ${accent}, ${green})`,
              borderRadius: radius.xl, padding: '56px 40px', textAlign: 'center',
              boxShadow: `0 8px 40px ${accentGlow}`,
            }}
          >
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(40px)' }} />
            <div style={{ position: 'absolute', bottom: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', filter: 'blur(40px)' }} />

            <h2 style={{ position: 'relative', fontSize: fontSize.xxl, fontFamily: fonts.heading, fontWeight: 700, color: '#fff', margin: `0 0 ${spacing.md}` }}>
              Ready to find your trial?
            </h2>
            <p style={{ position: 'relative', color: 'rgba(255,255,255,0.85)', fontSize: fontSize.lg, maxWidth: 480, margin: `0 auto ${spacing.lg}`, fontFamily: fonts.body, lineHeight: 1.6 }}>
              Join thousands of patients already discovering personalized
              clinical trials through TrialMatch AI.
            </p>
            <button
              onClick={() => navigate('/patient/dashboard')}
              style={{
                position: 'relative', padding: `14px ${spacing.xl}`,
                borderRadius: radius.full, background: '#fff', color: accent,
                fontWeight: 700, fontSize: fontSize.base, fontFamily: fonts.body,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                transition: 'all 0.25s',
              }}
              onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)' }}
              onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)' }}
            >
              Get Started — It's Free
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer
        id="contact"
        style={{
          background: isDark ? colors.surface : '#0F172A',
          color: 'rgba(255,255,255,0.5)',
          padding: `${spacing.xxl} 0`,
          fontFamily: fonts.body,
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: `0 ${spacing.lg}` }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.xl }}>
            {/* Brand */}
            <div style={{ maxWidth: 280 }}>
              <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, textDecoration: 'none', marginBottom: spacing.md }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: radius.sm,
                  background: `linear-gradient(135deg, ${accent}, ${green})`,
                  color: '#fff', fontSize: fontSize.sm, fontWeight: 800, fontFamily: fonts.heading,
                }}>
                  C
                </span>
                <span style={{ fontSize: fontSize.lg, fontWeight: 700, color: '#fff', fontFamily: fonts.heading }}>
                  TrialMatch <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>AI</span>
                </span>
              </a>
              <p style={{ fontSize: fontSize.sm, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                AI-powered clinical trial matching for patients, doctors, and clinics.
              </p>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: spacing.xxl, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                <span style={{ fontSize: fontSize.xs, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: fonts.mono || fonts.body }}>Platform</span>
                {['About', 'Features', 'Contact'].map((l) => (
                  <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: fontSize.sm, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.target.style.color = '#fff')}
                    onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.4)')}
                  >{l}</a>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                <span style={{ fontSize: fontSize.xs, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: fonts.mono || fonts.body }}>Legal</span>
                {['Privacy Policy', 'Terms of Service', 'HIPAA Compliance'].map((l) => (
                  <a key={l} href="#" style={{ fontSize: fontSize.sm, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.target.style.color = '#fff')}
                    onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.4)')}
                  >{l}</a>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: spacing.xl, paddingTop: spacing.lg, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, fontSize: fontSize.xs, color: 'rgba(255,255,255,0.35)' }}>
            <p style={{ margin: 0 }}>&copy; 2026 TrialMatch AI. All rights reserved.</p>
            <p style={{ margin: 0 }}>Made with <span style={{ color: colors.red || '#EF4444' }}>♥</span> for better healthcare</p>
          </div>
        </div>
      </footer>

      {/* ═══════════ RESPONSIVE STYLES ═══════════ */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
          #home h1 { font-size: ${fontSize.xxl} !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-toggle { display: none !important; }
        }
      `}</style>
    </div>
  )
}
