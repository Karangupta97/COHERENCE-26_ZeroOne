import { useEffect, useState } from 'react'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion } from 'framer-motion'
import {
    HiOutlineArrowTrendingUp,
} from 'react-icons/hi2'

const MONTHS = [
    { month: 'Sep', enrolled: 4, matched: 8 },
    { month: 'Oct', enrolled: 6, matched: 11 },
    { month: 'Nov', enrolled: 3, matched: 9 },
    { month: 'Dec', enrolled: 8, matched: 14 },
    { month: 'Jan', enrolled: 5, matched: 12 },
    { month: 'Feb', enrolled: 7, matched: 10 },
]

export default function MonthlyEnrollmentChart() {
    const { colors, fonts } = useTheme()
    const [anim, setAnim] = useState(false)
    useEffect(() => { const t = setTimeout(() => setAnim(true), 300); return () => clearTimeout(t) }, [])

    const maxVal = Math.max(...MONTHS.map(m => Math.max(m.enrolled, m.matched)))
    const chartHeight = 180
    const barWidth = 18

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: radius.lg,
                boxShadow: colors.shadow,
                padding: spacing.lg,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
                <h2 style={{ margin: 0, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <HiOutlineArrowTrendingUp style={{ width: 22, height: 22, color: colors.accent }} />
                    Monthly Enrollment Trends
                </h2>
                <div style={{ display: 'flex', gap: spacing.lg }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: colors.accent }} />
                        <span style={{ fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: fonts.body }}>Matched</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: colors.green }} />
                        <span style={{ fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: fonts.body }}>Enrolled</span>
                    </div>
                </div>
            </div>

            {/* Chart area */}
            <div style={{ position: 'relative', height: chartHeight + 40, paddingLeft: 30 }}>
                {/* Y-axis labels */}
                {[0, Math.round(maxVal / 2), maxVal].map((val, i) => (
                    <div key={val} style={{
                        position: 'absolute',
                        left: 0,
                        top: chartHeight - (val / maxVal) * chartHeight - 6,
                        fontSize: '10px',
                        fontFamily: fonts.mono || fonts.body,
                        color: colors.textSecondary,
                        fontWeight: 600,
                    }}>
                        {val}
                    </div>
                ))}

                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        left: 30,
                        right: 0,
                        top: chartHeight - frac * chartHeight,
                        height: 1,
                        background: `${colors.border}40`,
                    }} />
                ))}

                {/* Bars */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    height: chartHeight,
                    marginLeft: 10,
                    position: 'relative',
                }}>
                    {MONTHS.map((m, i) => {
                        const matchedH = (m.matched / maxVal) * chartHeight
                        const enrolledH = (m.enrolled / maxVal) * chartHeight
                        return (
                            <div key={m.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: chartHeight }}>
                                    {/* Matched bar */}
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: anim ? matchedH : 0 }}
                                        transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                                        style={{
                                            width: barWidth,
                                            background: `linear-gradient(180deg, ${colors.accent}, ${colors.accent}80)`,
                                            borderRadius: `${radius.sm} ${radius.sm} 0 0`,
                                            position: 'relative',
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
                                            fontSize: '9px', fontWeight: 700, color: colors.accent,
                                            fontFamily: "'Open Sans', sans-serif",
                                            opacity: anim ? 1 : 0, transition: 'opacity 0.5s',
                                        }}>
                                            {m.matched}
                                        </div>
                                    </motion.div>

                                    {/* Enrolled bar */}
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: anim ? enrolledH : 0 }}
                                        transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                                        style={{
                                            width: barWidth,
                                            background: `linear-gradient(180deg, ${colors.green}, ${colors.green}80)`,
                                            borderRadius: `${radius.sm} ${radius.sm} 0 0`,
                                            position: 'relative',
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
                                            fontSize: '9px', fontWeight: 700, color: colors.green,
                                            fontFamily: "'Open Sans', sans-serif",
                                            opacity: anim ? 1 : 0, transition: 'opacity 0.5s',
                                        }}>
                                            {m.enrolled}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Month label */}
                                <span style={{
                                    fontSize: fontSize.xs, fontWeight: 600, color: colors.textSecondary,
                                    fontFamily: fonts.body,
                                }}>
                                    {m.month}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </motion.div>
    )
}
