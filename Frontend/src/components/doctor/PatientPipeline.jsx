import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion } from 'framer-motion'

const PIPELINE_FLOW = ['Matched', 'Under Review', 'Approved', 'Screening', 'Enrolled', 'Active']

const PATIENTS_PIPELINE = [
    { patient: 'Rajesh Kumar', id: 'PT-0041', step: 3, score: 94 },
    { patient: 'Anita Desai', id: 'PT-0039', step: 4, score: 88 },
    { patient: 'Vikram Mehta', id: 'PT-0037', step: 1, score: 81 },
]

export default function PatientPipeline() {
    const { colors, fonts } = useTheme()

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
            <h2 style={{ margin: `0 0 ${spacing.lg}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                🚀 Patient Pipeline Tracker
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
                {PATIENTS_PIPELINE.map((p, ai) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + ai * 0.1 }}
                    >
                        {/* Patient header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                                <span style={{ fontSize: fontSize.base, fontWeight: 700, fontFamily: fonts.heading, color: colors.textPrimary }}>{p.patient}</span>
                                <span style={{
                                    fontSize: fontSize.xs, fontWeight: 600, padding: '2px 8px',
                                    borderRadius: radius.full,
                                    background: colors.accentGlow, color: colors.accent,
                                    fontFamily: fonts.mono || fonts.body,
                                }}>
                                    {p.id}
                                </span>
                                <span style={{
                                    fontSize: fontSize.xs, fontWeight: 700, padding: '2px 8px',
                                    borderRadius: radius.full,
                                    background: p.score >= 85 ? colors.greenGlow : colors.accentGlow,
                                    color: p.score >= 85 ? colors.green : colors.accent,
                                }}>
                                    {p.score}% match
                                </span>
                            </div>
                            <span style={{ fontSize: fontSize.xs, color: colors.accent, fontWeight: 600, fontFamily: fonts.body }}>
                                Step {p.step} of {PIPELINE_FLOW.length}
                            </span>
                        </div>

                        {/* Stepper */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                            {PIPELINE_FLOW.map((step, i) => {
                                const completed = i < p.step
                                const current = i === p.step
                                const color = completed ? colors.green : current ? colors.accent : colors.border

                                return (
                                    <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < PIPELINE_FLOW.length - 1 ? 1 : 0 }}>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.4 + i * 0.08, type: 'spring' }}
                                            title={step}
                                            style={{
                                                width: current ? 28 : 20, height: current ? 28 : 20,
                                                borderRadius: '50%',
                                                background: completed ? color : current ? `${color}30` : `${colors.border}40`,
                                                border: `2px solid ${color}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: completed ? '#fff' : current ? color : colors.textSecondary,
                                                fontSize: completed ? '10px' : '8px', fontWeight: 700,
                                                flexShrink: 0, cursor: 'default',
                                                transition: 'all 0.3s',
                                                boxShadow: current ? `0 0 10px ${color}40` : 'none',
                                            }}
                                        >
                                            {completed ? '✓' : i + 1}
                                        </motion.div>

                                        {i < PIPELINE_FLOW.length - 1 && (
                                            <div style={{
                                                flex: 1, height: 3, marginLeft: -1, marginRight: -1,
                                                background: i < p.step ? colors.green : `${colors.border}60`,
                                                borderRadius: 2, transition: 'background 0.5s',
                                            }} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Step labels */}
                        <div style={{ display: 'flex', marginTop: 6 }}>
                            {PIPELINE_FLOW.map((step, i) => {
                                const current = i === p.step
                                return (
                                    <div key={step} style={{
                                        flex: 1, textAlign: 'center',
                                        fontSize: '9px', fontWeight: current ? 700 : 500,
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
