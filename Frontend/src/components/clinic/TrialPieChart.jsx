import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion } from 'framer-motion'
import { HiOutlineBeaker } from 'react-icons/hi2'

const SEGMENTS = [
    { label: 'Phase III', count: 2 },
    { label: 'Phase II', count: 2 },
    { label: 'Phase I', count: 1 },
    { label: 'Completed', count: 1 },
]

export default function TrialPieChart() {
    const { colors, fonts } = useTheme()

    const chartColors = [colors.green, colors.accent, '#F59E0B', '#64748B']
    const total = SEGMENTS.reduce((s, seg) => s + seg.count, 0)

    const options = useMemo(() => ({
        chart: {
            type: 'donut',
            background: 'transparent',
            fontFamily: fonts.body,
        },
        labels: SEGMENTS.map(s => s.label),
        colors: chartColors,
        stroke: { width: 3, colors: [colors.surface] },
        dataLabels: { enabled: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '68%',
                    labels: {
                        show: true,
                        name: { show: true, fontSize: '12px', fontFamily: fonts.body, color: colors.textSecondary, offsetY: 20 },
                        value: { show: true, fontSize: '28px', fontWeight: 800, fontFamily: "'Satoshi', sans-serif", color: colors.textPrimary, offsetY: -12, formatter: () => total },
                        total: { show: true, label: 'Total Trials', fontSize: '11px', fontFamily: fonts.body, color: colors.textSecondary, formatter: () => total },
                    },
                },
                expandOnClick: false,
            },
        },
        legend: { show: false },
        tooltip: {
            enabled: true,
            theme: 'dark',
            fillSeriesColor: false,
            style: { fontSize: '12px', fontFamily: fonts.body },
            y: { formatter: (val) => `${val} trial${val !== 1 ? 's' : ''}` },
        },
        states: {
            hover: { filter: { type: 'darken', value: 0.85 } },
            active: { filter: { type: 'none' } },
        },
    }), [colors, fonts, total, chartColors])

    const series = SEGMENTS.map(s => s.count)

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
            <h2 style={{ margin: `0 0 ${spacing.md}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <div style={{ width: 36, height: 36, borderRadius: radius.md, background: colors.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HiOutlineBeaker style={{ width: 20, height: 20, color: colors.accent }} />
                </div>
                Trial Phase Distribution
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
                <div style={{ flexShrink: 0 }}>
                    <Chart options={options} series={series} type="donut" width={200} height={200} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {SEGMENTS.map((seg, i) => (
                        <motion.div
                            key={seg.label}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: spacing.sm,
                                padding: `${spacing.xs} ${spacing.sm}`, borderRadius: radius.md,
                                transition: 'background 0.2s', cursor: 'default',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = `${chartColors[i]}12` }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                        >
                            <div style={{ width: 10, height: 10, borderRadius: 3, background: chartColors[i], flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>{seg.label}</span>
                                    <span style={{ fontSize: fontSize.sm, fontWeight: 800, fontFamily: "'Satoshi', sans-serif", color: chartColors[i] }}>{seg.count}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginTop: 3 }}>
                                    <div style={{ flex: 1, height: 4, borderRadius: 2, background: colors.border, overflow: 'hidden' }}>
                                        <div style={{ width: `${Math.round((seg.count / total) * 100)}%`, height: '100%', borderRadius: 2, background: chartColors[i], transition: 'width 0.6s ease' }} />
                                    </div>
                                    <span style={{ fontSize: '10px', color: colors.textSecondary, fontFamily: fonts.mono || fonts.body, minWidth: 28 }}>
                                        {Math.round((seg.count / total) * 100)}%
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
