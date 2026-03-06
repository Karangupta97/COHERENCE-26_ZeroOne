import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../theme'
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
    HiOutlineMapPin,
    HiOutlineBellAlert,
    HiOutlineClipboardDocumentList,
    HiOutlineLightBulb,
    HiOutlineExclamationTriangle,
    HiOutlineArrowTrendingUp,
    HiOutlineHandRaised,
    HiOutlineArrowRight,
    HiOutlineCalendarDays,
    HiOutlineClock,
    HiOutlineSun,
    HiOutlineMoon,
} from 'react-icons/hi2'

import DoctorPerformanceScore from '../../components/doctor/DoctorPerformanceScore'
import PatientPipeline from '../../components/doctor/PatientPipeline'
import ActiveTrialsTable from '../../components/doctor/ActiveTrialsTable'
import useDoctor from '../../hooks/useDoctor'

const STATS = [
    { label: 'Active Trials', value: 5, icon: HiOutlineBeaker, change: '+12%', positive: true, path: '/doctor/trials', desc: 'Currently recruiting' },
    { label: 'Total Matches', value: 12, icon: HiOutlineLink, change: '+23%', positive: true, path: '/doctor/patients', desc: 'AI-matched patients' },
    { label: 'Approved', value: 7, icon: HiOutlineCheckCircle, change: '+8%', positive: true, path: '/doctor/patients', desc: 'Doctor approved' },
    { label: 'Enrolled', value: 2, icon: HiOutlineUserGroup, change: '+5%', positive: true, path: '/doctor/patients', desc: 'In active trials' },
]

const ACTIVITY = [
    { icon: HiOutlineDocumentText, iconType: 'green', title: 'New trial posted', desc: 'GLYCO-ADVANCE Phase III', time: '10 min ago' },
    { icon: HiOutlineSparkles, iconType: 'accent', title: 'Patient matched', desc: 'ANON-7F3A2B1C matched with 94% score', time: '25 min ago' },
    { icon: HiOutlineCheckCircle, iconType: 'green', title: 'Doctor approved', desc: 'ANON-4D8E9C2F approved for trial', time: '1 hr ago' },
    { icon: HiOutlineBuildingOffice2, iconType: 'accent', title: 'Screening completed', desc: 'ANON-1B5C8D3E passed screening', time: '2 hrs ago' },
]

const INSIGHTS = [
    { Icon: HiOutlineExclamationTriangle, title: 'High Drop-off Alert', desc: '64% drop-off between Matched → Approved. Consider reducing approval bottleneck.', type: 'warning', action: 'Review Now', path: '/doctor/patients' },
    { Icon: HiOutlineLightBulb, title: 'Expand Age Criteria', desc: 'Widening age range to 35-70 could increase GLYCO-ADVANCE matches by ~23%.', type: 'success', action: 'View Trials', path: '/doctor/trials' },
    { Icon: HiOutlineArrowTrendingUp, title: 'Strong Enrollment Trend', desc: 'CARDIO-PROTECT is on track to meet its target by Q2 2025.', type: 'info', action: 'View Details', path: '/doctor/trials' },
]

function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return { text: 'Good Morning', Icon: HiOutlineSun }
    if (h < 17) return { text: 'Good Afternoon', Icon: HiOutlineSun }
    return { text: 'Good Evening', Icon: HiOutlineMoon }
}

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }
const stagger = { animate: { transition: { staggerChildren: 0.06 } } }

