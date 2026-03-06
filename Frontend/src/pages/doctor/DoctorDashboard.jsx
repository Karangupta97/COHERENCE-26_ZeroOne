import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme, radius, spacing, fontSize } from '../../theme'
import DoctorLayout from '../../components/shared/DoctorLayout'
import { PATIENTS, TRIALS } from './data/mockData'
import { motion } from 'framer-motion'
import {
    HiOutlineBeaker,
    HiOutlineLink,
    HiOutlineCheckCircle,
    HiOutlineUserGroup,
    HiOutlineDocumentText,
    HiOutlineSparkles,
    HiOutlineBuildingOffice2,
} from 'react-icons/hi2'

// ── Stats ───────────────────────────────────────────────
const STATS = [
    { label: 'ACTIVE TRIALS', value: 5, icon: HiOutlineBeaker, change: '↑ 12%', path: '/doctor/trials' },
    { label: 'TOTAL MATCHES', value: 12, icon: HiOutlineLink, change: '↑ 23%', path: '/doctor/patients' },
    { label: 'DOCTOR APPROVED', value: 7, icon: HiOutlineCheckCircle, change: '↑ 8%', path: '/doctor/patients' },
    { label: 'ENROLLED PATIENTS', value: 2, icon: HiOutlineUserGroup, change: '↑ 5%', path: '/doctor/patients' },
]

// ── Recent Activity ─────────────────────────────────────
const ACTIVITY = [
    { icon: HiOutlineDocumentText, iconType: 'green', title: 'New trial posted', desc: 'GLYCO-ADVANCE Phase III', time: '10 min ago' },
    { icon: HiOutlineSparkles, iconType: 'accent', title: 'Patient matched', desc: 'PT-0041 matched with 94% score', time: '25 min ago' },
    { icon: HiOutlineCheckCircle, iconType: 'green', title: 'Doctor approved', desc: 'Dr. Sharma approved PT-0039', time: '1 hr ago' },
    { icon: HiOutlineBuildingOffice2, iconType: 'accent', title: 'Screening completed', desc: 'PT-0037 passed screening', time: '2 hrs ago' },
]

// ── AI Insights ─────────────────────────────────────────
const INSIGHTS = [
    { emoji: '⚠️', title: 'High Drop-off Alert', desc: '64% drop-off between Matched → Doctor Approved. Consider reducing approval bottleneck.', type: 'accent', action: 'View Patients →', path: '/doctor/patients' },
    { emoji: '💡', title: 'Expand Age Criteria', desc: 'Widening age range to 35-70 could increase GLYCO-ADVANCE matches by ~23%.', type: 'green', action: 'View Trials →', path: '/doctor/trials' },
    { emoji: '📈', title: 'Strong Enrollment Trend', desc: 'CARDIO-PROTECT is on track to meet target by Q2 2025 at current pace.', type: 'accent', action: 'View Trials →', path: '/doctor/trials' },
]

// ── Greeting helper ─────────────────────────────────────
function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return { text: 'Good Morning', emoji: '🌅' }
    if (h < 17) return { text: 'Good Afternoon', emoji: '☀️' }
    return { text: 'Good Evening', emoji: '🌙' }
}

