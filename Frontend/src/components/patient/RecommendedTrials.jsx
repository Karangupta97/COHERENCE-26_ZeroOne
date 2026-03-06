import { useState } from 'react'
import { useTheme, radius, spacing, fontSize, TRIALS } from '../../theme.jsx'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiOutlineEye, HiOutlinePaperAirplane, HiOutlineXMark, HiOutlineCheckCircle,
  HiOutlineSparkles, HiOutlineMapPin, HiOutlineBanknotes, HiOutlineClipboardDocumentList,
} from 'react-icons/hi2'

const ELIGIBILITY = {
  'T-001': ['Age criteria matches', 'Disease stage eligible', 'No excluded medications'],
  'T-002': ['Blood pressure range eligible', 'Age criteria matches', 'No excluded conditions'],
  'T-003': ['BMI within range', 'No conflicting trials', 'Disease stage eligible'],
  'T-004': ['Age criteria matches', 'Neurological assessment cleared'],
  'T-005': ['Cancer stage eligible', 'Age criteria matches', 'Prior treatment compatible'],
}

function ScoreRing({ score, size = 48, strokeWidth = 4, colors }) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const scoreColor = score >= 85 ? colors.green : score >= 70 ? colors.accent : (colors.yellow || '#F59E0B')

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={colors.border} strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={scoreColor} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <span style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: fontSize.xs, fontWeight: 700, color: scoreColor,
      }}>
        {score}%
      </span>
    </div>
  )
}

