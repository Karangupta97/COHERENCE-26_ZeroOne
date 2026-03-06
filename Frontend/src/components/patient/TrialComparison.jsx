import { useState } from 'react'
import { useTheme, radius, spacing, fontSize, TRIALS } from '../../theme.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineXMark } from 'react-icons/hi2'

export default function TrialComparison() {
  const { colors, fonts } = useTheme()
  const [selected, setSelected] = useState([])
  const [showCompare, setShowCompare] = useState(false)

  const toggle = (trial) => {
    if (selected.find(s => s.id === trial.id)) {
      setSelected(selected.filter(s => s.id !== trial.id))
    } else if (selected.length < 3) {
      setSelected([...selected, trial])
    }
  }

  const FIELDS = [
    { key: 'score',        label: 'AI Match Score', fmt: (v) => `${v}%` },
    { key: 'phase',        label: 'Phase' },
    { key: 'sponsor',      label: 'Sponsor' },
    { key: 'category',     label: 'Category' },
    { key: 'location',     label: 'Location' },
    { key: 'distance',     label: 'Distance' },
    { key: 'slots',        label: 'Slots Left', fmt: (v) => `${v}` },
    { key: 'compensation', label: 'Compensation' },
    { key: 'status',       label: 'Status' },
  ]

  const getBest = (key) => {
    if (selected.length < 2) return null
    if (key === 'score' || key === 'slots') return selected.reduce((a, b) => a[key] > b[key] ? a : b).id
    if (key === 'distance') return selected.reduce((a, b) => parseFloat(a.distance) < parseFloat(b.distance) ? a : b).id
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
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
          ⚖️ Compare Trials
        </h2>
        {selected.length >= 2 && (
          <button
            onClick={() => setShowCompare(!showCompare)}
            style={{
              padding: `6px ${spacing.md}`, borderRadius: radius.sm,
              background: showCompare ? colors.green : colors.accent,
              color: '#fff', border: 'none',
              fontSize: fontSize.xs, fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
            }}
          >
            {showCompare ? '✕ Close' : `Compare ${selected.length} Trials`}
          </button>
        )}
      </div>

      {/* Trial selector chips */}
      <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap', marginBottom: spacing.sm }}>
        {TRIALS.map((trial) => {
          const isSelected = selected.find(s => s.id === trial.id)
          return (
            <button
              key={trial.id}
              onClick={() => toggle(trial)}
              style={{
                padding: `6px ${spacing.md}`, borderRadius: radius.full,
                background: isSelected ? colors.accent : 'transparent',
                color: isSelected ? '#fff' : colors.textSecondary,
                border: `1px solid ${isSelected ? colors.accent : colors.border}`,
                fontSize: fontSize.xs, fontWeight: 600, fontFamily: fonts.body,
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              {isSelected && '✓'} {trial.name}
              <span style={{
                fontSize: '10px', fontWeight: 700, padding: '1px 6px',
                borderRadius: radius.full,
                background: isSelected ? 'rgba(255,255,255,0.25)' : colors.greenGlow,
                color: isSelected ? '#fff' : colors.green,
              }}>
                {trial.score}%
              </span>
            </button>
          )
        })}
      </div>
      <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginBottom: spacing.md }}>
        Select 2-3 trials to compare • {selected.length}/3 selected
      </div>

      {/* Comparison table */}
      <AnimatePresence>
        {showCompare && selected.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: colors.card }}>
                    <th style={{ padding: spacing.md, textAlign: 'left', fontSize: fontSize.xs, fontWeight: 600, color: colors.textSecondary, borderBottom: `1px solid ${colors.border}`, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: fonts.mono || fonts.body }}>
                      Criteria
                    </th>
                    {selected.map((trial) => (
                      <th key={trial.id} style={{ padding: spacing.md, textAlign: 'center', fontSize: fontSize.sm, fontWeight: 700, color: colors.textPrimary, borderBottom: `1px solid ${colors.border}`, fontFamily: fonts.heading, minWidth: 140 }}>
                        <div>{trial.name}</div>
                        <div style={{ fontSize: fontSize.xs, fontWeight: 500, color: colors.textSecondary, marginTop: 2 }}>{trial.phase}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FIELDS.map((field) => {
                    const bestId = getBest(field.key)
                    return (
                      <tr key={field.key}>
                        <td style={{ padding: `${spacing.sm} ${spacing.md}`, fontSize: fontSize.sm, fontWeight: 600, color: colors.textSecondary, borderBottom: `1px solid ${colors.border}`, fontFamily: fonts.body }}>
                          {field.label}
                        </td>
                        {selected.map((trial) => {
                          const val = field.fmt ? field.fmt(trial[field.key]) : trial[field.key]
                          const isBest = bestId === trial.id
                          return (
                            <td key={trial.id} style={{
                              padding: `${spacing.sm} ${spacing.md}`, textAlign: 'center',
                              fontSize: fontSize.sm, fontWeight: isBest ? 700 : 500,
                              color: isBest ? colors.green : colors.textPrimary,
                              borderBottom: `1px solid ${colors.border}`,
                              background: isBest ? colors.greenGlow : 'transparent',
                              fontFamily: fonts.body,
                            }}>
                              {isBest && '🏆 '}{val}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Recommendation */}
            <div style={{
              marginTop: spacing.md, padding: spacing.md,
              background: colors.greenGlow, borderRadius: radius.sm,
              borderLeft: `3px solid ${colors.green}`,
              display: 'flex', alignItems: 'center', gap: spacing.sm,
            }}>
              <span style={{ fontSize: '20px' }}>🤖</span>
              <div>
                <div style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.green, marginBottom: 2 }}>AI Recommendation</div>
                <div style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>
                  Based on your profile, <strong style={{ color: colors.textPrimary }}>{selected.sort((a, b) => b.score - a.score)[0].name}</strong> is your best match with a {selected.sort((a, b) => b.score - a.score)[0].score}% compatibility score.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
