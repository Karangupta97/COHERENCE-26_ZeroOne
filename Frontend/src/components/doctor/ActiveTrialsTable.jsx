import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const TRIALS = [
    { name: 'GLYCO-ADVANCE', phase: 'Phase III', status: 'Recruiting', enrolled: 18, target: 30, match: 94, domain: 'Endocrinology' },
    { name: 'CARDIO-PROTECT', phase: 'Phase II', status: 'Recruiting', enrolled: 12, target: 25, match: 81, domain: 'Cardiology' },
    { name: 'ONCO-TARGET', phase: 'Phase III', status: 'Active', enrolled: 22, target: 25, match: 88, domain: 'Oncology' },
    { name: 'NEURO-SHIELD', phase: 'Phase I', status: 'Screening', enrolled: 5, target: 15, match: 76, domain: 'Neurology' },
]

function ProgressBar({ value, max, colors }) {
    const pct = Math.round((value / max) * 100)
    const color = pct >= 80 ? colors.green : pct >= 50 ? colors.accent : (colors.yellow || '#F59E0B')
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: `${colors.border}` }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    style={{ height: '100%', borderRadius: 4, background: color }}
                />
            </div>
            <span style={{ fontSize: fontSize.xs, fontWeight: 700, color, fontFamily: "'Open Sans', sans-serif", minWidth: 32, textAlign: 'right' }}>
                {pct}%
            </span>
        </div>
    )
}

export default function ActiveTrialsTable() {
    const { colors, fonts } = useTheme()
    const navigate = useNavigate()

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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
                <h2 style={{ margin: 0, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    🧪 Active Trials Overview
                </h2>
                <button
                    onClick={() => navigate('/doctor/trials')}
                    style={{
                        padding: `4px ${spacing.sm}`, borderRadius: radius.sm,
                        background: 'transparent', color: colors.accent,
                        border: 'none', fontSize: fontSize.xs, fontWeight: 600,
                        fontFamily: fonts.body, cursor: 'pointer',
                    }}
                >
                    View All →
                </button>
            </div>

            {/* Table header */}
            <div style={{
                display: 'grid', gridTemplateColumns: '2fr 100px 100px 1fr',
                gap: spacing.md, padding: `${spacing.sm} 0`, marginBottom: spacing.sm,
                borderBottom: `1px solid ${colors.border}`,
            }}>
                {['Trial', 'Phase', 'Status', 'Enrollment'].map(h => (
                    <span key={h} style={{
                        fontSize: fontSize.xs, fontWeight: 600,
                        color: colors.textSecondary, textTransform: 'uppercase',
                        letterSpacing: '0.5px', fontFamily: fonts.mono || fonts.body,
                    }}>
                        {h}
                    </span>
                ))}
            </div>

            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {TRIALS.map((trial, i) => (
                    <motion.div
                        key={trial.name}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        style={{
                            display: 'grid', gridTemplateColumns: '2fr 100px 100px 1fr',
                            gap: spacing.md, alignItems: 'center',
                            padding: `${spacing.md} 0`,
                            borderBottom: i < TRIALS.length - 1 ? `1px solid ${colors.border}40` : 'none',
                            cursor: 'pointer', borderRadius: radius.sm, transition: 'background 0.15s',
                        }}
                        onClick={() => navigate('/doctor/trials')}
                        onMouseEnter={(e) => { e.currentTarget.style.background = colors.card }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                        <div>
                            <div style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>
                                {trial.name}
                            </div>
                            <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2, fontFamily: fonts.body }}>
                                {trial.domain} • {trial.match}% avg match
                            </div>
                        </div>

                        <span style={{
                            fontSize: fontSize.xs, fontWeight: 600, padding: '3px 10px',
                            borderRadius: radius.full, background: colors.accentGlow,
                            color: colors.accent, fontFamily: fonts.body, textAlign: 'center',
                        }}>
                            {trial.phase}
                        </span>

                        <span style={{
                            fontSize: fontSize.xs, fontWeight: 600, padding: '3px 10px',
                            borderRadius: radius.full,
                            background: trial.status === 'Recruiting' ? colors.greenGlow : colors.accentGlow,
                            color: trial.status === 'Recruiting' ? colors.green : colors.accent,
                            fontFamily: fonts.body, textAlign: 'center',
                        }}>
                            {trial.status}
                        </span>

                        <div>
                            <ProgressBar value={trial.enrolled} max={trial.target} colors={colors} />
                            <div style={{ fontSize: '10px', color: colors.textSecondary, marginTop: 3, fontFamily: fonts.mono || fonts.body }}>
                                {trial.enrolled} / {trial.target} enrolled
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}
