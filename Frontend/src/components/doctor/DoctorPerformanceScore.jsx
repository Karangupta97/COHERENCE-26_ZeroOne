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

function AnimatedCircle({ score, size = 130, strokeWidth = 10, colors }) {
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
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`${colors.border}`} strokeWidth={strokeWidth} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
                    strokeWidth={strokeWidth} strokeDasharray={circ} strokeDashoffset={offset}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
                />
            </svg>
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
                <motion.span
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    style={{ fontSize: '32px', fontWeight: 800, fontFamily: "'Open Sans', sans-serif", color, lineHeight: 1 }}
                >
                    {anim}
                </motion.span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: colors.textSecondary, marginTop: 2 }}>out of 100</span>
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
            <div style={{ width: `${w}%`, height: '100%', borderRadius: 3, background: color, transition: 'width 1s ease-out' }} />
        </div>
    )
}

export default function DoctorPerformanceScore() {
    const { colors, fonts } = useTheme()
    const navigate = useNavigate()

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: radius.lg,
                boxShadow: colors.shadow,
                padding: spacing.lg,
            }}
        >
            <h2 style={{ margin: `0 0 ${spacing.lg}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <HiOutlineChartBar style={{ width: 22, height: 22, color: colors.accent }} />
                Doctor Performance Score
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xl }}>
                <AnimatedCircle score={SCORE_DATA.overall} colors={colors} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    {SCORE_DATA.categories.map((cat, i) => {
                        const CatIcon = cat.Icon
                        return (
                            <motion.div
                                key={cat.label}
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}
                            >
                                <div style={{ width: 28, height: 28, borderRadius: radius.sm, background: colors.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <CatIcon style={{ width: 15, height: 15, color: colors.accent }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>{cat.label}</span>
                                        <span style={{ fontSize: fontSize.xs, fontWeight: 700, color: cat.score >= 80 ? colors.green : colors.accent, fontFamily: fonts.mono || fonts.body }}>{cat.score}%</span>
                                    </div>
                                    <MiniBar score={cat.score} colors={colors} />
                                    <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: 3 }}>{cat.tip}</div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            <div style={{ marginTop: spacing.lg, display: 'flex', gap: spacing.sm }}>
                <button
                    onClick={() => navigate('/doctor/patients')}
                    style={{
                        padding: `8px ${spacing.lg}`, borderRadius: radius.sm,
                        background: colors.accent, color: '#fff', border: 'none',
                        fontSize: fontSize.xs, fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: spacing.xs,
                    }}
                >
                    <HiOutlineUserGroup style={{ width: 14, height: 14 }} /> Review Patients
                </button>
                <button
                    onClick={() => navigate('/doctor/trials')}
                    style={{
                        padding: `8px ${spacing.lg}`, borderRadius: radius.sm,
                        background: colors.accentGlow, color: colors.accent,
                        border: `1px solid ${colors.accent}40`,
                        fontSize: fontSize.xs, fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: spacing.xs,
                    }}
                >
                    <HiOutlineBeaker style={{ width: 14, height: 14 }} /> View Trials
                </button>
            </div>
        </motion.div>
    )
}
