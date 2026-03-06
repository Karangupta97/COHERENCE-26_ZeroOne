import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion } from 'framer-motion'
import { HiOutlineRocketLaunch, HiOutlineCheckCircle } from 'react-icons/hi2'

const PIPELINE_FLOW = ['Matched', 'Under Review', 'Approved', 'Screening', 'Enrolled', 'Active']

const PATIENTS_PIPELINE = [
    { id: 'ANON-7F3A2B1C', step: 3, score: 94 },
    { id: 'ANON-4D8E9C2F', step: 4, score: 88 },
    { id: 'ANON-1B5C8D3E', step: 1, score: 81 },
]

export default function PatientPipeline() {
    const { colors, fonts } = useTheme()

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: '16px',
                boxShadow: colors.shadow,
                padding: '24px',
                display: 'flex', flexDirection: 'column',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '22px' }}>
                <div style={{
                    width: 36, height: 36, borderRadius: '10px',
                    background: colors.accentGlow,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <HiOutlineRocketLaunch style={{ width: 18, height: 18, color: colors.accent }} />
                </div>
                <h3 style={{ margin: 0, fontSize: '16px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                    Patient Pipeline
                </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                {PATIENTS_PIPELINE.map((p, ai) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + ai * 0.1 }}
                        style={{
                            background: colors.card,
                            borderRadius: '12px',
                            padding: '16px',
                            border: `1px solid ${colors.border}`,
                        }}
                    >
                        {/* Patient header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: fonts.heading, color: colors.textPrimary }}>{p.id}</span>
                                <span style={{
                                    fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                                    borderRadius: '20px',
                                    background: p.score >= 85 ? colors.greenGlow : colors.accentGlow,
                                    color: p.score >= 85 ? colors.green : colors.accent,
                                }}>
                                    {p.score}% match
                                </span>
                            </div>
                            <span style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: 500, fontFamily: fonts.body }}>
                                Step {p.step} of {PIPELINE_FLOW.length}
                            </span>
                        </div>

                        {/* Stepper */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                            {PIPELINE_FLOW.map((step, i) => {
                                const completed = i < p.step
                                const current = i === p.step
                                const color = completed ? colors.green : current ? colors.accent : `${colors.textSecondary}40`

                                return (
                                    <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < PIPELINE_FLOW.length - 1 ? 1 : 0 }}>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.4 + i * 0.06, type: 'spring' }}
                                            title={step}
                                            style={{
                                                width: current ? 26 : 20, height: current ? 26 : 20,
                                                borderRadius: '50%',
                                                background: completed ? color : current ? `${color}20` : `${colors.border}60`,
                                                border: `2px solid ${color}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: completed ? '#fff' : current ? color : colors.textSecondary,
                                                fontSize: '9px', fontWeight: 700,
                                                flexShrink: 0,
                                                transition: 'all 0.3s',
                                                boxShadow: current ? `0 0 8px ${color}30` : 'none',
                                            }}
                                        >
                                            {completed ? <HiOutlineCheckCircle style={{ width: 12, height: 12 }} /> : i + 1}
                                        </motion.div>

                                        {i < PIPELINE_FLOW.length - 1 && (
                                            <div style={{
                                                flex: 1, height: 2,
                                                background: i < p.step ? `linear-gradient(90deg, ${colors.green}, ${colors.green}80)` : `${colors.border}60`,
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
                                        fontSize: '8px', fontWeight: current ? 700 : 500,
                                        color: current ? colors.accent : i < p.step ? colors.green : `${colors.textSecondary}60`,
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
