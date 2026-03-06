import { useState } from 'react'
import { useTheme, radius, spacing, fontSize, TRIALS } from '../../theme.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { HiOutlineXMark } from 'react-icons/hi2'

const TRIAL_LOCATIONS = [
  { ...TRIALS[0], lat: 19.0760, lng: 72.8777 },
  { ...TRIALS[1], lat: 18.5204, lng: 73.8567 },
  { ...TRIALS[2], lat: 19.0330, lng: 73.0297 },
  { ...TRIALS[3], lat: 19.1136, lng: 72.8697 },
  { ...TRIALS[4], lat: 19.0048, lng: 72.8432 },
]

const ELIGIBILITY = {
  'T-001': ['Age criteria matches', 'Disease stage eligible', 'No excluded medications'],
  'T-002': ['Blood pressure range eligible', 'Age criteria matches', 'No excluded conditions'],
  'T-003': ['BMI within range', 'No conflicting trials', 'Disease stage eligible'],
  'T-004': ['Age criteria matches', 'Neurological assessment cleared'],
  'T-005': ['Cancer stage eligible', 'Age criteria matches', 'Prior treatment compatible'],
}

export default function NearbyTrialsPage() {
  const { colors, fonts } = useTheme()
  const [viewTrial, setViewTrial] = useState(null)

  const cardStyle = {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    boxShadow: colors.shadow,
    padding: spacing.lg,
  }

  const labelStyle = {
    fontSize: fontSize.xs, fontWeight: 600, color: colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: '1px',
    fontFamily: fonts.mono || fonts.body, marginBottom: 4,
  }

  const handleGetDirections = (trial) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${trial.lat},${trial.lng}&travelmode=driving`
    window.open(url, '_blank')
  }

  const handleViewDetails = (trial) => {
    setViewTrial(viewTrial?.id === trial.id ? null : trial)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      {/* Map */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ ...cardStyle, overflow: 'hidden' }}>
        <h2 style={{ margin: `0 0 ${spacing.md}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
          📍 Nearby Clinical Trials Map
        </h2>
        <div style={{ borderRadius: radius.md, overflow: 'hidden', height: 360 }}>
          <MapContainer center={[19.0760, 72.8777]} zoom={10} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {TRIAL_LOCATIONS.map((loc) => (
              <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                <Popup>
                  <div style={{ fontFamily: fonts.body }}>
                    <strong>{loc.name}</strong><br />
                    {loc.sponsor} • {loc.location}<br />
                    Match: {loc.score}% • {loc.slots} slots<br />
                    {loc.compensation}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </motion.div>

      {/* Trial list cards */}
      <h2 style={{ margin: 0, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
        Trials Sorted by Distance
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
        {[...TRIAL_LOCATIONS].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)).map((trial, i) => (
          <motion.div
            key={trial.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${colors.accent}, ${colors.green})` }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
              <span style={{ fontSize: fontSize.base, fontWeight: 700, fontFamily: fonts.heading, color: colors.textPrimary }}>{trial.name}</span>
              <span style={{ fontSize: fontSize.xs, padding: '2px 8px', borderRadius: radius.full, background: colors.greenGlow, color: colors.green, fontWeight: 600 }}>{trial.phase}</span>
            </div>
            <div style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.xs }}>
              🏥 {trial.sponsor}
            </div>
            <div style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.xs }}>
              📍 {trial.location} • <strong style={{ color: colors.accent }}>{trial.distance}</strong> away
            </div>
            <div style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.sm }}>
              🎯 AI Match: <strong style={{ color: trial.score >= 85 ? colors.green : colors.accent }}>{trial.score}%</strong> &nbsp;•&nbsp; 🪑 {trial.slots} slots &nbsp;•&nbsp; 💰 {trial.compensation}
            </div>
            <div style={{ display: 'flex', gap: spacing.xs }}>
              <button
                onClick={() => handleViewDetails(trial)}
                style={{
                  padding: `6px ${spacing.md}`, borderRadius: radius.sm,
                  background: viewTrial?.id === trial.id ? colors.accent : colors.accentGlow,
                  color: viewTrial?.id === trial.id ? '#fff' : colors.accent,
                  border: `1px solid ${colors.accent}40`,
                  fontSize: fontSize.xs, fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {viewTrial?.id === trial.id ? 'Hide Details' : 'View Details'}
              </button>
              <button
                onClick={() => handleGetDirections(trial)}
                style={{
                  padding: `6px ${spacing.md}`, borderRadius: radius.sm,
                  background: colors.green, color: '#fff',
                  border: 'none',
                  fontSize: fontSize.xs, fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                📍 Get Directions
              </button>
            </div>

            {/* Expanded details */}
            <AnimatePresence>
              {viewTrial?.id === trial.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    marginTop: spacing.md, paddingTop: spacing.md,
                    borderTop: `1px solid ${colors.border}`, overflow: 'hidden',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
                    {[
                      ['Sponsor', trial.sponsor],
                      ['Phase', trial.phase],
                      ['Category', trial.category],
                      ['Distance', trial.distance],
                      ['Slots Left', `${trial.slots}`],
                      ['Compensation', trial.compensation],
                      ['Status', trial.status],
                      ['AI Match', `${trial.score}%`],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div style={labelStyle}>{label}</div>
                        <div style={{ fontSize: fontSize.sm, color: colors.textPrimary, fontWeight: 500 }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: spacing.sm }}>
                    <div style={labelStyle}>Eligibility Criteria Met</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs, marginTop: 4 }}>
                      {(ELIGIBILITY[trial.id] || []).map((e) => (
                        <span key={e} style={{ fontSize: '11px', color: colors.green, fontWeight: 500, background: colors.greenGlow, padding: '2px 8px', borderRadius: radius.sm }}>✓ {e}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
