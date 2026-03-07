import { useState, useEffect } from 'react'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiOutlineEye, HiOutlinePaperAirplane, HiOutlineXMark, HiOutlineCheckCircle,
  HiOutlineSparkles, HiOutlineMapPin, HiOutlineBanknotes, HiOutlineClipboardDocumentList,
  HiOutlineExclamationTriangle, HiOutlineArrowPath,
} from 'react-icons/hi2'

function ScoreRing({ score, size = 48, strokeWidth = 4, colors }) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const scoreColor = score >= 60 ? colors.green : score >= 40 ? (colors.yellow || '#F59E0B') : colors.red

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

function EligibilityBadge({ eligible, colors, fonts }) {
  const config = {
    Eligible: { bg: colors.greenGlow, color: colors.green, label: 'Eligible' },
    'Partially Eligible': { bg: `${colors.yellow || '#F59E0B'}20`, color: colors.yellow || '#F59E0B', label: 'Partial Match' },
    'Not Eligible': { bg: `${colors.red}20`, color: colors.red, label: 'Not Eligible' },
  }
  const c = config[eligible] || config['Not Eligible']
  return (
    <span style={{
      fontSize: fontSize.xs, fontWeight: 600, padding: '2px 8px',
      borderRadius: radius.full, background: c.bg, color: c.color,
      fontFamily: fonts.mono || fonts.body,
    }}>
      {c.label}
    </span>
  )
}

