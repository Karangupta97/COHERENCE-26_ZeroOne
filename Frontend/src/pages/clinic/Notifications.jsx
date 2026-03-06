// ============================================================
//  Notifications — Notification center
// ============================================================

import { useState } from 'react';
import { useTheme } from '../../theme';
import { NOTIFICATIONS } from './data/mockData';

const TYPE_ICONS = {
    match: '🔗',
    approval: '✅',
    schedule: '📅',
    enrolled: '🎉',
};

export default function Notifications() {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();
    const [notifications, setNotifications] = useState(NOTIFICATIONS);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const toggleRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
    };

    return (
        <div style={{ padding: spacing.xl, display: 'flex', flexDirection: 'column', gap: spacing.lg, animation: 'fadeInUp 0.4s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, margin: 0 }}>
                    {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
                {unreadCount > 0 && (
                    <button onClick={markAllRead} style={{
                        padding: `${spacing.sm} ${spacing.lg}`, background: colors.accentGlow,
                        color: colors.accent, border: `1px solid ${colors.accent}30`,
                        borderRadius: radius.md, fontSize: fontSize.sm, fontWeight: 600,
                        cursor: 'pointer', fontFamily: fonts.body,
                    }}>
                        ✓ Mark all as read
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {notifications.map(n => (
                    <div key={n.id} onClick={() => toggleRead(n.id)} style={{
                        display: 'flex', alignItems: 'center', gap: spacing.md,
                        padding: spacing.md, borderRadius: radius.lg,
                        background: n.read ? 'transparent' : colors.accentGlow,
                        border: `1px solid ${n.read ? colors.border : `${colors.accent}30`}`,
                        cursor: 'pointer', transition: 'all 0.2s ease',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; }}
                    >
                        {/* Unread dot */}
                        <div style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: n.read ? 'transparent' : colors.accent,
                            flexShrink: 0,
                        }} />

                        {/* Icon */}
                        <span style={{ fontSize: '22px', width: '30px', textAlign: 'center' }}>
                            {TYPE_ICONS[n.type] || '📢'}
                        </span>

                        {/* Content */}
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: fontSize.sm, color: colors.textPrimary,
                                fontWeight: n.read ? 400 : 600,
                            }}>
                                {n.message}
                            </div>
                        </div>

                        {/* Time */}
                        <span style={{
                            fontSize: fontSize.xs, color: colors.textSecondary,
                            fontFamily: fonts.mono, whiteSpace: 'nowrap',
                        }}>
                            {n.time}
                        </span>
                    </div>
                ))}
            </div>

            <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
}

