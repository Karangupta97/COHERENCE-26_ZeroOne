import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineBeaker, HiOutlineArrowRight } from 'react-icons/hi2'

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: colors.border }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    style={{
                        height: '100%', borderRadius: 3,
                        background: `linear-gradient(90deg, ${color}CC, ${color})`,
                    }}
                />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color, fontFamily: "'Open Sans', sans-serif", minWidth: 32, textAlign: 'right' }}>
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: '16px',
                boxShadow: colors.shadow,
                padding: '24px',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '10px',
                        background: colors.accentGlow,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <HiOutlineBeaker style={{ width: 18, height: 18, color: colors.accent }} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                        Active Trials
                    </h3>
                </div>
                <button
                    onClick={() => navigate('/doctor/trials')}
                    style={{
                        padding: '6px 14px', borderRadius: '8px',
                        background: colors.accentGlow, color: colors.accent,
                        border: 'none', fontSize: '12px', fontWeight: 600,
                        fontFamily: fonts.body, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = `${colors.accent}25`}
                    onMouseLeave={e => e.currentTarget.style.background = colors.accentGlow}
                >
                    View All <HiOutlineArrowRight style={{ width: 12, height: 12 }} />
                </button>
            </div>

            {/* Table header */}
            <div style={{
                display: 'grid', gridTemplateColumns: '2fr 100px 100px 1fr',
                gap: '14px', padding: '10px 14px', marginBottom: '4px',
                background: colors.card, borderRadius: '10px',
            }}>
                {['Trial', 'Phase', 'Status', 'Enrollment'].map(h => (
                    <span key={h} style={{
                        fontSize: '11px', fontWeight: 600,
                        color: colors.textSecondary, textTransform: 'uppercase',
                        letterSpacing: '0.8px', fontFamily: fonts.body,
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
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.06 }}
                        style={{
                            display: 'grid', gridTemplateColumns: '2fr 100px 100px 1fr',
                            gap: '14px', alignItems: 'center',
                            padding: '14px',
                            borderBottom: i < TRIALS.length - 1 ? `1px solid ${colors.border}` : 'none',
                            borderRadius: '8px', transition: 'background 0.15s', cursor: 'pointer',
                        }}
                        onClick={() => navigate('/doctor/trials')}
                        onMouseEnter={e => e.currentTarget.style.background = colors.card}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>
                                {trial.name}
                            </div>
                            <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: 2, fontFamily: fonts.body }}>
                                {trial.domain} · {trial.match}% avg match
                            </div>
                        </div>

                        <span style={{
                            fontSize: '11px', fontWeight: 600, padding: '4px 10px',
                            borderRadius: '20px', background: colors.accentGlow,
                            color: colors.accent, fontFamily: fonts.body, textAlign: 'center',
                        }}>
                            {trial.phase}
                        </span>

                        <span style={{
                            fontSize: '11px', fontWeight: 600, padding: '4px 10px',
                            borderRadius: '20px',
                            background: trial.status === 'Recruiting' ? colors.greenGlow : trial.status === 'Active' ? colors.accentGlow : `${colors.yellow || '#F59E0B'}15`,
                            color: trial.status === 'Recruiting' ? colors.green : trial.status === 'Active' ? colors.accent : (colors.yellow || '#F59E0B'),
                            fontFamily: fonts.body, textAlign: 'center',
                        }}>
                            {trial.status}
                        </span>

                        <div>
                            <ProgressBar value={trial.enrolled} max={trial.target} colors={colors} />
                            <div style={{ fontSize: '10px', color: colors.textSecondary, marginTop: 3, fontFamily: fonts.body }}>
                                {trial.enrolled} / {trial.target} enrolled
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}
