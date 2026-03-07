import { useMemo } from 'react'
import Chart from 'react-apexcharts'
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

    const totalMatched = MONTHS.reduce((s, m) => s + m.matched, 0)
    const totalEnrolled = MONTHS.reduce((s, m) => s + m.enrolled, 0)
    const conversionRate = Math.round((totalEnrolled / totalMatched) * 100)

    const options = useMemo(() => ({
        chart: {
            type: 'bar',
            background: 'transparent',
            fontFamily: fonts.body,
            toolbar: { show: false },
            zoom: { enabled: false },
            animations: { enabled: true, easing: 'easeinout', speed: 800, animateGradually: { enabled: true, delay: 100 } },
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                borderRadiusApplication: 'end',
                columnWidth: '55%',
                dataLabels: { position: 'top' },
            },
        },
        dataLabels: {
            enabled: true,
            offsetY: -20,
            style: { fontSize: '11px', fontWeight: 700, fontFamily: fonts.body, colors: [colors.textSecondary] },
            formatter: (val) => val,
        },
        xaxis: {
            categories: MONTHS.map(m => m.month),
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: colors.textSecondary, fontSize: '12px', fontWeight: 600, fontFamily: fonts.body } },
        },
        yaxis: {
            labels: { style: { colors: colors.textSecondary, fontSize: '11px', fontFamily: fonts.mono || fonts.body } },
        },
        grid: {
            borderColor: `${colors.border}50`,
            strokeDashArray: 4,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
            padding: { top: 0, bottom: 0 },
        },
        colors: [colors.accent, colors.green],
        fill: {
            type: 'gradient',
            gradient: { shade: 'light', type: 'vertical', shadeIntensity: 0.2, opacityFrom: 0.95, opacityTo: 0.85, stops: [0, 100] },
        },
        legend: { show: false },
        tooltip: {
            theme: 'dark',
            shared: true,
            intersect: false,
            style: { fontSize: '12px', fontFamily: fonts.body },
            y: { formatter: (val) => `${val} patients` },
        },
        states: {
            hover: { filter: { type: 'darken', value: 0.88 } },
        },
    }), [colors, fonts])

    const series = [
        { name: 'Matched', data: MONTHS.map(m => m.matched) },
        { name: 'Enrolled', data: MONTHS.map(m => m.enrolled) },
    ]

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
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md, flexWrap: 'wrap', gap: spacing.md }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                    <div style={{ width: 40, height: 40, borderRadius: radius.md, background: colors.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <HiOutlineArrowTrendingUp style={{ width: 20, height: 20, color: colors.accent }} />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '18px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, letterSpacing: '-0.02em' }}>
                            Monthly Enrollment Trends
                        </h2>
                        <p style={{ margin: '2px 0 0', fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: fonts.body }}>
                            Matched vs enrolled over the last 6 months
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
                    {/* Summary pills */}
                    <div style={{ padding: `6px 12px`, borderRadius: radius.md, background: `${colors.accent}12`, border: `1px solid ${colors.accent}25` }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: colors.accent, fontFamily: fonts.body }}>
                            {conversionRate}% conversion
                        </span>
                    </div>
                    {/* Legend */}
                    {[{ label: 'Matched', color: colors.accent }, { label: 'Enrolled', color: colors.green }].map(l => (
                        <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: radius.sm, background: `${colors.border}20`, border: `1px solid ${colors.border}` }}>
                            <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                            <span style={{ fontSize: fontSize.xs, fontWeight: 600, color: colors.textSecondary, fontFamily: fonts.body }}>{l.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <Chart options={options} series={series} type="bar" height={260} />
        </motion.div>
    )
}
