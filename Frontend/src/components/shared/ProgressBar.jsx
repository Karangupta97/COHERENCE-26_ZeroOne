// ============================================================
//  ProgressBar — Horizontal progress indicator
// ============================================================

import { useTheme } from '../../theme';

export default function ProgressBar({ value, max, label, showPercentage = true, color, height = '8px' }) {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    const barColor = color || colors.accent;

    return (
        <div style={{ width: '100%' }}>
            {(label || showPercentage) && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px',
                }}>
                    {label && (
                        <span style={{
                            fontSize: fontSize.xs,
                            color: colors.textSecondary,
                            fontWeight: 500,
                        }}>
                            {label}
                        </span>
                    )}
                    {showPercentage && (
                        <span style={{
                            fontSize: fontSize.xs,
                            fontFamily: fonts.mono,
                            color: colors.textSecondary,
                            fontWeight: 600,
                        }}>
                            {value}/{max} ({pct.toFixed(0)}%)
                        </span>
                    )}
                </div>
            )}
            <div style={{
                width: '100%',
                height,
                background: `${colors.border}60`,
                borderRadius: radius.full,
                overflow: 'hidden',
            }}>
                <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${barColor}, ${barColor}CC)`,
                    borderRadius: radius.full,
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                }} />
            </div>
        </div>
    );
}
