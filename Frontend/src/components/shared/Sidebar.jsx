// ============================================================
//  Sidebar — Clinic Portal Navigation
// ============================================================

import { useTheme } from '../../theme';
import { NOTIFICATIONS } from '../../pages/clinic/data/mockData';

const NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'post-trial', label: 'Post Trial', icon: '📝' },
    { key: 'candidates', label: 'Matched Candidates', icon: '👥' },
    { key: 'workflow', label: 'Candidate Workflow', icon: '🔄' },
    { key: 'funnel', label: 'Enrollment Funnel', icon: '📈' },
    { key: 'trials', label: 'Trials Management', icon: '🧪' },
    { key: 'notifications', label: 'Notifications', icon: '🔔' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar({ activePage, setPage }) {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();
    const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

    return (
        <div style={{
            width: '260px',
            minWidth: '260px',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            background: colors.surface,
            borderRight: `1px solid ${colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 100,
            transition: 'background 0.3s ease, border-color 0.3s ease',
        }}>
            {/* Logo */}
            <div style={{
                padding: `${spacing.lg} ${spacing.lg}`,
                borderBottom: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
            }}>
                <img
                    src="/logo.png"
                    alt="TrialMatch AI"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: radius.md,
                        objectFit: 'contain',
                    }}
                />
                <div>
                    <div style={{
                        fontFamily: fonts.heading,
                        fontSize: fontSize.lg,
                        fontWeight: 800,
                        color: colors.textPrimary,
                        letterSpacing: '-0.5px',
                        lineHeight: 1.2,
                    }}>
                        TrialMatch AI
                    </div>
                    <div style={{
                        fontSize: fontSize.xs,
                        color: colors.textSecondary,
                        fontFamily: fonts.mono,
                        marginTop: '2px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                    }}>
                        Clinic Portal
                    </div>
                </div>
            </div>

            {/* Nav Items */}
            <nav style={{
                flex: 1,
                padding: `${spacing.md} ${spacing.sm}`,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
            }}>
                {NAV_ITEMS.map(item => {
                    const isActive = activePage === item.key;
                    return (
                        <button
                            key={item.key}
                            onClick={() => setPage(item.key)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: spacing.md,
                                padding: `${spacing.sm} ${spacing.md}`,
                                borderRadius: radius.md,
                                border: 'none',
                                background: isActive ? colors.accentGlow : 'transparent',
                                color: isActive ? colors.accent : colors.textSecondary,
                                fontFamily: fonts.body,
                                fontSize: fontSize.sm,
                                fontWeight: isActive ? 600 : 400,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                width: '100%',
                                textAlign: 'left',
                                position: 'relative',
                                borderLeft: isActive ? `3px solid ${colors.accent}` : '3px solid transparent',
                            }}
                            onMouseEnter={e => {
                                if (!isActive) {
                                    e.currentTarget.style.background = `${colors.accent}11`;
                                    e.currentTarget.style.color = colors.textPrimary;
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = colors.textSecondary;
                                }
                            }}
                        >
                            <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{item.icon}</span>
                            <span style={{ flex: 1 }}>{item.label}</span>
                            {item.key === 'notifications' && unreadCount > 0 && (
                                <span style={{
                                    background: colors.red,
                                    color: '#fff',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    borderRadius: radius.full,
                                    padding: '2px 7px',
                                    minWidth: '18px',
                                    textAlign: 'center',
                                    lineHeight: '14px',
                                }}>
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* User Profile at Bottom */}
            <div style={{
                padding: spacing.lg,
                borderTop: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
            }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: radius.full,
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#fff',
                }}>
                    PS
                </div>
                <div>
                    <div style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary }}>
                        Dr. Priya Sharma
                    </div>
                    <div style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>
                        Lead Investigator
                    </div>
                </div>
            </div>
        </div>
    );
}
