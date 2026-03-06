// ============================================================
//  ClinicDashboard — Main dashboard page
// ============================================================

import { useTheme } from '../../theme';
import KPICard from '../../components/shared/KPICard';
import ProgressBar from '../../components/shared/ProgressBar';
import StatusBadge from '../../components/shared/StatusBadge';
import { CLINIC, CLINIC_TRIALS, CANDIDATES, RECENT_ACTIVITY, AI_INSIGHTS } from './data/mockData';

export default function ClinicDashboard({ setPage }) {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();

    const totalMatches = CANDIDATES.length;
    const doctorApproved = CANDIDATES.filter(c => c.doctorStatus === 'Approved').length;
    const enrolled = CANDIDATES.filter(c => c.stage === 'Enrolled').length;
    const activeTrials = CLINIC_TRIALS.filter(t => t.status !== 'Completed').length;

    const cardStyle = {
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.lg,
        padding: spacing.lg,
        transition: 'all 0.3s ease',
    };

    return (
        <div style={{
            padding: spacing.xl,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.xl,
            animation: 'fadeInUp 0.4s ease',
        }}>
            {/* Clinic Info + KPIs Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
                {/* Clinic Info Card */}
                <div style={cardStyle}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.lg,
                    }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: radius.xl,
                            background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                        }}>
                            🏥
                        </div>
                        <div>
                            <h2 style={{
                                fontFamily: fonts.heading,
                                fontSize: fontSize.lg,
                                fontWeight: 700,
                                color: colors.textPrimary,
                                margin: 0,
                            }}>
                                {CLINIC.name}
                            </h2>
                            <div style={{
                                fontSize: fontSize.sm,
                                color: colors.textSecondary,
                                marginTop: '4px',
                                display: 'flex',
                                gap: spacing.lg,
                            }}>
                                <span>📍 {CLINIC.location}</span>
                                <span>👩‍⚕️ {CLINIC.leadDoctor}</span>
                                <span>🧪 {activeTrials} Active Trials</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={{
                    ...cardStyle,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.md,
                }}>
                    <span style={{ fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: 500, marginRight: spacing.sm }}>
                        Quick Actions
                    </span>
                    {[
                        { label: 'Post Trial', icon: '📝', page: 'post-trial' },
                        { label: 'View Funnel', icon: '📈', page: 'funnel' },
                        { label: 'View Candidates', icon: '👥', page: 'candidates' },
                    ].map(btn => (
                        <button
                            key={btn.page}
                            onClick={() => setPage(btn.page)}
                            style={{
                                background: colors.accentGlow,
                                color: colors.accent,
                                border: `1px solid ${colors.accent}30`,
                                borderRadius: radius.md,
                                padding: `${spacing.sm} ${spacing.md}`,
                                fontSize: fontSize.sm,
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: fonts.body,
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: spacing.xs,
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = colors.accent;
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = colors.accentGlow;
                                e.currentTarget.style.color = colors.accent;
                            }}
                        >
                            <span>{btn.icon}</span> {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.lg }}>
                <KPICard icon="🧪" value={activeTrials} label="Active Trials" delta="12%" deltaType="up" />
                <KPICard icon="🔗" value={totalMatches} label="Total Matches" delta="23%" deltaType="up" />
                <KPICard icon="✅" value={doctorApproved} label="Doctor Approved" delta="8%" deltaType="up" />
                <KPICard icon="🎯" value={enrolled} label="Enrolled Patients" delta="5%" deltaType="up" />
            </div>

            {/* Main Content Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
                {/* Recent Activity */}
                <div style={cardStyle}>
                    <h3 style={{
                        fontFamily: fonts.heading,
                        fontSize: fontSize.lg,
                        fontWeight: 700,
                        color: colors.textPrimary,
                        margin: `0 0 ${spacing.md} 0`,
                    }}>
                        📋 Recent Activity
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                        {RECENT_ACTIVITY.map(item => (
                            <div key={item.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: spacing.md,
                                padding: spacing.sm,
                                borderRadius: radius.md,
                                transition: 'background 0.2s ease',
                                cursor: 'default',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = `${colors.accent}08`}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <span style={{ fontSize: '20px', width: '28px', textAlign: 'center' }}>{item.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary }}>
                                        {item.action}
                                    </div>
                                    <div style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>
                                        {item.detail}
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: fontSize.xs,
                                    color: colors.textSecondary,
                                    fontFamily: fonts.mono,
                                    whiteSpace: 'nowrap',
                                }}>
                                    {item.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Insights */}
                <div style={cardStyle}>
                    <h3 style={{
                        fontFamily: fonts.heading,
                        fontSize: fontSize.lg,
                        fontWeight: 700,
                        color: colors.textPrimary,
                        margin: `0 0 ${spacing.md} 0`,
                    }}>
                        🤖 AI Insights
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                        {AI_INSIGHTS.map(insight => {
                            const borderColor = insight.type === 'warning' ? colors.yellow
                                : insight.type === 'success' ? colors.green : colors.accent;
                            return (
                                <div key={insight.id} style={{
                                    padding: spacing.md,
                                    borderRadius: radius.md,
                                    border: `1px solid ${borderColor}30`,
                                    background: `${borderColor}08`,
                                    borderLeft: `3px solid ${borderColor}`,
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: spacing.sm,
                                        marginBottom: '4px',
                                    }}>
                                        <span>{insight.icon}</span>
                                        <span style={{
                                            fontSize: fontSize.sm,
                                            fontWeight: 700,
                                            color: colors.textPrimary,
                                        }}>
                                            {insight.title}
                                        </span>
                                    </div>
                                    <p style={{
                                        fontSize: fontSize.xs,
                                        color: colors.textSecondary,
                                        margin: 0,
                                        lineHeight: 1.5,
                                    }}>
                                        {insight.message}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Active Trials Overview */}
            <div style={cardStyle}>
                <h3 style={{
                    fontFamily: fonts.heading,
                    fontSize: fontSize.lg,
                    fontWeight: 700,
                    color: colors.textPrimary,
                    margin: `0 0 ${spacing.lg} 0`,
                }}>
                    🧪 Active Trials Overview
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
                    {CLINIC_TRIALS.filter(t => t.status !== 'Completed').map(trial => (
                        <div key={trial.id} style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 100px 100px 1fr',
                            gap: spacing.lg,
                            alignItems: 'center',
                            padding: `${spacing.sm} 0`,
                            borderBottom: `1px solid ${colors.border}40`,
                        }}>
                            <div>
                                <div style={{
                                    fontSize: fontSize.sm,
                                    fontWeight: 600,
                                    color: colors.textPrimary,
                                }}>
                                    {trial.name}
                                </div>
                                <div style={{
                                    fontSize: fontSize.xs,
                                    color: colors.textSecondary,
                                    marginTop: '2px',
                                }}>
                                    {trial.id} • {trial.location}
                                </div>
                            </div>
                            <StatusBadge status={trial.phase} />
                            <StatusBadge status={trial.status} />
                            <ProgressBar
                                value={trial.enrolled}
                                max={trial.target}
                                color={colors.accent}
                                height="6px"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}