export default function RecommendedTrials() {
  const { colors, fonts } = useTheme()
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewTrial, setViewTrial] = useState(null)
  const [appliedTrials, setAppliedTrials] = useState({})
  const [applyToast, setApplyToast] = useState(null)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/matching/my-matches', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch matches')
      const data = await res.json()
      if (data.ok) {
        setMatches(data.data)
      } else {
        throw new Error(data.message || 'Unknown error')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (trial) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/enrollments/apply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trialId: trial.trialId,
          matchScore: trial.score,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Application failed')
      setAppliedTrials({ ...appliedTrials, [trial.trialId]: true })
      setApplyToast(trial.trialName)
      setTimeout(() => setApplyToast(null), 3000)
    } catch (err) {
      setApplyToast(null)
      setError(err.message)
    }
  }

  const displayTrials = matches.slice(0, 6)

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
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <button
            onClick={fetchMatches}
            disabled={loading}
            style={{
              padding: `6px ${spacing.md}`, borderRadius: radius.sm,
              background: colors.card, color: colors.textSecondary,
              border: `1px solid ${colors.border}`, fontSize: fontSize.xs, fontWeight: 600,
              fontFamily: fonts.body, cursor: loading ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <HiOutlineArrowPath style={{ width: 14, height: 14, animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
          </button>
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
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: spacing.xl, color: colors.textSecondary, fontFamily: fonts.body }}>
          <HiOutlineArrowPath style={{ width: 28, height: 28, animation: 'spin 1s linear infinite', marginBottom: spacing.sm }} />
          <div style={{ fontSize: fontSize.sm }}>Analyzing your profile against available trials...</div>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div style={{
          textAlign: 'center', padding: spacing.xl, color: colors.red, fontFamily: fonts.body,
          background: `${colors.red}10`, borderRadius: radius.md, border: `1px solid ${colors.red}30`,
        }}>
          <HiOutlineExclamationTriangle style={{ width: 28, height: 28, marginBottom: spacing.sm }} />
          <div style={{ fontSize: fontSize.sm, marginBottom: spacing.sm }}>{error}</div>
          <button onClick={fetchMatches} style={{
            padding: `6px ${spacing.md}`, borderRadius: radius.sm,
            background: colors.red, color: '#fff', border: 'none',
            fontSize: fontSize.xs, fontWeight: 600, cursor: 'pointer', fontFamily: fonts.body,
          }}>
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && matches.length === 0 && (
        <div style={{ textAlign: 'center', padding: spacing.xl, color: colors.textSecondary, fontFamily: fonts.body }}>
          <div style={{ fontSize: fontSize.base, marginBottom: spacing.xs }}>No matching trials found</div>
          <div style={{ fontSize: fontSize.sm }}>Check back later as new trials are added regularly.</div>
        </div>
      )}

      {/* Match results */}
      {!loading && !error && displayTrials.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          {displayTrials.map((trial, i) => (
            <div key={trial.trialId}>
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                style={{
                  background: colors.card,
                  border: `1px solid ${viewTrial?.trialId === trial.trialId ? colors.accent : colors.border}`,
                  borderRadius: viewTrial?.trialId === trial.trialId ? `${radius.md} ${radius.md} 0 0` : radius.md,
                  padding: spacing.md,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing.md,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => setViewTrial(viewTrial?.trialId === trial.trialId ? null : trial)}
                onMouseEnter={(e) => { if (viewTrial?.trialId !== trial.trialId) e.currentTarget.style.borderColor = colors.accent }}
                onMouseLeave={(e) => { if (viewTrial?.trialId !== trial.trialId) e.currentTarget.style.borderColor = colors.border }}
              >
                {/* Score Ring */}
                <ScoreRing score={trial.score} colors={colors} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: fontSize.base, fontWeight: 700, fontFamily: fonts.heading, color: colors.textPrimary }}>
                      {trial.trialName}
                    </span>
                    {trial.phase && (
                      <span style={{
                        fontSize: fontSize.xs, fontWeight: 600, padding: '2px 8px',
                        borderRadius: radius.full, background: colors.greenGlow, color: colors.green,
                        fontFamily: fonts.mono || fonts.body,
                      }}>
                        {trial.phase}
                      </span>
                    )}
                    <EligibilityBadge eligible={trial.eligible} colors={colors} fonts={fonts} />
                  </div>

                  <div style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4, fontFamily: fonts.body, display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                    <HiOutlineMapPin style={{ width: 14, height: 14, flexShrink: 0 }} /> {trial.hospital || trial.location || 'Location TBD'} {trial.location && trial.hospital ? `• ${trial.location}` : ''} {trial.category ? `• ${trial.category}` : ''}
                  </div>

                  {/* Top eligibility reasons (passed only) */}
                  <div style={{ marginTop: spacing.sm, display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                    {trial.reasons.filter(r => r.passed).slice(0, 3).map((r, idx) => (
                      <span key={idx} style={{
                        fontSize: '11px', color: colors.green, fontWeight: 500,
                        background: colors.greenGlow, padding: '2px 8px',
                        borderRadius: radius.sm, fontFamily: fonts.body,
                      }}>
                        ✓ {r.text}
                      </span>
                    ))}
                    {trial.reasons.filter(r => !r.passed).length > 0 && (
                      <span style={{
                        fontSize: '11px', color: colors.red, fontWeight: 500,
                        background: `${colors.red}15`, padding: '2px 8px',
                        borderRadius: radius.sm, fontFamily: fonts.body,
                      }}>
                        ✗ {trial.reasons.filter(r => !r.passed).length} criteria not met
                      </span>
                    )}
                  </div>

                  {/* Compensation & Slots */}
                  <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs, display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                    {trial.compensation && <><HiOutlineBanknotes style={{ width: 14, height: 14, flexShrink: 0 }} /> {trial.compensation} •</>}
                    {trial.slots != null && <span>{trial.slots - (trial.enrolled || 0)} slots remaining</span>}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setViewTrial(viewTrial?.trialId === trial.trialId ? null : trial)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: `6px ${spacing.md}`, borderRadius: radius.sm,
                      background: viewTrial?.trialId === trial.trialId ? colors.accent : colors.accentGlow,
                      color: viewTrial?.trialId === trial.trialId ? '#fff' : colors.accent,
                      border: `1px solid ${colors.accent}40`, fontSize: fontSize.xs, fontWeight: 600,
                      fontFamily: fonts.body, cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <HiOutlineEye style={{ width: 14, height: 14 }} /> {viewTrial?.trialId === trial.trialId ? 'Hide' : 'View'}
                  </button>
                  {trial.eligible !== 'Not Eligible' && (
                    <button
                      onClick={() => handleApply(trial)}
                      disabled={appliedTrials[trial.trialId]}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: `6px ${spacing.md}`, borderRadius: radius.sm,
                        background: appliedTrials[trial.trialId] ? colors.green : colors.accent,
                        color: '#fff',
                        border: 'none', fontSize: fontSize.xs, fontWeight: 600,
                        fontFamily: fonts.body, cursor: appliedTrials[trial.trialId] ? 'default' : 'pointer',
                        transition: 'all 0.2s', opacity: appliedTrials[trial.trialId] ? 0.8 : 1,
                      }}
                    >
                      {appliedTrials[trial.trialId]
                        ? <><HiOutlineCheckCircle style={{ width: 14, height: 14 }} /> Applied</>
                        : <><HiOutlinePaperAirplane style={{ width: 14, height: 14 }} /> Apply</>
                      }
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Inline detail panel */}
              <AnimatePresence>
                {viewTrial?.trialId === trial.trialId && (
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
                        <HiOutlineClipboardDocumentList style={{ width: 20, height: 20, color: colors.accent }} /> {trial.trialName} — Details
                      </h3>
                      <button onClick={() => setViewTrial(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textSecondary }}>
                        <HiOutlineXMark style={{ width: 20, height: 20 }} />
                      </button>
                    </div>

                    {/* Trial info grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing.md, marginBottom: spacing.lg }}>
                      {[
                        ['Trial Code', trial.trialCode],
                        ['Phase', trial.phase],
                        ['Category', trial.category],
                        ['Location', trial.location],
                        ['Hospital', trial.hospital],
                        ['Drug', trial.drug],
                        ['Slots Left', trial.slots != null ? `${trial.slots - (trial.enrolled || 0)}` : 'N/A'],
                        ['Compensation', trial.compensation || 'N/A'],
                        ['Status', trial.status],
                        ['AI Match', `${trial.score}%`],
                        ['Eligibility', trial.eligible],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: fonts.mono || fonts.body }}>{label}</div>
                          <div style={{ fontSize: fontSize.sm, color: colors.textPrimary, fontWeight: 500, marginTop: 2 }}>{value || '—'}</div>
                        </div>
                      ))}
                    </div>

                    {trial.description && (
                      <div style={{ marginBottom: spacing.lg }}>
                        <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: spacing.xs, fontFamily: fonts.mono || fonts.body }}>Description</div>
                        <div style={{ fontSize: fontSize.sm, color: colors.textPrimary, lineHeight: 1.6, fontFamily: fonts.body }}>{trial.description}</div>
                      </div>
                    )}

                    {/* Symptoms & Required Conditions */}
                    {(trial.symptoms?.length > 0 || trial.requiredConditions?.length > 0) && (
                      <div style={{ marginBottom: spacing.lg, display: 'flex', gap: spacing.lg, flexWrap: 'wrap' }}>
                        {trial.symptoms?.length > 0 && (
                          <div style={{ flex: 1, minWidth: 200 }}>
                            <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: spacing.xs, fontFamily: fonts.mono || fonts.body }}>Symptoms</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {trial.symptoms.map((s, idx) => (
                                <span key={idx} style={{ fontSize: fontSize.xs, padding: '3px 10px', borderRadius: radius.full, background: `${colors.yellow || '#F59E0B'}15`, color: colors.yellow || '#F59E0B', fontWeight: 500, fontFamily: fonts.body }}>{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {trial.requiredConditions?.length > 0 && (
                          <div style={{ flex: 1, minWidth: 200 }}>
                            <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: spacing.xs, fontFamily: fonts.mono || fonts.body }}>Required Conditions</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {trial.requiredConditions.map((c, idx) => (
                                <span key={idx} style={{ fontSize: fontSize.xs, padding: '3px 10px', borderRadius: radius.full, background: colors.accentGlow, color: colors.accent, fontWeight: 500, fontFamily: fonts.body }}>{c}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Detailed matching breakdown */}
                    <div>
                      <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: spacing.sm, fontFamily: fonts.mono || fonts.body }}>Matching Breakdown</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        {trial.reasons.map((reason, idx) => (
                          <div key={idx} style={{
                            display: 'flex', alignItems: 'center', gap: spacing.sm,
                            padding: `${spacing.xs} ${spacing.sm}`,
                            background: reason.passed ? colors.greenGlow : `${colors.red}10`,
                            borderRadius: radius.sm,
                            border: `1px solid ${reason.passed ? `${colors.green}30` : `${colors.red}20`}`,
                          }}>
                            <span style={{ fontSize: fontSize.sm, flexShrink: 0, width: 18, textAlign: 'center' }}>
                              {reason.passed ? '✓' : '✗'}
                            </span>
                            <span style={{
                              fontSize: fontSize.xs, fontWeight: 500,
                              color: reason.passed ? colors.green : colors.red,
                              fontFamily: fonts.body,
                              textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8,
                              minWidth: 70,
                            }}>
                              {reason.type}
                            </span>
                            <span style={{ fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: fonts.body }}>
                              {reason.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Apply Button */}
                    {trial.eligible !== 'Not Eligible' && (
                      <div style={{ marginTop: spacing.lg, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: spacing.md }}>
                        {appliedTrials[trial.trialId] ? (
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: spacing.sm,
                            padding: `10px ${spacing.xl}`, borderRadius: radius.md,
                            background: colors.greenGlow, border: `1px solid ${colors.green}40`,
                            fontSize: fontSize.sm, fontWeight: 700, color: colors.green,
                            fontFamily: fonts.body,
                          }}>
                            <HiOutlineCheckCircle style={{ width: 18, height: 18 }} /> Application Submitted
                          </div>
                        ) : (
                          <button
                            onClick={() => handleApply(trial)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: spacing.sm,
                              padding: `12px ${spacing.xl}`, borderRadius: radius.md,
                              background: `linear-gradient(135deg, ${colors.accent}, ${colors.green || colors.accent}CC)`,
                              color: '#fff', border: 'none',
                              fontSize: fontSize.sm, fontWeight: 700,
                              fontFamily: fonts.body, cursor: 'pointer',
                              boxShadow: `0 4px 16px ${colors.accent}40`,
                              transition: 'transform 0.15s, box-shadow 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 24px ${colors.accent}50` }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 16px ${colors.accent}40` }}
                          >
                            <HiOutlinePaperAirplane style={{ width: 18, height: 18 }} /> Apply for this Trial
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* Inline spin animation */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