export default function DoctorDashboard() {
    const { colors, fonts } = useTheme()
    const navigate = useNavigate()
    const greet = getGreeting()

    return (
        <DoctorLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>

                {/* ── Welcome Banner ── */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: `linear-gradient(135deg, ${colors.accent}18, ${colors.green}18)`,
                        border: `1px solid ${colors.accent}30`,
                        borderRadius: radius.lg,
                        padding: `${spacing.lg} ${spacing.xl}`,
                        display: 'flex', alignItems: 'center', gap: spacing.xl,
                        position: 'relative', overflow: 'hidden',
                    }}
                >
                    {/* Decorative circles */}
                    <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: `${colors.accent}10` }} />
                    <div style={{ position: 'absolute', bottom: -30, right: 80, width: 80, height: 80, borderRadius: '50%', background: `${colors.green}10` }} />

                    <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 4, display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                            {greet.emoji} {greet.text}
                        </div>
                        <h2 style={{ margin: 0, fontSize: '22px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, lineHeight: 1.3 }}>
                            Welcome back, <span style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.green})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dr. Priya Sharma</span> 👋
                        </h2>
                        <p style={{ margin: `${spacing.xs} 0 0`, fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.body, lineHeight: 1.5 }}>
                            📍 Mumbai, Maharashtra &nbsp;·&nbsp; 👥 {PATIENTS.length} Patients &nbsp;·&nbsp; 🔬 {TRIALS.length} Active Trials
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: spacing.sm, flexShrink: 0, position: 'relative', zIndex: 1 }}>
                        <button
                            onClick={() => navigate('/doctor/patients')}
                            style={{
                                padding: `10px ${spacing.lg}`, borderRadius: radius.sm,
                                background: colors.accent, color: '#fff', border: 'none',
                                fontSize: fontSize.sm, fontWeight: 600, fontFamily: fonts.body,
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}
                        >
                            👥 View Patients
                        </button>
                        <button
                            onClick={() => navigate('/doctor/alerts')}
                            style={{
                                padding: `10px ${spacing.lg}`, borderRadius: radius.sm,
                                background: colors.surface, color: colors.textPrimary,
                                border: `1px solid ${colors.border}`,
                                fontSize: fontSize.sm, fontWeight: 600, fontFamily: fonts.body,
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}
                        >
                            🔔 View Alerts
                        </button>
                    </div>
                </motion.div>

                {/* ── Gradient accent bar + Stat Cards ── */}
                <div>
                    <div style={{
                        height: 4, borderRadius: 2,
                        background: `linear-gradient(90deg, ${colors.accent}, ${colors.green})`,
                        marginBottom: spacing.lg,
                    }} />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.md }}>
                        {STATS.map((stat, i) => {
                            const Icon = stat.icon
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                    onClick={() => navigate(stat.path)}
                                    style={{
                                        background: colors.surface,
                                        border: `1px solid ${colors.border}`,
                                        borderRadius: radius.lg,
                                        padding: spacing.lg,
                                        boxShadow: colors.shadow,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.accent; e.currentTarget.style.transform = 'translateY(-2px)' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.transform = 'translateY(0)' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.md }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: radius.md,
                                            background: colors.accentGlow,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <Icon style={{ width: 20, height: 20, color: colors.accent }} />
                                        </div>
                                        <span style={{
                                            fontSize: fontSize.xs, fontWeight: 600, color: colors.green,
                                            background: colors.greenGlow, padding: '2px 8px',
                                            borderRadius: radius.full, fontFamily: fonts.mono || fonts.body,
                                        }}>
                                            {stat.change}
                                        </span>
                                    </div>

                                    <div style={{ fontSize: fontSize.hero || '36px', fontWeight: 800, fontFamily: "'Open Sans', sans-serif", color: colors.textPrimary, lineHeight: 1 }}>
                                        {stat.value}
                                    </div>
                                    <div style={{
                                        fontSize: fontSize.xs, fontWeight: 600, color: colors.textSecondary,
                                        letterSpacing: '1.5px', marginTop: spacing.xs,
                                        fontFamily: fonts.mono || fonts.body,
                                    }}>
                                        {stat.label}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* ── Recent Activity + AI Insights ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>

                    {/* Recent Activity */}
                    <div style={{
                        background: colors.surface, border: `1px solid ${colors.border}`,
                        borderRadius: radius.lg, boxShadow: colors.shadow, padding: spacing.lg,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
                            <h2 style={{ margin: 0, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                                📋 Recent Activity
                            </h2>
                            <button
                                onClick={() => navigate('/doctor/alerts')}
                                style={{
                                    padding: `4px ${spacing.sm}`, borderRadius: radius.sm,
                                    background: 'transparent', color: colors.accent,
                                    border: 'none', fontSize: fontSize.xs, fontWeight: 600,
                                    fontFamily: fonts.body, cursor: 'pointer',
                                }}
                            >
                                View All →
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {ACTIVITY.map((act, i) => {
                                const Icon = act.icon
                                const color = act.iconType === 'green' ? colors.green : colors.accent
                                const glow = act.iconType === 'green' ? colors.greenGlow : colors.accentGlow
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.06, duration: 0.3 }}
                                        style={{
                                            display: 'flex', alignItems: 'flex-start', gap: spacing.md,
                                            padding: `${spacing.md} ${spacing.sm}`,
                                            borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${colors.border}` : 'none',
                                            borderRadius: radius.sm, transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = colors.card }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                                    >
                                        <div style={{
                                            width: 34, height: 34, borderRadius: radius.md, flexShrink: 0,
                                            background: glow, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <Icon style={{ width: 16, height: 16, color }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>{act.title}</div>
                                            <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2, fontFamily: fonts.body }}>{act.desc}</div>
                                        </div>
                                        <span style={{ fontSize: fontSize.xs, color: colors.textSecondary, flexShrink: 0, fontFamily: fonts.mono || fonts.body, whiteSpace: 'nowrap' }}>
                                            {act.time}
                                        </span>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>

                    {/* AI Insights */}
                    <div style={{
                        background: colors.surface, border: `1px solid ${colors.border}`,
                        borderRadius: radius.lg, boxShadow: colors.shadow, padding: spacing.lg,
                    }}>
                        <h2 style={{ margin: `0 0 ${spacing.lg}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                            🧠 AI Insights
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                            {INSIGHTS.map((ins, i) => {
                                const borderColor = ins.type === 'green' ? colors.green : colors.accent
                                const bgColor = ins.type === 'green' ? colors.greenGlow : colors.accentGlow
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.08, duration: 0.3 }}
                                        style={{
                                            background: bgColor,
                                            borderLeft: `3px solid ${borderColor}`,
                                            borderRadius: radius.sm,
                                            padding: spacing.md,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                        onClick={() => navigate(ins.path)}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)' }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: 4 }}>
                                            <span style={{ fontSize: '16px' }}>{ins.emoji}</span>
                                            <span style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>
                                                {ins.title}
                                            </span>
                                        </div>
                                        <p style={{ margin: `0 0 ${spacing.sm}`, fontSize: fontSize.xs, color: colors.textSecondary, lineHeight: 1.5, fontFamily: fonts.body }}>
                                            {ins.desc}
                                        </p>
                                        <span style={{ fontSize: fontSize.xs, fontWeight: 600, color: borderColor, fontFamily: fonts.body }}>
                                            {ins.action}
                                        </span>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    )
}
