import { useEffect, useState } from 'react'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion } from 'framer-motion'
import { HiOutlineArrowTrendingUp } from 'react-icons/hi2'

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
    useEffect(() => {
        const t = setTimeout(() => setAnim(true), 300)
        return () => clearTimeout(t)
    }, [])

    const maxVal = Math.ceil(Math.max(...MONTHS.map(m => Math.max(m.enrolled, m.matched))) * 1.2) || 14
    const chartHeight = 200
    const barWidth = 24
    const barGap = 6
    const groupGap = 24

    const yTicks = [0, Math.round(maxVal / 2), maxVal]

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
                padding: `${spacing.xl}px ${spacing.lg}px`,
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: spacing.xl,
                    flexWrap: 'wrap',
                    gap: spacing.md,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                    <div
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: radius.md,
                            background: colors.accentGlow,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <HiOutlineArrowTrendingUp style={{ width: 22, height: 22, color: colors.accent }} />
                    </div>
                    <div>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: '18px',
                                fontFamily: fonts.heading,
                                fontWeight: 700,
                                color: colors.textPrimary,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Monthly Enrollment Trends
                        </h2>
                        <p
                            style={{
                                margin: '2px 0 0',
                                fontSize: fontSize.xs,
                                color: colors.textSecondary,
                                fontFamily: fonts.body,
                            }}
                        >
                            Matched vs enrolled over the last 6 months
                        </p>
                    </div>
                </div>
                {/* Legend */}
                <div style={{ display: 'flex', gap: spacing.lg, alignItems: 'center' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.sm,
                            padding: `6px ${spacing.sm}px`,
                            borderRadius: radius.sm,
                            background: `${colors.border}20`,
                            border: `1px solid ${colors.border}`,
                        }}
                    >
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: 4,
                                background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}CC)`,
                            }}
                        />
                        <span style={{ fontSize: fontSize.xs, fontWeight: 600, color: colors.textSecondary, fontFamily: fonts.body }}>
                            Matched
                        </span>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.sm,
                            padding: `6px ${spacing.sm}px`,
                            borderRadius: radius.sm,
                            background: `${colors.border}20`,
                            border: `1px solid ${colors.border}`,
                        }}
                    >
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: 4,
                                background: `linear-gradient(135deg, ${colors.green}, ${colors.green}CC)`,
                            }}
                        />
                        <span style={{ fontSize: fontSize.xs, fontWeight: 600, color: colors.textSecondary, fontFamily: fonts.body }}>
                            Enrolled
                        </span>
                    </div>
                </div>
            </div>

            {/* Chart area */}
            <div
                style={{
                    position: 'relative',
                    height: chartHeight + 48,
                    paddingLeft: 36,
                }}
            >
                {/* Y-axis labels */}
                {yTicks.map((val) => (
                    <div
                        key={val}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: chartHeight - (val / maxVal) * chartHeight - 8,
                            fontSize: '11px',
                            fontFamily: fonts.mono || fonts.body,
                            color: colors.textSecondary,
                            fontWeight: 500,
                            opacity: 0.9,
                        }}
                    >
                        {val}
                    </div>
                ))}

                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: 36,
                            right: 0,
                            top: chartHeight - frac * chartHeight,
                            height: 1,
                            background: frac === 0 ? colors.border : `${colors.border}30`,
                        }}
                    />
                ))}

                {/* Bars */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        height: chartHeight,
                        marginLeft: 12,
                        paddingRight: 12,
                    }}
                >
                    {MONTHS.map((m, i) => {
                        const matchedH = (m.matched / maxVal) * chartHeight
                        const enrolledH = (m.enrolled / maxVal) * chartHeight
                        return (
                            <motion.div
                                key={m.month}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.05 }}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 10,
                                    flex: 1,
                                    minWidth: 0,
                                    padding: `0 ${groupGap / 2}px`,
                                }}
                            >
                                {/* Data labels above bars */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        gap: barGap,
                                        height: chartHeight,
                                        position: 'relative',
                                    }}
                                >
                                    {/* Matched bar */}
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: anim ? matchedH : 0 }}
                                        transition={{
                                            delay: 0.35 + i * 0.06,
                                            duration: 0.7,
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                        }}
                                        style={{
                                            width: barWidth,
                                            minHeight: 4,
                                            background: `linear-gradient(180deg, ${colors.accent}EE 0%, ${colors.accent} 50%, ${colors.accent}99 100%)`,
                                            borderRadius: `${radius.sm}px ${radius.sm}px 0 0`,
                                            position: 'relative',
                                            boxShadow: `0 2px 8px ${colors.accent}30`,
                                        }}
                                    >
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: -22,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                color: colors.accent,
                                                fontFamily: fonts.body,
                                                opacity: anim ? 1 : 0,
                                                transition: 'opacity 0.4s 0.2s',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {m.matched}
                                        </span>
                                    </motion.div>

                                    {/* Enrolled bar */}
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: anim ? enrolledH : 0 }}
                                        transition={{
                                            delay: 0.4 + i * 0.06,
                                            duration: 0.7,
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                        }}
                                        style={{
                                            width: barWidth,
                                            minHeight: 4,
                                            background: `linear-gradient(180deg, ${colors.green}EE 0%, ${colors.green} 50%, ${colors.green}99 100%)`,
                                            borderRadius: `${radius.sm}px ${radius.sm}px 0 0`,
                                            position: 'relative',
                                            boxShadow: `0 2px 8px ${colors.green}30`,
                                        }}
                                    >
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: -22,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                color: colors.green,
                                                fontFamily: fonts.body,
                                                opacity: anim ? 1 : 0,
                                                transition: 'opacity 0.4s 0.25s',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {m.enrolled}
                                        </span>
                                    </motion.div>
                                </div>

                                {/* Month label */}
                                <span
                                    style={{
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: colors.textSecondary,
                                        fontFamily: fonts.body,
                                        letterSpacing: '0.02em',
                                    }}
                                >
                                    {m.month}
                                </span>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </motion.div>
    )
}