export default function DoctorDashboard() {
    const { colors, fonts } = useTheme()
    const navigate = useNavigate()
    const { fullName } = useDoctor()
    const greet = getGreeting()
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

    const card = {
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        boxShadow: colors.shadow,
    }

    return (
        <DoctorLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: 1400 }}>

                {/* ── Welcome Banner ── */}
                <motion.div {...fadeUp} transition={{ duration: 0.5 }}
                    style={{
                        background: `linear-gradient(135deg, ${colors.accent}, ${colors.green || colors.accent}CC)`,
                        borderRadius: '20px',
                        padding: '28px 36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        position: 'relative', overflow: 'hidden', minHeight: 140,
                    }}
                >
                    {/* Decorative circles */}
                    <div style={{ position: 'absolute', top: -60, right: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                    <div style={{ position: 'absolute', bottom: -40, right: 120, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                    <div style={{ position: 'absolute', top: 20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontFamily: fonts.body, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                                {(() => { const GIcon = greet.Icon; return <GIcon style={{ width: 16, height: 16 }} /> })()} {greet.text}
                            </span>
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: fonts.body }}>·</span>
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontFamily: fonts.body, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <HiOutlineCalendarDays style={{ width: 13, height: 13 }} /> {today}
                            </span>
                        </div>
                        <h2 style={{ margin: 0, fontSize: '28px', fontFamily: fonts.heading, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                            Welcome back, {fullName}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontFamily: fonts.body, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <HiOutlineMapPin style={{ width: 13, height: 13 }} /> Mumbai, Maharashtra
                            </span>
                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontFamily: fonts.body, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <HiOutlineUserGroup style={{ width: 13, height: 13 }} /> {PATIENTS.length} Patients
                            </span>
                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontFamily: fonts.body, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <HiOutlineBeaker style={{ width: 13, height: 13 }} /> {TRIALS.length} Active Trials
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexShrink: 0, position: 'relative', zIndex: 1 }}>
                        <button onClick={() => navigate('/doctor/patients')} style={{
                            padding: '11px 22px', borderRadius: '10px',
                            background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                            color: '#fff', border: '1px solid rgba(255,255,255,0.25)',
                            fontSize: '13px', fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        >
                            <HiOutlineUserGroup style={{ width: 15, height: 15 }} /> View Patients
                        </button>
                        <button onClick={() => navigate('/doctor/alerts')} style={{
                            padding: '11px 22px', borderRadius: '10px',
                            background: '#fff', color: colors.accent,
                            border: 'none',
                            fontSize: '13px', fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <HiOutlineBellAlert style={{ width: 15, height: 15 }} /> View Alerts
                        </button>
                    </div>
                </motion.div>

                {/* ── Stat Cards ── */}
                <motion.div {...stagger} initial="initial" animate="animate"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}
                >
                    {STATS.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={stat.label}
                                variants={fadeUp}
                                transition={{ duration: 0.4 }}
                                onClick={() => navigate(stat.path)}
                                style={{
                                    ...card,
                                    padding: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s ease',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = colors.accent
                                    e.currentTarget.style.transform = 'translateY(-3px)'
                                    e.currentTarget.style.boxShadow = `0 8px 30px ${colors.accent}15`
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = colors.border
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = colors.shadow
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: '12px',
                                        background: colors.accentGlow,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Icon style={{ width: 22, height: 22, color: colors.accent }} />
                                    </div>
                                    <span style={{
                                        fontSize: '11px', fontWeight: 600,
                                        color: colors.green,
                                        background: colors.greenGlow,
                                        padding: '3px 10px', borderRadius: '20px',
                                        fontFamily: fonts.mono || fonts.body,
                                    }}>
                                        {stat.change}
                                    </span>
                                </div>
                                <div style={{ fontSize: '34px', fontWeight: 800, fontFamily: fonts.heading, color: colors.textPrimary, lineHeight: 1 }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary, marginTop: 6, fontFamily: fonts.body }}>
                                    {stat.label}
                                </div>
                                <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: 2, fontFamily: fonts.body }}>
                                    {stat.desc}
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* ── Performance Score + Patient Pipeline ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <DoctorPerformanceScore />
                    <PatientPipeline />
                </div>

                {/* ── Active Trials Table ── */}
                <ActiveTrialsTable />

                {/* ── Recent Activity + AI Insights ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

                    {/* Recent Activity */}
                    <motion.div {...fadeUp} transition={{ delay: 0.1 }} style={{ ...card, padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: '10px',
                                    background: colors.accentGlow,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <HiOutlineClock style={{ width: 18, height: 18, color: colors.accent }} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '16px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                                    Recent Activity
                                </h3>
                            </div>
                            <button onClick={() => navigate('/doctor/alerts')} style={{
                                padding: '6px 14px', borderRadius: '8px',
                                background: colors.accentGlow, color: colors.accent,
                                border: 'none', fontSize: '12px', fontWeight: 600,
                                fontFamily: fonts.body, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = `${colors.accent}25`}
                                onMouseLeave={e => e.currentTarget.style.background = colors.accentGlow}
                            >
                                View All <HiOutlineArrowRight style={{ width: 12, height: 12 }} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {ACTIVITY.map((act, i) => {
                                const Icon = act.icon
                                const color = act.iconType === 'green' ? colors.green : colors.accent
                                const glow = act.iconType === 'green' ? colors.greenGlow : colors.accentGlow
                                return (
                                    <motion.div key={i}
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + i * 0.06 }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 14,
                                            padding: '14px 10px',
                                            borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${colors.border}` : 'none',
                                            borderRadius: '8px', transition: 'background 0.15s', cursor: 'default',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = colors.card}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div style={{
                                            width: 38, height: 38, borderRadius: '10px', flexShrink: 0,
                                            background: glow,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <Icon style={{ width: 17, height: 17, color }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>{act.title}</div>
                                            <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: 2, fontFamily: fonts.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.desc}</div>
                                        </div>
                                        <span style={{ fontSize: '11px', color: colors.textSecondary, flexShrink: 0, fontFamily: fonts.body, opacity: 0.7 }}>{act.time}</span>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>

                    {/* AI Insights */}
                    <motion.div {...fadeUp} transition={{ delay: 0.15 }} style={{ ...card, padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '20px' }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '10px',
                                background: colors.accentGlow,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <HiOutlineSparkles style={{ width: 18, height: 18, color: colors.accent }} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '16px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                                    AI Insights
                                </h3>
                                <span style={{ fontSize: '11px', color: colors.textSecondary, fontFamily: fonts.body }}>Powered by TrialMatch AI</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {INSIGHTS.map((ins, i) => {
                                const colorMap = { warning: colors.yellow || '#F59E0B', success: colors.green, info: colors.accent }
                                const bgMap = { warning: `${colors.yellow || '#F59E0B'}12`, success: colors.greenGlow, info: colors.accentGlow }
                                const accentColor = colorMap[ins.type] || colors.accent
                                const bgColor = bgMap[ins.type] || colors.accentGlow
                                const InsIcon = ins.Icon
                                return (
                                    <motion.div key={i}
                                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 + i * 0.08 }}
                                        style={{
                                            background: bgColor,
                                            borderRadius: '12px',
                                            padding: '16px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            borderLeft: `3px solid ${accentColor}`,
                                        }}
                                        onClick={() => navigate(ins.path)}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                            <InsIcon style={{ width: 15, height: 15, color: accentColor }} />
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>{ins.title}</span>
                                        </div>
                                        <p style={{ margin: '0 0 10px', fontSize: '12px', color: colors.textSecondary, lineHeight: 1.6, fontFamily: fonts.body }}>{ins.desc}</p>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: accentColor, fontFamily: fonts.body, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            {ins.action} <HiOutlineArrowRight style={{ width: 12, height: 12 }} />
                                        </span>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                </div>

            </div>
        </DoctorLayout>
    )
}
