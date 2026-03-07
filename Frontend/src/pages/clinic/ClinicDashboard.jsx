// ============================================================
//  ClinicDashboard — Professional ApexCharts Dashboard
// ============================================================

import { useTheme, radius, spacing, fontSize } from '../../theme'
import { motion } from 'framer-motion'
import {
    HiOutlineBeaker,
    HiOutlineLink,
    HiOutlineCheckCircle,
    HiOutlineUserGroup,
    HiOutlineDocumentText,
    HiOutlineSparkles,
    HiOutlineBuildingOffice2,
    HiOutlineMapPin,
    HiOutlineUserCircle,
    HiOutlinePencilSquare,
    HiOutlineClipboardDocumentList,
    HiOutlineLightBulb,
    HiOutlineExclamationTriangle,
    HiOutlineArrowTrendingUp,
    HiOutlineChartBar,
} from 'react-icons/hi2'

import EnrollmentScore from '../../components/clinic/EnrollmentScore'
import TrialPipeline from '../../components/clinic/TrialPipeline'
import TrialPieChart from '../../components/clinic/TrialPieChart'
import MonthlyEnrollmentChart from '../../components/clinic/MonthlyEnrollmentChart'
import CandidateBreakdown from '../../components/clinic/CandidateBreakdown'
import WeeklyTrendsChart from '../../components/clinic/WeeklyTrendsChart'
import { CLINIC, CLINIC_TRIALS, CANDIDATES, RECENT_ACTIVITY, AI_INSIGHTS } from './data/mockData'
import useClinic from '../../hooks/useClinic'

// ── Stats ───────────────────────────────────────────────
const getStats = (candidates, trials) => {
    const totalMatches = candidates.length
    const doctorApproved = candidates.filter(c => c.doctorStatus === 'Approved').length
    const enrolled = candidates.filter(c => c.stage === 'Enrolled').length
    const activeTrials = trials.filter(t => t.status !== 'Completed').length
    return [
        { label: 'ACTIVE TRIALS', value: activeTrials, icon: HiOutlineBeaker, change: '↑ 12%' },
        { label: 'TOTAL MATCHES', value: totalMatches, icon: HiOutlineLink, change: '↑ 23%' },
        { label: 'DOCTOR APPROVED', value: doctorApproved, icon: HiOutlineCheckCircle, change: '↑ 8%' },
        { label: 'ENROLLED PATIENTS', value: enrolled, icon: HiOutlineUserGroup, change: '↑ 5%' },
    ]
}

// ── Greeting ─────────────────────────────────────────────
const GREETING_ICONS = {
    morning: HiOutlineSparkles,
    afternoon: HiOutlineLightBulb,
    evening: HiOutlineSparkles,
}
function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return { text: 'Good Morning', Icon: GREETING_ICONS.morning }
    if (h < 17) return { text: 'Good Afternoon', Icon: GREETING_ICONS.afternoon }
    return { text: 'Good Evening', Icon: GREETING_ICONS.evening }
}

// ── AI Insight icon map ──────────────────────────────────
const INSIGHT_ICONS = {
    warning: HiOutlineExclamationTriangle,
    success: HiOutlineArrowTrendingUp,
    info: HiOutlineLightBulb,
}

