import { useState, useMemo } from 'react'
import { useTheme, radius, spacing, fontSize, TRIALS } from '../../theme.jsx'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineEye,
  HiOutlinePaperAirplane,
  HiOutlineArrowsUpDown,
  HiOutlineCheckCircle,
} from 'react-icons/hi2'

const CATEGORIES = ['All', 'Endocrinology', 'Cardiology', 'Metabolic', 'Neurology', 'Oncology']
const SORT_OPTIONS = [
  { key: 'bestMatch',    label: '🎯 Best Match' },
  { key: 'nearest',      label: '📍 Nearest First' },
  { key: 'mostSlots',    label: '🪑 Most Slots' },
  { key: 'nameAZ',       label: '🔤 Name A‑Z' },
]
const DISTANCE_FILTERS = [
  { key: 'all',   label: 'Any Distance' },
  { key: '10',    label: '< 10 km' },
  { key: '25',    label: '< 25 km' },
  { key: '50',    label: '< 50 km' },
]

function ScoreBar({ score, colors, fonts }) {
  const barColor = score >= 85 ? colors.green : score >= 70 ? colors.accent : (colors.yellow || '#F59E0B')
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, width: '100%' }}>
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: colors.border }}>
        <div style={{ width: `${score}%`, height: '100%', borderRadius: 3, background: barColor, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: fontSize.xs, fontWeight: 700, color: barColor, fontFamily: fonts?.mono || 'monospace', minWidth: 36 }}>{score}%</span>
    </div>
  )
}

function RankBadge({ rank, colors, fonts }) {
  const bg = rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : colors.accentGlow
  const color = rank <= 3 ? '#000' : colors.accent
  return (
    <div style={{
      width: 28, height: 28, borderRadius: radius.full, background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '12px', fontWeight: 800, color, fontFamily: fonts.heading,
      flexShrink: 0, boxShadow: rank <= 3 ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
    }}>
      #{rank}
    </div>
  )
}

