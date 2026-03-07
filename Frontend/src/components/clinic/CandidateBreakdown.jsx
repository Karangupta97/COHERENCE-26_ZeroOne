import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion } from 'framer-motion'
import { HiOutlineUserGroup } from 'react-icons/hi2'

const STAGES = [
    { label: 'AI Matched', count: 12 },
    { label: 'Doctor Approved', count: 7 },
    { label: 'Screening', count: 5 },
    { label: 'Enrolled', count: 2 },
    { label: 'Dropped Out', count: 3 },
]

export default function CandidateBreakdown() {
    const { colors, fonts } = useTheme()

    const barColors = [colors.accent, colors.green, colors.accent, colors.green, colors.red || '#EF4444']

    const options = useMemo(() => ({
        chart: {
            type: 'bar',
            background: 'transparent',
            fontFamily: fonts.body,
            toolbar: { show: false },
            animations: { enabled: true, easing: 'easeinout', speed: 900, animateGradually: { enabled: true, delay: 120 } },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 6,
                borderRadiusApplication: 'end',
                barHeight: '60%',
                distributed: true,
                dataLabels: { position: 'top' },
            },
        },
        dataLabels: {
            enabled: true,
            textAnchor: 'start',
            offsetX: 6,
            style: { fontSize: '12px', fontWeight: 700, fontFamily: fonts.body, colors: [colors.textPrimary] },
            formatter: (val) => val,
        },
        xaxis: {
            categories: STAGES.map(s => s.label),
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { show: false },
        },
        yaxis: {
            labels: { style: { colors: colors.textSecondary, fontSize: '12px', fontWeight: 600, fontFamily: fonts.body } },
        },
        grid: {
            borderColor: `${colors.border}30`,
            strokeDashArray: 3,
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: false } },
            padding: { top: -8, bottom: -4 },
        },
        colors: barColors,
        fill: {
            type: 'gradient',
            gradient: { shade: 'light', type: 'horizontal', shadeIntensity: 0.15, opacityFrom: 0.95, opacityTo: 0.8, stops: [0, 100] },
        },
        legend: { show: false },
        tooltip: {
            enabled: true,
            theme: 'dark',
            style: { fontSize: '12px', fontFamily: fonts.body },
            y: { formatter: (val) => `${val} candidates` },
        },
        states: {
            hover: { filter: { type: 'darken', value: 0.88 } },
        },
    }), [colors, fonts, barColors])

    const series = [{ name: 'Candidates', data: STAGES.map(s => s.count) }]

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
            <h2 style={{ margin: `0 0 ${spacing.md}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <div style={{ width: 36, height: 36, borderRadius: radius.md, background: colors.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HiOutlineUserGroup style={{ width: 20, height: 20, color: colors.accent }} />
                </div>
                Candidate Stage Breakdown
            </h2>

            <Chart options={options} series={series} type="bar" height={220} />

            {/* Summary row */}
            <div style={{
                marginTop: spacing.sm,
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
                        <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: "'Satoshi', sans-serif", color: stat.color, lineHeight: 1 }}>
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
