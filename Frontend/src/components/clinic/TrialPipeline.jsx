import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion } from 'framer-motion'

const FUNNEL_FLOW = ['Posted', 'Matched', 'Doctor Approved', 'Screened', 'Enrolled', 'Active']

const TRIAL_PIPELINES = [
    { trial: 'GLYCO-ADVANCE', id: 'CT-2025-041', step: 4, enrolled: 18, target: 30 },
    { trial: 'CARDIO-PROTECT', id: 'CT-2025-038', step: 2, enrolled: 12, target: 25 },
    { trial: 'ONCO-TARGET', id: 'CT-2025-033', step: 5, enrolled: 22, target: 25 },
]

export default function TrialPipeline() {
    const { colors, fonts } = useTheme()

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.lg, boxShadow: colors.shadow, padding: spacing.lg }}>
            <h2 style={{ margin: `0 0 ${spacing.lg}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                🚀 Trial Enrollment Pipeline
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
                {TRIAL_PIPELINES.map((p, ai) => (
                    <motion.div key={p.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + ai * 0.1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                                <span style={{ fontSize: fontSize.base, fontWeight: 700, fontFamily: fonts.heading, color: colors.textPrimary }}>{p.trial}</span>
                                <span style={{ fontSize: fontSize.xs, fontWeight: 600, padding: '2px 8px', borderRadius: radius.full, background: colors.accentGlow, color: colors.accent, fontFamily: fonts.mono || fonts.body }}>
                                    {p.id}
                                </span>
                            </div>
                            <span style={{ fontSize: fontSize.xs, color: colors.accent, fontWeight: 600, fontFamily: fonts.body }}>
                                {p.enrolled}/{p.target} enrolled
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                            {FUNNEL_FLOW.map((step, i) => {
                                const completed = i < p.step
                                const current = i === p.step
                                const color = completed ? colors.green : current ? colors.accent : colors.border
                                return (
                                    <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < FUNNEL_FLOW.length - 1 ? 1 : 0 }}>
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + i * 0.08, type: 'spring' }}
                                            title={step}
                                            style={{
                                                width: current ? 28 : 20, height: current ? 28 : 20, borderRadius: '50%',
                                                background: completed ? color : current ? `${color}30` : `${colors.border}40`,
                                                border: `2px solid ${color}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: completed ? '#fff' : current ? color : colors.textSecondary,
                                                fontSize: completed ? '10px' : '8px', fontWeight: 700, flexShrink: 0,
                                                boxShadow: current ? `0 0 10px ${color}40` : 'none',
                                            }}>
                                            {completed ? '✓' : i + 1}
                                        </motion.div>
                                        {i < FUNNEL_FLOW.length - 1 && (
                                            <div style={{ flex: 1, height: 3, marginLeft: -1, marginRight: -1, background: i < p.step ? colors.green : `${colors.border}60`, borderRadius: 2 }} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        <div style={{ display: 'flex', marginTop: 6 }}>
                            {FUNNEL_FLOW.map((step, i) => {
                                const current = i === p.step
                                return (
                                    <div key={step} style={{
                                        flex: 1, textAlign: 'center', fontSize: '9px',
                                        fontWeight: current ? 700 : 500,
                                        color: current ? colors.accent : i < p.step ? colors.green : `${colors.textSecondary}80`,
                                        fontFamily: fonts.body, lineHeight: 1.2,
                                    }}>
                                        {step}
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}
