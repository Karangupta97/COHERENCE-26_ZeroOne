import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion } from 'framer-motion'

const APPLICATIONS = [
  { id: 1, trial: 'GLYCO-ADVANCE',  phase: 'Phase III', location: 'Mumbai',      status: 'Under Review', date: '01 Mar 2026' },
  { id: 2, trial: 'ONCO-TARGET',    phase: 'Phase III', location: 'Mumbai',      status: 'Approved',     date: '25 Feb 2026' },
  { id: 3, trial: 'CARDIO-PROTECT', phase: 'Phase II',  location: 'Pune',        status: 'Under Review', date: '20 Feb 2026' },
  { id: 4, trial: 'META-RESET',     phase: 'Phase II',  location: 'Navi Mumbai', status: 'Rejected',     date: '15 Feb 2026' },
  { id: 5, trial: 'NEURO-SHIELD',   phase: 'Phase I',   location: 'Mumbai',      status: 'Under Review', date: '10 Feb 2026' },
]

function StatusBadge({ status, colors }) {
  const config = {
    'Approved':     { bg: colors.greenGlow, color: colors.green, icon: '✓' },
    'Rejected':     { bg: `${colors.red}18`, color: colors.red, icon: '✗' },
    'Under Review': { bg: colors.accentGlow, color: colors.accent, icon: '⏳' },
  }
  const c = config[status] || config['Under Review']
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: radius.full,
      background: c.bg, color: c.color,
      fontSize: fontSize.xs, fontWeight: 600,
    }}>
      {c.icon} {status}
    </span>
  )
}

export default function MyApplications() {
  const { colors, fonts } = useTheme()

  const headerStyle = {
    fontSize: fontSize.xs, fontWeight: 600, color: colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: '1px',
    padding: `${spacing.sm} ${spacing.md}`,
    fontFamily: fonts.mono || fonts.body,
    textAlign: 'left',
    borderBottom: `1px solid ${colors.border}`,
  }
  const cellStyle = {
    fontSize: fontSize.sm, color: colors.textPrimary,
    padding: `${spacing.md}`,
    fontFamily: fonts.body,
    borderBottom: `1px solid ${colors.border}`,
  }

  return (
    <div style={{
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: radius.lg,
      boxShadow: colors.shadow,
      padding: spacing.lg,
      overflow: 'hidden',
    }}>
      <h2 style={{ margin: `0 0 ${spacing.lg}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
        📄 My Applications
      </h2>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: colors.card }}>
              <th style={headerStyle}>Trial Name</th>
              <th style={headerStyle}>Phase</th>
              <th style={headerStyle}>Location</th>
              <th style={headerStyle}>Date</th>
              <th style={headerStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {APPLICATIONS.map((app, i) => (
              <motion.tr
                key={app.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{ transition: 'background 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.card}80` }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <td style={{ ...cellStyle, fontWeight: 600, fontFamily: fonts.heading }}>{app.trial}</td>
                <td style={cellStyle}>
                  <span style={{ fontSize: fontSize.xs, background: colors.accentGlow, color: colors.accent, padding: '2px 8px', borderRadius: radius.full, fontWeight: 600 }}>
                    {app.phase}
                  </span>
                </td>
                <td style={cellStyle}>{app.location}</td>
                <td style={{ ...cellStyle, color: colors.textSecondary, fontFamily: fonts.mono || fonts.body, fontSize: fontSize.xs }}>{app.date}</td>
                <td style={cellStyle}><StatusBadge status={app.status} colors={colors} /></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