export default function RecommendedTrials() {
  const { colors, fonts } = useTheme()
  const navigate = useNavigate()
  const [viewTrial, setViewTrial] = useState(null)
  const [appliedTrials, setAppliedTrials] = useState({})
  const [applyToast, setApplyToast] = useState(null)

  const handleApply = (trial) => {
    setAppliedTrials({ ...appliedTrials, [trial.id]: true })
    setApplyToast(trial.name)
    setTimeout(() => setApplyToast(null), 3000)
  }

  return (
    <div style={{
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: radius.lg,
      boxShadow: colors.shadow,
      padding: spacing.lg,
      position: 'relative',
    }}>
      {/* Toast notification */}
      <AnimatePresence>
        {applyToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'absolute', top: spacing.md, right: spacing.md, zIndex: 10,
              background: colors.green, color: '#fff',
              padding: `${spacing.sm} ${spacing.lg}`, borderRadius: radius.md,
              fontSize: fontSize.sm, fontWeight: 600, fontFamily: fonts.body,
              display: 'flex', alignItems: 'center', gap: spacing.sm,
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}
          >
            <HiOutlineCheckCircle style={{ width: 18, height: 18 }} />
            Applied to {applyToast}!
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
        <h2 style={{ margin: 0, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <HiOutlineSparkles style={{ width: 22, height: 22, color: colors.accent }} /> AI Recommended Clinical Trials
        </h2>
        <button
          onClick={() => navigate('/patient/trials')}
          style={{
            padding: `6px ${spacing.md}`, borderRadius: radius.sm,
            background: colors.accentGlow, color: colors.accent,
            border: `1px solid ${colors.accent}40`, fontSize: fontSize.xs, fontWeight: 600,
            fontFamily: fonts.body, cursor: 'pointer',
          }}
        >
          View All Trials →
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {TRIALS.slice(0, 4).map((trial, i) => (
          <div key={trial.id}>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              style={{
                background: colors.card,
                border: `1px solid ${viewTrial?.id === trial.id ? colors.accent : colors.border}`,
                borderRadius: viewTrial?.id === trial.id ? `${radius.md} ${radius.md} 0 0` : radius.md,
                padding: spacing.md,
                display: 'flex',
                alignItems: 'flex-start',
                gap: spacing.md,
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              onClick={() => setViewTrial(viewTrial?.id === trial.id ? null : trial)}
              onMouseEnter={(e) => { if (viewTrial?.id !== trial.id) e.currentTarget.style.borderColor = colors.accent }}
              onMouseLeave={(e) => { if (viewTrial?.id !== trial.id) e.currentTarget.style.borderColor = colors.border }}
            >
              {/* Score Ring */}
              <ScoreRing score={trial.score} colors={colors} />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: fontSize.base, fontWeight: 700, fontFamily: fonts.heading, color: colors.textPrimary }}>
                    {trial.name}
                  </span>
                  <span style={{
                    fontSize: fontSize.xs, fontWeight: 600, padding: '2px 8px',
                    borderRadius: radius.full, background: colors.greenGlow, color: colors.green,
                    fontFamily: fonts.mono || fonts.body,
                  }}>
                    {trial.phase}
                  </span>
                  <span style={{
                    fontSize: fontSize.xs, fontWeight: 500, padding: '2px 8px',
                    borderRadius: radius.full, background: colors.accentGlow, color: colors.accent,
                    fontFamily: fonts.mono || fonts.body,
                  }}>
                    {trial.status}
                  </span>
                </div>

                <div style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4, fontFamily: fonts.body, display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  <HiOutlineMapPin style={{ width: 14, height: 14, flexShrink: 0 }} /> {trial.sponsor} • {trial.location} • {trial.distance} away
                </div>

                {/* Eligibility bullets */}
                <div style={{ marginTop: spacing.sm, display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                  {(ELIGIBILITY[trial.id] || []).map((e) => (
                    <span key={e} style={{
                      fontSize: '11px', color: colors.green, fontWeight: 500,
                      background: colors.greenGlow, padding: '2px 8px',
                      borderRadius: radius.sm, fontFamily: fonts.body,
                    }}>
                      ✓ {e}
                    </span>
                  ))}
                </div>

                {/* Compensation */}
                <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs, display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  <HiOutlineBanknotes style={{ width: 14, height: 14, flexShrink: 0 }} /> {trial.compensation} • {trial.slots} slots remaining
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setViewTrial(viewTrial?.id === trial.id ? null : trial)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: `6px ${spacing.md}`, borderRadius: radius.sm,
                    background: viewTrial?.id === trial.id ? colors.accent : colors.accentGlow,
                    color: viewTrial?.id === trial.id ? '#fff' : colors.accent,
                    border: `1px solid ${colors.accent}40`, fontSize: fontSize.xs, fontWeight: 600,
                    fontFamily: fonts.body, cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <HiOutlineEye style={{ width: 14, height: 14 }} /> {viewTrial?.id === trial.id ? 'Hide' : 'View'}
                </button>
                <button
                  onClick={() => handleApply(trial)}
                  disabled={appliedTrials[trial.id]}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: `6px ${spacing.md}`, borderRadius: radius.sm,
                    background: appliedTrials[trial.id] ? colors.green : colors.accent,
                    color: '#fff',
                    border: 'none', fontSize: fontSize.xs, fontWeight: 600,
                    fontFamily: fonts.body, cursor: appliedTrials[trial.id] ? 'default' : 'pointer',
                    transition: 'all 0.2s', opacity: appliedTrials[trial.id] ? 0.8 : 1,
                  }}
                >
                  {appliedTrials[trial.id]
                    ? <><HiOutlineCheckCircle style={{ width: 14, height: 14 }} /> Applied</>
                    : <><HiOutlinePaperAirplane style={{ width: 14, height: 14 }} /> Apply</>
                  }
                </button>
              </div>
            </motion.div>

            {/* Inline detail panel — appears directly below the clicked card */}
            <AnimatePresence>
              {viewTrial?.id === trial.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    background: colors.card,
                    border: `1px solid ${colors.accent}40`,
                    borderTop: 'none',
                    borderRadius: `0 0 ${radius.md} ${radius.md}`,
                    padding: spacing.lg,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                    <h3 style={{ margin: 0, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                      <HiOutlineClipboardDocumentList style={{ width: 20, height: 20, color: colors.accent }} /> {trial.name} — Full Details
                    </h3>
                    <button onClick={() => setViewTrial(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textSecondary }}>
                      <HiOutlineXMark style={{ width: 20, height: 20 }} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing.md }}>
                    {[
                      ['Sponsor', trial.sponsor],
                      ['Phase', trial.phase],
                      ['Category', trial.category],
                      ['Location', trial.location],
                      ['Distance', trial.distance],
                      ['Slots Left', `${trial.slots}`],
                      ['Compensation', trial.compensation],
                      ['Status', trial.status],
                      ['AI Match', `${trial.score}%`],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: fonts.mono || fonts.body }}>{label}</div>
                        <div style={{ fontSize: fontSize.sm, color: colors.textPrimary, fontWeight: 500, marginTop: 2 }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: spacing.md }}>
                    <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: spacing.xs, fontFamily: fonts.mono || fonts.body }}>Eligibility Criteria Met</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                      {(ELIGIBILITY[trial.id] || []).map((e) => (
                        <span key={e} style={{ fontSize: fontSize.xs, color: colors.green, fontWeight: 500, background: colors.greenGlow, padding: '3px 10px', borderRadius: radius.sm }}>✓ {e}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
