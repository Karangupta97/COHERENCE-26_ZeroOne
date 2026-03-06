// ============================================================
//  Toast — Slide-in notification with auto-dismiss
// ============================================================

import { useState, useEffect } from 'react';
import { useTheme } from '../../theme';

const VARIANTS = {
    success: { icon: '✅', bgKey: 'greenGlow', colorKey: 'green' },
    error: { icon: '❌', bgKey: 'red', colorKey: 'red' },
    info: { icon: 'ℹ️', bgKey: 'accentGlow', colorKey: 'accent' },
};

export default function Toast({ message, variant = 'success', isVisible, onClose, duration = 3000 }) {
    const { colors, radius, fontSize, spacing, fonts } = useTheme();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(() => onClose && onClose(), 300);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible && !show) return null;

    const v = VARIANTS[variant] || VARIANTS.info;

    return (
        <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 2000,
            background: colors.surface,
            border: `1px solid ${colors[v.colorKey]}40`,
            borderRadius: radius.lg,
            padding: `${spacing.md} ${spacing.lg}`,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
            boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
            transform: show ? 'translateX(0)' : 'translateX(120%)',
            opacity: show ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            maxWidth: '400px',
        }}>
            <span style={{ fontSize: '18px' }}>{v.icon}</span>
            <span style={{
                fontSize: fontSize.sm,
                color: colors.textPrimary,
                fontFamily: fonts.body,
                fontWeight: 500,
                flex: 1,
            }}>
                {message}
            </span>
            <button
                onClick={() => { setShow(false); setTimeout(() => onClose && onClose(), 300); }}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: colors.textSecondary,
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '2px',
                    lineHeight: 1,
                }}
            >
                ×
            </button>
        </div>
    );
}
