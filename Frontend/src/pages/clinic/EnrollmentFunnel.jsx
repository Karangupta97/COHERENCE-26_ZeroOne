// ============================================================
//  EnrollmentFunnel — Funnel visualization + insights
// ============================================================

import { useTheme } from '../../theme';
import FunnelChart from '../../components/shared/FunnelChart';
import ProgressBar from '../../components/shared/ProgressBar';
import { FUNNEL_DATA, AI_INSIGHTS } from './data/mockData';

export default function EnrollmentFunnel() {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();
    const enrolled = FUNNEL_DATA[FUNNEL_DATA.length - 1].value;
    const target = 50;
    const pct = ((enrolled / target) * 100).toFixed(0);
    const weeksRemaining = Math.ceil((target - enrolled) / 2);

    const cardStyle = {
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.lg,
        padding: spacing.lg,
    };

    return (
        <div style={{ padding: spacing.xl, display: 'flex', flexDirection: 'column', gap: spacing.lg, animation: 'fadeInUp 0.4s ease' }}>

            {/* Funnel Chart */}
            <div style={cardStyle}>
                <h3 style={{ fontFamily: fonts.heading, fontSize: fontSize.lg, fontWeight: 700, color: colors.textPrimary, margin: `0 0 ${spacing.lg}` }}>
                    Pipeline Overview — GLYCO-ADVANCE
                </h3>
                <FunnelChart data={FUNNEL_DATA} />
            </div>

            {/* Progress + ETA */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
                <div style={cardStyle}>
                    <h3 style={{ fontFamily: fonts.heading, fontSize: fontSize.base, fontWeight: 700, color: colors.textPrimary, margin: `0 0 ${spacing.md}` }}>
                        🎯 Enrollment Target
                    </h3>
                    <ProgressBar value={enrolled} max={target} color={colors.accent} height="12px" />
                    <div style={{ marginTop: spacing.md, fontSize: fontSize.sm, color: colors.textSecondary }}>
                        <span style={{ fontFamily: fonts.mono, fontWeight: 700, color: colors.accent, fontSize: fontSize.lg }}>{pct}%</span> of target reached
                    </div>
                </div>

                <div style={cardStyle}>
                    <h3 style={{ fontFamily: fonts.heading, fontSize: fontSize.base, fontWeight: 700, color: colors.textPrimary, margin: `0 0 ${spacing.md}` }}>
                        ⏱️ Estimated Completion
                    </h3>
                    <div style={{ fontSize: fontSize.hero || '42px', fontFamily: fonts.heading, fontWeight: 800, color: colors.accent }}>
                        ~{weeksRemaining} weeks
                    </div>
                    <div style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>
                        At current enrollment rate of ~2 patients/week
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            <div style={cardStyle}>
                <h3 style={{ fontFamily: fonts.heading, fontSize: fontSize.lg, fontWeight: 700, color: colors.textPrimary, margin: `0 0 ${spacing.md}` }}>
                    🤖 AI Insights
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                    {AI_INSIGHTS.map(insight => {
                        const borderColor = insight.type === 'warning' ? colors.yellow : insight.type === 'success' ? colors.green : colors.accent;
                        return (
                            <div key={insight.id} style={{
                                padding: spacing.md, borderRadius: radius.md,
                                border: `1px solid ${borderColor}30`, background: `${borderColor}08`,
                                borderLeft: `3px solid ${borderColor}`,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: '4px' }}>
                                    <span>{insight.icon}</span>
                                    <span style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.textPrimary }}>{insight.title}</span>
                                </div>
                                <p style={{ fontSize: fontSize.xs, color: colors.textSecondary, margin: 0, lineHeight: 1.5 }}>{insight.message}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
}

