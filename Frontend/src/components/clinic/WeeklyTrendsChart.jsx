import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion } from 'framer-motion'
import { HiOutlineChartBarSquare, HiOutlineArrowTrendingUp } from 'react-icons/hi2'

const WEEKLY_DATA = [
    { week: 'W1', screened: 6, enrolled: 2, dropped: 1 },
    { week: 'W2', screened: 9, enrolled: 4, dropped: 0 },
    { week: 'W3', screened: 7, enrolled: 3, dropped: 2 },
    { week: 'W4', screened: 11, enrolled: 5, dropped: 1 },
    { week: 'W5', screened: 8, enrolled: 6, dropped: 0 },
    { week: 'W6', screened: 13, enrolled: 7, dropped: 1 },
    { week: 'W7', screened: 10, enrolled: 5, dropped: 2 },
    { week: 'W8', screened: 14, enrolled: 8, dropped: 1 },
]

// Compute summary stats
const totalScreened = WEEKLY_DATA.reduce((s, w) => s + w.screened, 0)
const totalEnrolled = WEEKLY_DATA.reduce((s, w) => s + w.enrolled, 0)
const totalDropped = WEEKLY_DATA.reduce((s, w) => s + w.dropped, 0)
const conversionRate = Math.round((totalEnrolled / totalScreened) * 100)

export default function WeeklyTrendsChart() {
    const { colors, fonts } = useTheme()

    const options = useMemo(() => ({
        chart: {
            type: 'area',
            background: 'transparent',
            fontFamily: fonts.body,
            toolbar: { show: false },
            zoom: { enabled: false },
            animations: { enabled: true, easing: 'easeinout', speed: 900 },
            stacked: false,
        },
        stroke: { curve: 'smooth', width: [3, 3, 2] },
        fill: {
            type: 'gradient',
            gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 95, 100] },
        },
        xaxis: {
            categories: WEEKLY_DATA.map(w => w.week),
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: colors.textSecondary, fontSize: '11px', fontWeight: 600, fontFamily: fonts.body } },
        },
        yaxis: {
            labels: { style: { colors: colors.textSecondary, fontSize: '11px', fontFamily: fonts.mono || fonts.body } },
        },
        grid: {
            borderColor: `${colors.border}40`,
            strokeDashArray: 4,
            xaxis: { lines: { show: false } },
            padding: { top: -4, bottom: 0 },
        },
        colors: [colors.accent, colors.green, colors.red || '#EF4444'],
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: fonts.body,
            labels: { colors: colors.textSecondary },
            markers: { width: 10, height: 10, radius: 3, offsetX: -3 },
            itemMargin: { horizontal: 12 },
        },
        tooltip: {
            theme: 'dark',
            shared: true,
            intersect: false,
            style: { fontSize: '12px', fontFamily: fonts.body },
            y: { formatter: (val) => `${val} patients` },
        },
        markers: { size: 0, hover: { size: 5 } },
        dataLabels: { enabled: false },
    }), [colors, fonts])

    const series = [
        { name: 'Screened', data: WEEKLY_DATA.map(w => w.screened) },
        { name: 'Enrolled', data: WEEKLY_DATA.map(w => w.enrolled) },
        { name: 'Dropped', data: WEEKLY_DATA.map(w => w.dropped) },
    ]

    const summaryStats = [
        { label: 'Total Screened', value: totalScreened, color: colors.accent, bg: colors.accentGlow },
        { label: 'Total Enrolled', value: totalEnrolled, color: colors.green, bg: colors.greenGlow },
        { label: 'Dropped Out', value: totalDropped, color: colors.red || '#EF4444', bg: `${colors.red || '#EF4444'}12` },
        { label: 'Conversion Rate', value: `${conversionRate}%`, color: colors.green, bg: colors.greenGlow },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: radius.lg,
                boxShadow: colors.shadow,
                padding: spacing.lg,
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                    <div style={{ width: 36, height: 36, borderRadius: radius.md, background: colors.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <HiOutlineChartBarSquare style={{ width: 20, height: 20, color: colors.accent }} />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '18px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, letterSpacing: '-0.02em' }}>
                            Weekly Activity Trends
                        </h2>
                        <p style={{ margin: '2px 0 0', fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: fonts.body }}>
                            Screening, enrollment & dropout patterns over 8 weeks
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, padding: '6px 14px', borderRadius: radius.md, background: colors.greenGlow, border: `1px solid ${colors.green}30` }}>
                    <HiOutlineArrowTrendingUp style={{ width: 14, height: 14, color: colors.green }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: colors.green, fontFamily: fonts.body }}>
                        {conversionRate}% conversion
                    </span>
                </div>
            </div>

            {/* Summary Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.sm, marginBottom: spacing.md }}>
                {summaryStats.map((stat) => (
                    <div key={stat.label} style={{
                        padding: '12px 16px', borderRadius: radius.md,
                        background: stat.bg, border: `1px solid ${stat.color}20`,
                        display: 'flex', flexDirection: 'column', gap: 2,
                    }}>
                        <span style={{ fontSize: '10px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: fonts.body }}>
                            {stat.label}
                        </span>
                        <span style={{ fontSize: '20px', fontWeight: 800, color: stat.color, fontFamily: fonts.heading, lineHeight: 1.2 }}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>

            <Chart options={options} series={series} type="area" height={300} />
        </motion.div>
    )
}
