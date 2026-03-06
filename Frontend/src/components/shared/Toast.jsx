import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useTheme } from '../../theme';

const ToastContext = createContext(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
    return ctx;
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, exiting: false }]);
        setTimeout(() => {
            setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 300);
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts }) {
    const { colors, fonts } = useTheme();

    const typeConfig = {
        success: { icon: '✅', border: colors.green },
        error: { icon: '❌', border: colors.red },
        info: { icon: 'ℹ️', border: colors.accent },
        warning: { icon: '⚠️', border: colors.yellow },
    };

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
            top: '80px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        }}>
            {toasts.map(toast => {
                const cfg = typeConfig[toast.type] || typeConfig.success;
                return (
                    <div
                        key={toast.id}
                        className={toast.exiting ? 'toast-exit' : 'toast-enter'}
                        style={{
                            background: colors.surface,
                            border: `1px solid ${colors.border}`,
                            borderLeft: `4px solid ${cfg.border}`,
                            borderRadius: '10px',
                            padding: '14px 20px',
                            boxShadow: colors.shadow,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            minWidth: '280px',
                            fontFamily: fonts.body,
                            fontSize: '14px',
                            color: colors.textPrimary,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>{cfg.icon}</span>
                        {toast.message}
                    </div>
                );
            })}
        </div>
    );
}
