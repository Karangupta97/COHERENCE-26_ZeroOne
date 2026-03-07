import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion } from 'framer-motion'
import { HiOutlineFunnel } from 'react-icons/hi2'
import { FUNNEL_DATA } from '../../pages/clinic/data/mockData'

export default function EnrollmentFunnelChart() {
    const { colors, fonts } = useTheme()

    const options = useMemo(() => ({
        chart: {
            type: 'bar',
            background: 'transparent',
            fontFamily: fonts.body,
            toolbar: { show: false },
            animations: { enabled: true, easing: 'easeinout', speed: 1000, animateGradually: { enabled: true, delay: 80 } },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                borderRadiusApplication: 'end',
                barHeight: '70%',
                distributed: true,
                isFunnel: true,
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val, { dataPointIndex }) => `${FUNNEL_DATA[dataPointIndex].label}  —  ${val}`,
            dropShadow: { enabled: false },
            style: { fontSize: '13px', fontWeight: 600, fontFamily: fonts.body, colors: ['#fff'] },
        },
        xaxis: {
            categories: FUNNEL_DATA.map(f => f.label),
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { show: false },
        },
        yaxis: { labels: { show: false } },
        grid: { show: false, padding: { top: -6, bottom: -6, left: 0, right: 0 } },
        colors: FUNNEL_DATA.map(f => f.color),
        legend: { show: false },
        tooltip: {
            enabled: true,
            theme: 'dark',
            style: { fontSize: '12px', fontFamily: fonts.body },
            y: { formatter: (val) => `${val} patients` },
        },
        states: {
            hover: { filter: { type: 'darken', value: 0.9 } },
        },
    }), [colors, fonts])

    const series = [{ name: 'Patients', data: FUNNEL_DATA.map(f => f.value) }]

    const convPct = Math.round((FUNNEL_DATA[FUNNEL_DATA.length - 1].value / FUNNEL_DATA[0].value) * 100)

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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                <h2 style={{ margin: 0, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <div style={{ width: 36, height: 36, borderRadius: radius.md, background: colors.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <HiOutlineFunnel style={{ width: 20, height: 20, color: colors.accent }} />
                    </div>
                    Enrollment Funnel
                </h2>
                <div style={{ padding: '6px 14px', borderRadius: radius.md, background: colors.greenGlow, border: `1px solid ${colors.green}30` }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: colors.green, fontFamily: fonts.body }}>
                        {convPct}% overall conversion
                    </span>
                </div>
            </div>

            <Chart options={options} series={series} type="bar" height={260} />
        </motion.div>
    )
}
