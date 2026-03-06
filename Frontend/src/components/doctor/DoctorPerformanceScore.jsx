import { useEffect, useState } from 'react'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    HiOutlineChartBar,
    HiOutlineBolt,
    HiOutlineLink,
    HiOutlineCursorArrowRays,
    HiOutlineBeaker,
    HiOutlineUserGroup,
    HiOutlineArrowRight,
} from 'react-icons/hi2'

const SCORE_DATA = {
    overall: 78,
    categories: [
        { label: 'Approval Speed', score: 85, Icon: HiOutlineBolt, tip: 'Avg 1.2 days to review' },
        { label: 'Match Conversion', score: 72, Icon: HiOutlineLink, tip: '7 of 12 matches approved' },
        { label: 'Enrollment Rate', score: 68, Icon: HiOutlineCursorArrowRays, tip: '2 of 7 approved enrolled' },
        { label: 'Trial Coverage', score: 90, Icon: HiOutlineBeaker, tip: 'Active in 5 trial domains' },
    ]
}

function AnimatedCircle({ score, size = 140, strokeWidth = 10, colors, fonts }) {
    const [anim, setAnim] = useState(0)
    const r = (size - strokeWidth) / 2
    const circ = 2 * Math.PI * r
    const offset = circ - (anim / 100) * circ
    const color = anim >= 80 ? colors.green : anim >= 60 ? colors.accent : (colors.yellow || '#F59E0B')

    useEffect(() => {
        const t = setTimeout(() => setAnim(score), 300)
        return () => clearTimeout(t)
    }, [score])

    return (
        <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`${colors.border}`} strokeWidth={strokeWidth} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
                    strokeWidth={strokeWidth} strokeDasharray={circ} strokeDashoffset={offset}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.2s ease-out', filter: `drop-shadow(0 0 6px ${color}40)` }}
                />
            </svg>
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
                <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    style={{ fontSize: '36px', fontWeight: 800, fontFamily: fonts.heading, color, lineHeight: 1 }}
                >
                    {anim}
                </motion.span>
                <span style={{ fontSize: '11px', fontWeight: 500, color: colors.textSecondary, marginTop: 4, fontFamily: fonts.body }}>out of 100</span>
            </div>
        </div>
    )
}

function MiniBar({ score, colors }) {
    const [w, setW] = useState(0)
    const color = score >= 80 ? colors.green : score >= 60 ? colors.accent : (colors.yellow || '#F59E0B')
    useEffect(() => { setTimeout(() => setW(score), 200) }, [score])
    return (
        <div style={{ flex: 1, height: 6, borderRadius: 3, background: `${colors.border}` }}>
            <div style={{
                width: `${w}%`, height: '100%', borderRadius: 3,
                background: `linear-gradient(90deg, ${color}CC, ${color})`,
                transition: 'width 1s ease-out',
            }} />
        </div>
    )
}

export default function DoctorPerformanceScore() {
    const { colors, fonts } = useTheme()
    const navigate = useNavigate()

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: '16px',
                boxShadow: colors.shadow,
                padding: '24px',
                display: 'flex', flexDirection: 'column',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '22px' }}>
                <div style={{
                    width: 36, height: 36, borderRadius: '10px',
                    background: colors.accentGlow,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <HiOutlineChartBar style={{ width: 18, height: 18, color: colors.accent }} />
                </div>
                <h3 style={{ margin: 0, fontSize: '16px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                    Performance Score
                </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flex: 1 }}>
                <AnimatedCircle score={SCORE_DATA.overall} colors={colors} fonts={fonts} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {SCORE_DATA.categories.map((cat, i) => {
                        const CatIcon = cat.Icon
                        const scoreColor = cat.score >= 80 ? colors.green : cat.score >= 60 ? colors.accent : (colors.yellow || '#F59E0B')
                        return (
                            <motion.div
                                key={cat.label}
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                            >
                                <div style={{
                                    width: 30, height: 30, borderRadius: '8px',
                                    background: colors.card,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <CatIcon style={{ width: 14, height: 14, color: colors.accent }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>{cat.label}</span>
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: scoreColor, fontFamily: fonts.mono || fonts.body }}>{cat.score}%</span>
                                    </div>
                                    <MiniBar score={cat.score} colors={colors} />
                                    <div style={{ fontSize: '10px', color: colors.textSecondary, marginTop: 4, fontFamily: fonts.body }}>{cat.tip}</div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => navigate('/doctor/patients')}
                    style={{
                        padding: '9px 20px', borderRadius: '10px',
                        background: colors.accent, color: '#fff', border: 'none',
                        fontSize: '12px', fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    <HiOutlineUserGroup style={{ width: 14, height: 14 }} /> Review Patients
                </button>
                <button
                    onClick={() => navigate('/doctor/trials')}
                    style={{
                        padding: '9px 20px', borderRadius: '10px',
                        background: 'transparent', color: colors.accent,
                        border: `1px solid ${colors.border}`,
                        fontSize: '12px', fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = colors.accent; e.currentTarget.style.background = colors.accentGlow }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.background = 'transparent' }}
                >
                    <HiOutlineBeaker style={{ width: 14, height: 14 }} /> View Trials
                </button>
            </div>
        </motion.div>
    )
}
