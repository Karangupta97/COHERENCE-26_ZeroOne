import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion } from 'framer-motion'
import {
    HiOutlineBolt,
    HiOutlineCursorArrowRays,
    HiOutlineShieldCheck,
    HiOutlineChartBar,
    HiOutlineUserGroup,
} from 'react-icons/hi2'

const SCORE_DATA = {
    overall: 74,
    categories: [
        { label: 'Recruitment Pace', score: 82, Icon: HiOutlineBolt, tip: 'On track for Q2 target' },
        { label: 'Screening Success', score: 68, Icon: HiOutlineCursorArrowRays, tip: '68% pass screening criteria' },
        { label: 'Enrollment Completion', score: 60, Icon: HiOutlineUserGroup, tip: '2 of 7 approved → enrolled' },
        { label: 'Trial Compliance', score: 91, Icon: HiOutlineShieldCheck, tip: 'All trials meet protocol' },
    ]
}

export default function EnrollmentScore() {
    const { colors, fonts } = useTheme()

    const scoreColor = SCORE_DATA.overall >= 80 ? colors.green : SCORE_DATA.overall >= 60 ? colors.accent : (colors.yellow || '#F59E0B')

    const radialOptions = useMemo(() => ({
        chart: { type: 'radialBar', sparkline: { enabled: true } },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                hollow: { size: '62%' },
                track: { background: `${colors.border}`, strokeWidth: '100%', margin: 0 },
                dataLabels: {
                    name: { show: true, fontSize: '11px', fontFamily: fonts.body, color: colors.textSecondary, offsetY: 20 },
                    value: { show: true, fontSize: '32px', fontWeight: 800, fontFamily: "'Satoshi', sans-serif", color: scoreColor, offsetY: -14, formatter: (val) => Math.round(val) },
                },
            },
        },
        fill: {
            type: 'gradient',
            gradient: { shade: 'dark', type: 'horizontal', shadeIntensity: 0.2, gradientToColors: [colors.green], stops: [0, 100] },
        },
        stroke: { lineCap: 'round' },
        colors: [scoreColor],
        labels: ['Score'],
    }), [colors, fonts, scoreColor])

    const getColor = (score) => score >= 80 ? colors.green : score >= 60 ? colors.accent : (colors.yellow || '#F59E0B')

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.lg, boxShadow: colors.shadow, padding: spacing.lg }}>
            <h2 style={{ margin: `0 0 ${spacing.md}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <div style={{ width: 36, height: 36, borderRadius: radius.md, background: colors.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HiOutlineChartBar style={{ width: 20, height: 20, color: colors.accent }} />
                </div>
                Enrollment Performance
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                <div style={{ flexShrink: 0, width: 160, height: 160 }}>
                    <Chart options={radialOptions} series={[SCORE_DATA.overall]} type="radialBar" width={160} height={160} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {SCORE_DATA.categories.map((cat, i) => {
                        const CatIcon = cat.Icon
                        const catColor = getColor(cat.score)
                        return (
                            <motion.div key={cat.label} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: spacing.sm,
                                    padding: `${spacing.xs} ${spacing.sm}`, borderRadius: radius.md,
                                    background: `${catColor}08`, transition: 'background 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = `${catColor}15` }}
                                onMouseLeave={e => { e.currentTarget.style.background = `${catColor}08` }}
                            >
                                <div style={{ width: 30, height: 30, borderRadius: radius.sm, background: `${catColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <CatIcon style={{ width: 15, height: 15, color: catColor }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                                        <span style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>{cat.label}</span>
                                        <span style={{ fontSize: fontSize.xs, fontWeight: 700, color: catColor, fontFamily: fonts.mono || fonts.body }}>{cat.score}%</span>
                                    </div>
                                    <div style={{ height: 5, borderRadius: 3, background: colors.border, overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${cat.score}%` }}
                                            transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                                            style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${catColor}, ${catColor}B0)` }}
                                        />
                                    </div>
                                    <div style={{ fontSize: '10px', color: colors.textSecondary, marginTop: 2, fontFamily: fonts.body }}>{cat.tip}</div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </motion.div>
    )
}
