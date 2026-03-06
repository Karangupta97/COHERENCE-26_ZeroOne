// ============================================================
//  Modal — Reusable overlay modal dialog
// ============================================================

import { useEffect } from 'react';
import { useTheme } from '../../theme';

export default function Modal({ isOpen, onClose, title, children, width = '600px' }) {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: spacing.xl,
                animation: 'fadeIn 0.2s ease',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                    borderRadius: radius.xl,
                    width: '100%',
                    maxWidth: width,
                    maxHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: `0 24px 80px rgba(0,0,0,0.5)`,
                    animation: 'slideUp 0.3s ease',
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: `${spacing.lg} ${spacing.xl}`,
                    borderBottom: `1px solid ${colors.border}`,
                }}>
                    <h2 style={{
                        fontFamily: fonts.heading,
                        fontSize: fontSize.lg,
                        fontWeight: 700,
                        color: colors.textPrimary,
                        margin: 0,
                    }}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: colors.textSecondary,
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: spacing.xs,
                            borderRadius: radius.sm,
                            lineHeight: 1,
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = `${colors.red}20`;
                            e.currentTarget.style.color = colors.red;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = colors.textSecondary;
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Content — scrollable */}
                <div style={{
                    padding: spacing.xl,
                    overflowY: 'auto',
                    flex: 1,
                }}>
                    {children}
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </div>
    );
}
