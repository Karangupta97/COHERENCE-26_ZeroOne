import { useEffect, useState } from 'react'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion } from 'framer-motion'
import {
    HiOutlineUserGroup,
    HiOutlineCpuChip,
    HiOutlineCheckCircle,
    HiOutlineMagnifyingGlass,
    HiOutlineCursorArrowRays,
    HiOutlineXCircle,
} from 'react-icons/hi2'

const STAGES = [
    { label: 'AI Matched', count: 12, Icon: HiOutlineCpuChip, colorType: 'accent' },
    { label: 'Doctor Approved', count: 7, Icon: HiOutlineCheckCircle, colorType: 'green' },
    { label: 'Screening', count: 5, Icon: HiOutlineMagnifyingGlass, colorType: 'accent' },
    { label: 'Enrolled', count: 2, Icon: HiOutlineCursorArrowRays, colorType: 'green' },
    { label: 'Dropped Out', count: 3, Icon: HiOutlineXCircle, colorType: 'red' },
]

export default function CandidateBreakdown() {
    const { colors, fonts } = useTheme()
    const [anim, setAnim] = useState(false)
    const maxCount = Math.max(...STAGES.map(s => s.count))

    useEffect(() => { const t = setTimeout(() => setAnim(true), 300); return () => clearTimeout(t) }, [])

    const getColor = (colorType) => {
        if (colorType === 'red') return colors.red || '#EF4444'
        if (colorType === 'green') return colors.green
        return colors.accent
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: radius.lg,
                boxShadow: colors.shadow,
                padding: spacing.lg,
            }}
        >
            <h2 style={{ margin: `0 0 ${spacing.lg}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <HiOutlineUserGroup style={{ width: 22, height: 22, color: colors.accent }} />
                Candidate Stage Breakdown
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {STAGES.map((stage, i) => {
                    const color = getColor(stage.colorType)
                    const pct = Math.round((stage.count / maxCount) * 100)
                    const StageIcon = stage.Icon
                    return (
                        <motion.div
                            key={stage.label}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.08 }}
                            style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}
                        >
                            <div style={{
                                width: 28, height: 28, borderRadius: radius.sm, flexShrink: 0,
                                background: stage.colorType === 'red' ? `${color}20` : stage.colorType === 'green' ? colors.greenGlow : colors.accentGlow,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <StageIcon style={{ width: 15, height: 15, color }} />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>
                                        {stage.label}
                                    </span>
                                    <span style={{ fontSize: fontSize.sm, fontWeight: 800, fontFamily: "'Open Sans', sans-serif", color }}>
                                        {stage.count}
                                    </span>
                                </div>

                                <div style={{ height: 10, borderRadius: 5, background: `${colors.border}`, overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: anim ? `${pct}%` : 0 }}
                                        transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                                        style={{
                                            height: '100%',
                                            borderRadius: 5,
                                            background: `linear-gradient(90deg, ${color}, ${color}B0)`,
                                        }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Summary row */}
            <div style={{
                marginTop: spacing.lg,
                padding: spacing.md,
                borderRadius: radius.md,
                background: `${colors.accent}08`,
                border: `1px solid ${colors.accent}20`,
                display: 'flex',
                justifyContent: 'space-around',
            }}>
                {[
                    { label: 'Conversion Rate', value: '58%', color: colors.green },
                    { label: 'Drop-off Rate', value: '25%', color: colors.red || '#EF4444' },
                    { label: 'Avg. Days to Enroll', value: '14', color: colors.accent },
                ].map((stat) => (
                    <div key={stat.label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: "'Open Sans', sans-serif", color: stat.color, lineHeight: 1 }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 4, fontFamily: fonts.body }}>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}
