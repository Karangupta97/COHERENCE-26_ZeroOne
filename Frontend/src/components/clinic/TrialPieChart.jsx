import { useEffect, useState } from 'react'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion } from 'framer-motion'
import {
    HiOutlineBeaker,
} from 'react-icons/hi2'

const SEGMENTS = [
    { label: 'Phase III', count: 2, color: null },
    { label: 'Phase II', count: 2, color: null },
    { label: 'Phase I', count: 1, color: '#F59E0B' },
    { label: 'Completed', count: 1, color: '#64748B' },
]

function DonutChart({ segments, size = 160, strokeWidth = 28, colors }) {
    const [anim, setAnim] = useState(0)
    const r = (size - strokeWidth) / 2
    const circ = 2 * Math.PI * r
    const total = segments.reduce((s, seg) => s + seg.count, 0)

    useEffect(() => { const t = setTimeout(() => setAnim(1), 200); return () => clearTimeout(t) }, [])

    let cumOffset = 0
    const arcs = segments.map((seg) => {
        const frac = seg.count / total
        const dash = frac * circ
        const gap = circ - dash
        const offset = -cumOffset
        cumOffset += dash
        return { ...seg, dash, gap, offset }
    })

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`${colors.border}`} strokeWidth={strokeWidth} />
                {arcs.map((arc, i) => {
                    const color = arc.color || (i === 0 ? colors.green : colors.accent)
                    return (
                        <circle
                            key={arc.label}
                            cx={size / 2} cy={size / 2} r={r} fill="none"
                            stroke={color} strokeWidth={strokeWidth}
                            strokeDasharray={`${anim * arc.dash} ${circ - anim * arc.dash}`}
                            strokeDashoffset={-arc.offset}
                            strokeLinecap="butt"
                            style={{ transition: 'stroke-dasharray 1.2s ease-out' }}
                        />
                    )
                })}
            </svg>
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
                <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    style={{ fontSize: '28px', fontWeight: 800, fontFamily: "'Open Sans', sans-serif", color: colors.textPrimary, lineHeight: 1 }}
                >
                    {total}
                </motion.span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: colors.textSecondary, marginTop: 2 }}>Total Trials</span>
            </div>
        </div>
    )
}

export default function TrialPieChart() {
    const { colors, fonts } = useTheme()

    const resolvedSegments = SEGMENTS.map((seg, i) => ({
        ...seg,
        color: seg.color || (i === 0 ? colors.green : i === 1 ? colors.accent : seg.color),
    }))

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: radius.lg,
                boxShadow: colors.shadow,
                padding: spacing.lg,
            }}
        >
            <h2 style={{ margin: `0 0 ${spacing.lg}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <HiOutlineBeaker style={{ width: 22, height: 22, color: colors.accent }} />
                Trial Phase Distribution
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xl }}>
                <DonutChart segments={resolvedSegments} colors={colors} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    {resolvedSegments.map((seg, i) => (
                        <motion.div
                            key={seg.label}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}
                        >
                            <div style={{ width: 12, height: 12, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>{seg.label}</span>
                                    <span style={{ fontSize: fontSize.sm, fontWeight: 800, fontFamily: "'Open Sans', sans-serif", color: seg.color }}>{seg.count}</span>
                                </div>
                                <span style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>
                                    {Math.round((seg.count / resolvedSegments.reduce((s, x) => s + x.count, 0)) * 100)}% of total
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