export default function FindTrialsPage() {
  const { colors, fonts } = useTheme()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('bestMatch')
  const [distanceFilter, setDistanceFilter] = useState('all')
  const [appliedTrials, setAppliedTrials] = useState({})
  const [applyToast, setApplyToast] = useState(null)

  const handleApply = (trial) => {
    setAppliedTrials({ ...appliedTrials, [trial.id]: true })
    setApplyToast(trial.name)
    setTimeout(() => setApplyToast(null), 3000)
  }

  // Filter + Sort with useMemo for performance
  const results = useMemo(() => {
    let list = TRIALS.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.sponsor.toLowerCase().includes(search.toLowerCase())
      const matchesCat = category === 'All' || t.category === category
      const dist = parseFloat(t.distance)
      const matchesDist = distanceFilter === 'all' || dist <= parseInt(distanceFilter)
      return matchesSearch && matchesCat && matchesDist
    })

    // Sort
    switch (sortBy) {
      case 'bestMatch':
        list = [...list].sort((a, b) => b.score - a.score)
        break
      case 'nearest':
        list = [...list].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        break
      case 'mostSlots':
        list = [...list].sort((a, b) => b.slots - a.slots)
        break
      case 'nameAZ':
        list = [...list].sort((a, b) => a.name.localeCompare(b.name))
        break
    }
    return list
  }, [search, category, sortBy, distanceFilter])

  const cardStyle = {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    boxShadow: colors.shadow,
    padding: spacing.lg,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, position: 'relative' }}>
      {/* Toast */}
      {applyToast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ position: 'fixed', top: 80, right: 32, zIndex: 100, background: colors.green, color: '#fff', padding: `${spacing.sm} ${spacing.lg}`, borderRadius: radius.md, fontSize: fontSize.sm, fontWeight: 600, fontFamily: fonts.body, display: 'flex', alignItems: 'center', gap: spacing.sm, boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
        >
          <HiOutlineCheckCircle style={{ width: 18, height: 18 }} /> Applied to {applyToast}!
        </motion.div>
      )}

      {/* Search + Filters */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
        {/* Row 1: Search */}
        <div style={{ position: 'relative', marginBottom: spacing.md }}>
          <HiOutlineMagnifyingGlass style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: colors.textSecondary }} />
          <input
            type="text"
            placeholder="Search trials by name, sponsor, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 40px', boxSizing: 'border-box',
              borderRadius: radius.md, border: `1px solid ${colors.border}`,
              background: colors.card, color: colors.textPrimary,
              fontSize: fontSize.sm, fontFamily: fonts.body, outline: 'none',
            }}
          />
        </div>

        {/* Row 2: Category filters */}
        <div style={{ display: 'flex', gap: spacing.xs, alignItems: 'center', flexWrap: 'wrap', marginBottom: spacing.md }}>
          <HiOutlineAdjustmentsHorizontal style={{ width: 16, height: 16, color: colors.textSecondary, flexShrink: 0 }} />
          <span style={{ fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: 600, marginRight: 4 }}>Category:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '4px 12px', borderRadius: radius.full,
                fontSize: fontSize.xs, fontWeight: 600, fontFamily: fonts.body,
                border: `1px solid ${category === cat ? colors.accent : colors.border}`,
                background: category === cat ? colors.accentGlow : 'transparent',
                color: category === cat ? colors.accent : colors.textSecondary,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Row 3: Sort + Distance filter */}
        <div style={{ display: 'flex', gap: spacing.lg, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Sort */}
          <div style={{ display: 'flex', gap: spacing.xs, alignItems: 'center', flexWrap: 'wrap' }}>
            <HiOutlineArrowsUpDown style={{ width: 16, height: 16, color: colors.textSecondary, flexShrink: 0 }} />
            <span style={{ fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: 600, marginRight: 4 }}>Sort:</span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                style={{
                  padding: '4px 12px', borderRadius: radius.full,
                  fontSize: fontSize.xs, fontWeight: 600, fontFamily: fonts.body,
                  border: `1px solid ${sortBy === opt.key ? colors.green : colors.border}`,
                  background: sortBy === opt.key ? colors.greenGlow : 'transparent',
                  color: sortBy === opt.key ? colors.green : colors.textSecondary,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Distance */}
          <div style={{ display: 'flex', gap: spacing.xs, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: 600, marginRight: 4 }}>📏 Distance:</span>
            {DISTANCE_FILTERS.map((df) => (
              <button
                key={df.key}
                onClick={() => setDistanceFilter(df.key)}
                style={{
                  padding: '4px 12px', borderRadius: radius.full,
                  fontSize: fontSize.xs, fontWeight: 600, fontFamily: fonts.body,
                  border: `1px solid ${distanceFilter === df.key ? colors.accent : colors.border}`,
                  background: distanceFilter === df.key ? colors.accentGlow : 'transparent',
                  color: distanceFilter === df.key ? colors.accent : colors.textSecondary,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {df.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Results count */}
      <div style={{ fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.body, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
        Showing <strong style={{ color: colors.textPrimary }}>{results.length}</strong> clinical trials
        <span style={{ fontSize: fontSize.xs, padding: '2px 10px', borderRadius: radius.full, background: colors.greenGlow, color: colors.green, fontWeight: 600 }}>
          Sorted by: {SORT_OPTIONS.find(s => s.key === sortBy)?.label}
        </span>
        {distanceFilter !== 'all' && (
          <span style={{ fontSize: fontSize.xs, padding: '2px 10px', borderRadius: radius.full, background: colors.accentGlow, color: colors.accent, fontWeight: 600 }}>
            Within {distanceFilter} km
          </span>
        )}
      </div>

      {/* Trial Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {results.map((trial, i) => (
          <motion.div
            key={trial.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.accent }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: trial.score >= 85 ? colors.green : colors.accent, borderRadius: `${radius.lg} 0 0 ${radius.lg}` }} />

            <div style={{ display: 'flex', gap: spacing.lg, alignItems: 'flex-start', paddingLeft: spacing.sm }}>
              {/* Rank badge */}
              <RankBadge rank={i + 1} colors={colors} fonts={fonts} />

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap', marginBottom: spacing.sm }}>
                  <span style={{ fontSize: fontSize.lg, fontWeight: 700, fontFamily: fonts.heading, color: colors.textPrimary }}>{trial.name}</span>
                  <span style={{ fontSize: fontSize.xs, padding: '2px 8px', borderRadius: radius.full, background: colors.greenGlow, color: colors.green, fontWeight: 600 }}>{trial.phase}</span>
                  <span style={{ fontSize: fontSize.xs, padding: '2px 8px', borderRadius: radius.full, background: colors.accentGlow, color: colors.accent, fontWeight: 600 }}>{trial.status}</span>
                  <span style={{ fontSize: fontSize.xs, padding: '2px 8px', borderRadius: radius.full, background: `${colors.border}`, color: colors.textSecondary, fontWeight: 500 }}>{trial.category}</span>
                </div>

                <div style={{ fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.body, marginBottom: spacing.sm }}>
                  🏥 {trial.sponsor} &nbsp;•&nbsp; 📍 {trial.location} &nbsp;•&nbsp; 📏 {trial.distance} &nbsp;•&nbsp; 💰 {trial.compensation}
                </div>

                <div style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.sm }}>
                  🪑 <strong style={{ color: colors.textPrimary }}>{trial.slots}</strong> slots remaining
                </div>

                {/* AI Match Score */}
                <div style={{ maxWidth: 300 }}>
                  <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginBottom: 4, fontWeight: 600 }}>AI Match Score</div>
                  <ScoreBar score={trial.score} colors={colors} fonts={fonts} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, flexShrink: 0 }}>
                <button
                  onClick={() => navigate('/patient/nearby')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: `8px ${spacing.lg}`, borderRadius: radius.sm,
                    background: colors.accentGlow, color: colors.accent,
                    border: `1px solid ${colors.accent}40`, fontSize: fontSize.sm, fontWeight: 600,
                    fontFamily: fonts.body, cursor: 'pointer',
                  }}
                >
                  <HiOutlineEye style={{ width: 16, height: 16 }} /> View Details
                </button>
                <button
                  onClick={() => handleApply(trial)}
                  disabled={appliedTrials[trial.id]}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: `8px ${spacing.lg}`, borderRadius: radius.sm,
                    background: appliedTrials[trial.id] ? colors.green : colors.accent,
                    color: '#fff',
                    border: 'none', fontSize: fontSize.sm, fontWeight: 600,
                    fontFamily: fonts.body,
                    cursor: appliedTrials[trial.id] ? 'default' : 'pointer',
                    opacity: appliedTrials[trial.id] ? 0.8 : 1,
                  }}
                >
                  {appliedTrials[trial.id]
                    ? <><HiOutlineCheckCircle style={{ width: 16, height: 16 }} /> Applied</>
                    : <><HiOutlinePaperAirplane style={{ width: 16, height: 16 }} /> Apply Now</>
                  }
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {results.length === 0 && (
          <div style={{ ...cardStyle, textAlign: 'center', padding: spacing.xxl }}>
            <p style={{ fontSize: fontSize.lg, color: colors.textSecondary, margin: 0 }}>No trials found matching your filters.</p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); setDistanceFilter('all'); setSortBy('bestMatch') }}
              style={{
                marginTop: spacing.md, padding: `8px ${spacing.xl}`, borderRadius: radius.sm,
                background: colors.accent, color: '#fff', border: 'none',
                fontSize: fontSize.sm, fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