// ── Active Trials Table ──────────────────────────────────
function TrialsTable({ trials, colors, fonts }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.lg, boxShadow: colors.shadow, padding: spacing.lg }}>
            <h2 style={{ margin: `0 0 ${spacing.lg}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <div style={{ width: 36, height: 36, borderRadius: radius.md, background: colors.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HiOutlineBeaker style={{ width: 20, height: 20, color: colors.accent }} />
                </div>
                Active Trials Overview
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 110px 1fr', gap: spacing.md, padding: `${spacing.sm} ${spacing.md}`, marginBottom: spacing.sm, borderRadius: radius.sm, background: `${colors.accent}06` }}>
                {['Trial', 'Phase', 'Status', 'Enrollment'].map(h => (
                    <span key={h} style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: fonts.mono || fonts.body }}>{h}</span>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {trials.filter(t => t.status !== 'Completed').map((trial, i) => {
                    const pct = Math.round((trial.enrolled / trial.target) * 100)
                    const barColor = pct >= 80 ? colors.green : pct >= 50 ? colors.accent : (colors.yellow || '#F59E0B')
                    return (
                        <motion.div key={trial.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                            style={{
                                display: 'grid', gridTemplateColumns: '2fr 100px 110px 1fr', gap: spacing.md, alignItems: 'center',
                                padding: `${spacing.md} ${spacing.md}`, borderBottom: i < trials.length - 2 ? `1px solid ${colors.border}40` : 'none',
                                borderRadius: radius.sm, transition: 'background 0.15s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = colors.card }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                        >
                            <div>
                                <div style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>{trial.name}</div>
                                <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2, fontFamily: fonts.body }}>{trial.id} · {trial.location}</div>
                            </div>
                            <span style={{ fontSize: fontSize.xs, fontWeight: 600, padding: '4px 12px', borderRadius: radius.full, background: colors.accentGlow, color: colors.accent, textAlign: 'center' }}>{trial.phase}</span>
                            <span style={{ fontSize: fontSize.xs, fontWeight: 600, padding: '4px 12px', borderRadius: radius.full, background: trial.status === 'Recruiting' ? colors.greenGlow : colors.accentGlow, color: trial.status === 'Recruiting' ? colors.green : colors.accent, textAlign: 'center' }}>{trial.status}</span>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                                    <div style={{ flex: 1, height: 7, borderRadius: 4, background: colors.border, overflow: 'hidden' }}>
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3 }} style={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${barColor}, ${barColor}CC)` }} />
                                    </div>
                                    <span style={{ fontSize: fontSize.xs, fontWeight: 700, color: barColor, fontFamily: fonts.mono || fonts.body, minWidth: 32, textAlign: 'right' }}>{pct}%</span>
                                </div>
                                <div style={{ fontSize: '10px', color: colors.textSecondary, marginTop: 3, fontFamily: fonts.mono || fonts.body }}>{trial.enrolled} / {trial.target} enrolled</div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </motion.div>
    )
}

