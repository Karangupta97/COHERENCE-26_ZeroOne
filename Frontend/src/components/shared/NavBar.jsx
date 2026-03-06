// ============================================================
//  NavBar — Top navigation bar for Clinic Portal
// ============================================================

import { useTheme, ThemeSwitcher } from '../../theme';

export default function NavBar({ title, unreadCount = 0, onBellClick }) {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${spacing.md} ${spacing.xl}`,
            background: colors.surface,
            borderBottom: `1px solid ${colors.border}`,
            position: 'sticky',
            top: 0,
            zIndex: 50,
            backdropFilter: 'blur(12px)',
            transition: 'background 0.3s ease, border-color 0.3s ease',
        }}>
            {/* Page Title */}
            <h1 style={{
                fontFamily: fonts.heading,
                fontSize: fontSize.xl,
                fontWeight: 700,
                color: colors.textPrimary,
                margin: 0,
            }}>
                {title}
            </h1>

            {/* Right Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
                <ThemeSwitcher />

                {/* Notification Bell */}
                <button
                    onClick={onBellClick}
                    style={{
                        position: 'relative',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '20px',
                        padding: spacing.sm,
                        borderRadius: radius.md,
                        transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = colors.accentGlow}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    🔔
                    {unreadCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            background: colors.red,
                            color: '#fff',
                            fontSize: '9px',
                            fontWeight: 700,
                            borderRadius: radius.full,
                            padding: '1px 5px',
                            minWidth: '16px',
                            textAlign: 'center',
                            lineHeight: '14px',
                        }}>
                            {unreadCount}
                        </span>
                    )}
                </button>

                {/* User Avatar */}
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: radius.full,
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#fff',
                    cursor: 'pointer',
                }}>
                    PS
                </div>
            </div>
        </div>
    );
}
