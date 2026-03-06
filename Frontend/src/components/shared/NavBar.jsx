import React from 'react'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { HiOutlineBell, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2'
import UserProfileDropdown from './UserProfileDropdown'

export default function NavBar({ title, titleData, unreadCount, onBellClick, initials = 'PS', onAccountProfile, onSettings, onSignOut }) {
    const { colors, fonts, mode, toggleMode } = useTheme()

    // Support both old string title and new {icon, text} titleData
    const TitleIcon = titleData?.icon
    const titleText = titleData?.text || title || ''

    return (
        <header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: `${spacing.md} ${spacing.xl}`,
                borderBottom: `1px solid ${colors.border}`,
                background: colors.surface,
                fontFamily: fonts.body,
                minHeight: 64,
                position: 'sticky',
                top: 0,
                zIndex: 50,
            }}
        >
            <h1 style={{ margin: 0, fontSize: fontSize.xl, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                {TitleIcon && <TitleIcon style={{ width: 24, height: 24, color: colors.accent }} />}
                {titleText}
            </h1>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                {/* Dark/Light toggle */}
                <button
                    onClick={toggleMode}
                    title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
                    style={{
                        background: colors.card,
                        border: `1px solid ${colors.border}`,
                        borderRadius: radius.full,
                        padding: '5px 12px',
                        cursor: 'pointer',
                        color: colors.textSecondary,
                        fontFamily: fonts.mono || fonts.body,
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {mode === 'dark'
                        ? <><HiOutlineSun style={{ width: 14, height: 14 }} /> Light</>
                        : <><HiOutlineMoon style={{ width: 14, height: 14 }} /> Dark</>
                    }
                </button>

                {/* Notification bell */}
                <button
                    onClick={onBellClick}
                    style={{
                        position: 'relative',
                        background: colors.card,
                        border: `1px solid ${colors.border}`,
                        borderRadius: radius.full,
                        width: 38, height: 38,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        color: colors.textSecondary,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.accent }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border }}
                >
                    <HiOutlineBell style={{ width: 18, height: 18 }} />
                    {(unreadCount || 0) > 0 && (
                        <span style={{
                            position: 'absolute', top: -2, right: -2,
                            width: 16, height: 16, borderRadius: '50%',
                            background: colors.red || '#EF4444', color: '#fff',
                            fontSize: '9px', fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {unreadCount}
                        </span>
                    )}
                </button>

                {/* Profile avatar with dropdown */}
                <UserProfileDropdown
                    initials={initials}
                    onAccountProfile={onAccountProfile}
                    onSettings={onSettings}
                    onSignOut={onSignOut}
                />
            </div>
        </header>
    )
}
