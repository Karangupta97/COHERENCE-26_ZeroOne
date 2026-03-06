// ============================================================
//  FunnelChart — Visual enrollment funnel
// ============================================================

import { useTheme } from '../../theme';

export default function FunnelChart({ data }) {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();
    const maxValue = data.length > 0 ? data[0].value : 1;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {data.map((stage, idx) => {
                const widthPct = (stage.value / maxValue) * 100;
                const dropOff = idx > 0
                    ? (((data[idx - 1].value - stage.value) / data[idx - 1].value) * 100).toFixed(0)
                    : null;

                return (
                    <div key={stage.label}>
                        {/* Drop-off indicator */}
                        {dropOff && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: spacing.sm,
                                padding: `2px 0 2px ${spacing.lg}`,
                                fontSize: fontSize.xs,
                                color: colors.red,
                                fontFamily: fonts.mono,
                                fontWeight: 500,
                            }}>
                                <span style={{
                                    width: '16px',
                                    height: '1px',
                                    background: `${colors.red}60`,
                                }} />
                                ↓ {dropOff}% drop-off
                            </div>
                        )}

                        {/* Bar */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.md,
                        }}>
                            <div style={{
                                width: '130px',
                                minWidth: '130px',
                                fontSize: fontSize.sm,
                                fontWeight: 500,
                                color: colors.textSecondary,
                                textAlign: 'right',
                            }}>
                                {stage.label}
                            </div>

                            <div style={{
                                flex: 1,
                                height: '42px',
                                background: `${colors.border}40`,
                                borderRadius: radius.md,
                                overflow: 'hidden',
                                position: 'relative',
                            }}>
                                <div
                                    style={{
                                        width: `${widthPct}%`,
                                        height: '100%',
                                        background: `linear-gradient(90deg, ${stage.color}, ${stage.color}CC)`,
                                        borderRadius: radius.md,
                                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        paddingLeft: spacing.md,
                                        minWidth: widthPct > 10 ? 'auto' : '50px',
                                    }}
                                >
                                    <span style={{
                                        color: '#fff',
                                        fontSize: fontSize.sm,
                                        fontWeight: 700,
                                        fontFamily: fonts.mono,
                                        textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                                    }}>
                                        {stage.value}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
