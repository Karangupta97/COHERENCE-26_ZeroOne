// ============================================================
//  KPICard — Key Performance Indicator card
// ============================================================

import { useTheme } from '../../theme';

export default function KPICard({ icon, value, label, delta, deltaType = 'up' }) {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();

    const deltaColor = deltaType === 'up' ? colors.green : colors.red;

    return (
        <div style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: radius.lg,
            padding: spacing.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.sm,
            transition: 'all 0.3s ease',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = colors.shadow || '0 8px 32px rgba(0,0,0,0.2)';
                e.currentTarget.style.borderColor = colors.accent;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = colors.border;
            }}
        >
            {/* Glow accent */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${colors.accent}, ${colors.green})`,
                borderRadius: `${radius.lg} ${radius.lg} 0 0`,
            }} />

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <span style={{ fontSize: '28px' }}>{icon}</span>
                {delta && (
                    <span style={{
                        fontSize: fontSize.xs,
                        fontFamily: fonts.mono,
                        color: deltaColor,
                        fontWeight: 600,
                        background: deltaType === 'up' ? colors.greenGlow : `${colors.red}20`,
                        padding: '2px 8px',
                        borderRadius: radius.full,
                    }}>
                        {deltaType === 'up' ? '↑' : '↓'} {delta}
                    </span>
                )}
            </div>

            <div style={{
                fontSize: fontSize.hero ? fontSize.hero : '42px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 800,
                color: colors.textPrimary,
                lineHeight: 1.1,
                letterSpacing: '-1px',
            }}>
                {value}
            </div>

            <div style={{
                fontSize: fontSize.sm,
                color: colors.textSecondary,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
            }}>
                {label}
            </div>
        </div>
    );
}