export default function ClinicDashboard({ setPage }) {
    const { colors, fonts } = useTheme()
    const { clinicName, location: clinicLocation } = useClinic()
    const greet = getGreeting()
    const GreetIcon = greet.Icon
    const stats = getStats(CANDIDATES, CLINIC_TRIALS)
    const activeTrials = CLINIC_TRIALS.filter(t => t.status !== 'Completed').length

    // Map activity icons
    const ACTIVITY_ICONS = [HiOutlineDocumentText, HiOutlineSparkles, HiOutlineCheckCircle, HiOutlineBuildingOffice2, HiOutlineDocumentText]
    const ACTIVITY_TYPES = ['green', 'accent', 'green', 'accent', 'green']

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>

            {/* ── Welcome Banner ── */}
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                style={{
                    background: `linear-gradient(135deg, ${colors.accent}18, ${colors.green}18)`,
                    border: `1px solid ${colors.accent}30`, borderRadius: radius.lg,
                    padding: `${spacing.lg} ${spacing.xl}`,
                    display: 'flex', alignItems: 'center', gap: spacing.xl,
                    position: 'relative', overflow: 'hidden',
                }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: `${colors.accent}10` }} />
                <div style={{ position: 'absolute', bottom: -30, right: 80, width: 80, height: 80, borderRadius: '50%', background: `${colors.green}10` }} />

                <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 4, display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                        <GreetIcon style={{ width: 16, height: 16, color: colors.accent }} /> {greet.text}
                    </div>
                    <h2 style={{ margin: 0, fontSize: '22px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, lineHeight: 1.3, display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
                        Welcome back, <span style={{ color: colors.accent }}>{clinicName}</span>
                        <HiOutlineBuildingOffice2 style={{ width: 22, height: 22, color: colors.accent, flexShrink: 0 }} />
                    </h2>
                    <p style={{ margin: `${spacing.xs} 0 0`, fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.body, lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                        <HiOutlineMapPin style={{ width: 14, height: 14, flexShrink: 0 }} /> {clinicLocation || CLINIC.location}
                        <span style={{ margin: '0 4px' }}>·</span>
                        <HiOutlineUserCircle style={{ width: 14, height: 14, flexShrink: 0 }} /> {CLINIC.leadDoctor}
                        <span style={{ margin: '0 4px' }}>·</span>
                        <HiOutlineBeaker style={{ width: 14, height: 14, flexShrink: 0 }} /> {activeTrials} Active Trials
                    </p>
                </div>

                <div style={{ display: 'flex', gap: spacing.sm, flexShrink: 0, position: 'relative', zIndex: 1 }}>
                    <button onClick={() => setPage('post-trial')} style={{
                        padding: `10px ${spacing.lg}`, borderRadius: radius.sm,
                        background: colors.accent, color: '#fff', border: 'none',
                        fontSize: fontSize.sm, fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: spacing.xs,
                        boxShadow: `0 2px 12px ${colors.accent}40`,
                        transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 4px 20px ${colors.accent}50` }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 2px 12px ${colors.accent}40` }}
                    >
                        <HiOutlinePencilSquare style={{ width: 16, height: 16 }} /> Post Trial
                    </button>
                    <button onClick={() => setPage('candidates')} style={{
                        padding: `10px ${spacing.lg}`, borderRadius: radius.sm,
                        background: colors.surface, color: colors.textPrimary,
                        border: `1px solid ${colors.border}`,
                        fontSize: fontSize.sm, fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: spacing.xs,
                        transition: 'transform 0.15s, border-color 0.15s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.borderColor = colors.accent }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = colors.border }}
                    >
                        <HiOutlineUserGroup style={{ width: 16, height: 16 }} /> View Candidates
                    </button>
                </div>
            </motion.div>

            {/* ── Stat Cards ── */}
            <div>
                <div style={{ height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${colors.accent}, ${colors.green}, ${colors.accent}60)`, marginBottom: spacing.lg, opacity: 0.7 }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.md }}>
                    {stats.map((stat, i) => {
                        const Icon = stat.icon
                        return (
                            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }}
                                style={{
                                    background: colors.surface, border: `1px solid ${colors.border}`,
                                    borderRadius: radius.lg, padding: spacing.lg, boxShadow: colors.shadow,
                                    position: 'relative', overflow: 'hidden', cursor: 'default', transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.accent; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${colors.accent}15` }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = colors.shadow }}
                            >
                                <div style={{ position: 'absolute', top: -20, right: -20, width: 60, height: 60, borderRadius: '50%', background: `${colors.accent}06` }} />
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.md }}>
                                    <div style={{ width: 42, height: 42, borderRadius: radius.md, background: colors.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon style={{ width: 20, height: 20, color: colors.accent }} />
                                    </div>
                                    <span style={{ fontSize: fontSize.xs, fontWeight: 600, color: colors.green, background: colors.greenGlow, padding: '3px 10px', borderRadius: radius.full, fontFamily: fonts.mono || fonts.body }}>
                                        {stat.change}
                                    </span>
                                </div>
                                <div style={{ fontSize: '34px', fontWeight: 800, fontFamily: "'Satoshi', sans-serif", color: colors.textPrimary, lineHeight: 1 }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: fontSize.xs, fontWeight: 600, color: colors.textSecondary, letterSpacing: '1.2px', marginTop: spacing.xs, fontFamily: fonts.mono || fonts.body }}>
                                    {stat.label}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* ── Enrollment Score + Trial Pipeline ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
                <EnrollmentScore />
                <TrialPipeline />
            </div>

            {/* ── Monthly Enrollment Bar Chart (full width) ── */}
            <MonthlyEnrollmentChart />

            {/* ── Pie Chart + Candidate Breakdown ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
                <TrialPieChart />
                <CandidateBreakdown />
            </div>

            {/* ── Weekly Activity Trends (full width) ── */}
            <WeeklyTrendsChart />

            {/* ── Active Trials Table ── */}
            <TrialsTable trials={CLINIC_TRIALS} colors={colors} fonts={fonts} />

            {/* ── Recent Activity + AI Insights ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
                {/* Recent Activity */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.lg, boxShadow: colors.shadow, padding: spacing.lg }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
                        <h2 style={{ margin: 0, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                            <div style={{ width: 36, height: 36, borderRadius: radius.md, background: colors.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <HiOutlineClipboardDocumentList style={{ width: 20, height: 20, color: colors.accent }} />
                            </div>
                            Recent Activity
                        </h2>
                        <button onClick={() => setPage('notifications')} style={{ padding: `6px ${spacing.md}`, borderRadius: radius.sm, background: 'transparent', color: colors.accent, border: `1px solid ${colors.accent}30`, fontSize: fontSize.xs, fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer', transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = colors.accentGlow }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                        >
                            View All →
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {RECENT_ACTIVITY.map((act, i) => {
                            const Icon = ACTIVITY_ICONS[i % ACTIVITY_ICONS.length]
                            const iconType = ACTIVITY_TYPES[i % ACTIVITY_TYPES.length]
                            const color = iconType === 'green' ? colors.green : colors.accent
                            const glow = iconType === 'green' ? colors.greenGlow : colors.accentGlow
                            return (
                                <motion.div key={act.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}
                                    style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.md, padding: `${spacing.md} ${spacing.sm}`, borderBottom: i < RECENT_ACTIVITY.length - 1 ? `1px solid ${colors.border}40` : 'none', borderRadius: radius.sm, transition: 'background 0.15s' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = colors.card }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                                >
                                    <div style={{ width: 34, height: 34, borderRadius: radius.md, flexShrink: 0, background: glow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon style={{ width: 16, height: 16, color }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>{act.action}</div>
                                        <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2, fontFamily: fonts.body }}>{act.detail}</div>
                                    </div>
                                    <span style={{ fontSize: fontSize.xs, color: colors.textSecondary, flexShrink: 0, fontFamily: fonts.mono || fonts.body, whiteSpace: 'nowrap' }}>{act.time}</span>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>

                {/* AI Insights */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.lg, boxShadow: colors.shadow, padding: spacing.lg }}>
                    <h2 style={{ margin: `0 0 ${spacing.lg}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                        <div style={{ width: 36, height: 36, borderRadius: radius.md, background: colors.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <HiOutlineLightBulb style={{ width: 20, height: 20, color: colors.accent }} />
                        </div>
                        AI Insights
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                        {AI_INSIGHTS.map((ins, i) => {
                            const borderColor = ins.type === 'warning' ? (colors.yellow || '#F59E0B') : ins.type === 'success' ? colors.green : colors.accent
                            const bgColor = ins.type === 'success' ? colors.greenGlow : colors.accentGlow
                            const InsightIcon = ins.type === 'warning' ? INSIGHT_ICONS.warning : ins.type === 'success' ? INSIGHT_ICONS.success : INSIGHT_ICONS.info
                            return (
                                <motion.div key={ins.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.3 }}
                                    style={{ background: bgColor, borderLeft: `3px solid ${borderColor}`, borderRadius: radius.sm, padding: spacing.md, cursor: 'default', transition: 'all 0.2s' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)' }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: 4 }}>
                                        <InsightIcon style={{ width: 16, height: 16, color: borderColor }} />
                                        <span style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>{ins.title}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: fontSize.xs, color: colors.textSecondary, lineHeight: 1.5, fontFamily: fonts.body }}>{ins.message}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
