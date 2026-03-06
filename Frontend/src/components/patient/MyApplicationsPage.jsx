import { useState } from 'react'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion } from 'framer-motion'

const APPLICATIONS = [
  { id: 1, trial: 'GLYCO-ADVANCE',  phase: 'Phase III', sponsor: 'Novo Nordisk',   location: 'Mumbai',      status: 'Under Review', date: '01 Mar 2026', score: 94 },
  { id: 2, trial: 'ONCO-TARGET',    phase: 'Phase III', sponsor: 'Tata Memorial',  location: 'Mumbai',      status: 'Approved',     date: '25 Feb 2026', score: 88 },
  { id: 3, trial: 'CARDIO-PROTECT', phase: 'Phase II',  sponsor: 'AstraZeneca',    location: 'Pune',        status: 'Under Review', date: '20 Feb 2026', score: 81 },
  { id: 4, trial: 'META-RESET',     phase: 'Phase II',  sponsor: 'Sun Pharma',     location: 'Navi Mumbai', status: 'Rejected',     date: '15 Feb 2026', score: 73 },
  { id: 5, trial: 'NEURO-SHIELD',   phase: 'Phase I',   sponsor: 'Cipla Research', location: 'Mumbai',      status: 'Under Review', date: '10 Feb 2026', score: 68 },
]

const TABS = ['All', 'Under Review', 'Approved', 'Rejected']

function StatusBadge({ status, colors }) {
  const m = {
    'Approved':     { bg: colors.greenGlow, color: colors.green, icon: '✓' },
    'Rejected':     { bg: `${colors.red}18`, color: colors.red, icon: '✗' },
    'Under Review': { bg: colors.accentGlow, color: colors.accent, icon: '⏳' },
  }
  const c = m[status] || m['Under Review']
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: radius.full, background: c.bg, color: c.color, fontSize: fontSize.xs, fontWeight: 600 }}>
      {c.icon} {status}
    </span>
  )
}

export default function MyApplicationsPage() {
  const { colors, fonts } = useTheme()
  const [tab, setTab] = useState('All')

  const filtered = tab === 'All' ? APPLICATIONS : APPLICATIONS.filter((a) => a.status === tab)

  const cardStyle = { background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.lg, boxShadow: colors.shadow, padding: spacing.lg }
  const headStyle = { fontSize: fontSize.xs, fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '1px', padding: `${spacing.sm} ${spacing.md}`, fontFamily: fonts.mono || fonts.body, textAlign: 'left', borderBottom: `1px solid ${colors.border}` }
  const cellStyle = { fontSize: fontSize.sm, color: colors.textPrimary, padding: spacing.md, fontFamily: fonts.body, borderBottom: `1px solid ${colors.border}` }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.md }}>
        {[
          { label: 'Total Submitted', count: APPLICATIONS.length,                                          color: colors.textPrimary, glow: colors.card,          icon: '📋' },
          { label: 'Under Review',    count: APPLICATIONS.filter((a) => a.status === 'Under Review').length, color: colors.accent,      glow: colors.accentGlow,     icon: '⏳' },
          { label: 'Approved',        count: APPLICATIONS.filter((a) => a.status === 'Approved').length,     color: colors.green,       glow: colors.greenGlow,      icon: '✅' },
          { label: 'Rejected',        count: APPLICATIONS.filter((a) => a.status === 'Rejected').length,     color: colors.red,         glow: `${colors.red}18`,     icon: '❌' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: spacing.md }}
          >
            <div style={{ width: 44, height: 44, borderRadius: radius.md, background: s.glow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, color: s.color, fontFamily: fonts.heading }}>
              {s.count}
            </div>
            <div>
              <div style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary }}>{s.label}</div>
              <div style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>applications</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs + Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg, flexWrap: 'wrap', gap: spacing.sm }}>
          <h2 style={{ margin: 0, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
            📄 My Applications
          </h2>
          <div style={{ display: 'flex', gap: spacing.xs }}>
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  padding: `6px ${spacing.md}`, borderRadius: radius.full, fontSize: fontSize.xs, fontWeight: 600,
                  fontFamily: fonts.body, cursor: 'pointer', transition: 'all 0.2s',
                  border: `1px solid ${tab === t ? colors.accent : colors.border}`,
                  background: tab === t ? colors.accentGlow : 'transparent',
                  color: tab === t ? colors.accent : colors.textSecondary,
                }}
              >{t}</button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: colors.card }}>
                <th style={headStyle}>Trial Name</th>
                <th style={headStyle}>Sponsor</th>
                <th style={headStyle}>Phase</th>
                <th style={headStyle}>Location</th>
                <th style={headStyle}>Match Score</th>
                <th style={headStyle}>Date</th>
                <th style={headStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, i) => (
                <motion.tr key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  style={{ transition: 'background 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.card}80` }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <td style={{ ...cellStyle, fontWeight: 600, fontFamily: fonts.heading }}>{app.trial}</td>
                  <td style={cellStyle}>{app.sponsor}</td>
                  <td style={cellStyle}><span style={{ fontSize: fontSize.xs, background: colors.accentGlow, color: colors.accent, padding: '2px 8px', borderRadius: radius.full, fontWeight: 600 }}>{app.phase}</span></td>
                  <td style={cellStyle}>{app.location}</td>
                  <td style={cellStyle}><strong style={{ color: app.score >= 85 ? colors.green : colors.accent }}>{app.score}%</strong></td>
                  <td style={{ ...cellStyle, color: colors.textSecondary, fontFamily: fonts.mono || fonts.body, fontSize: fontSize.xs }}>{app.date}</td>
                  <td style={cellStyle}><StatusBadge status={app.status} colors={colors} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
