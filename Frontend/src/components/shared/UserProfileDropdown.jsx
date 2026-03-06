import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { HiOutlineUserCircle, HiOutlineCog6Tooth, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'

const MENU_ITEMS = [
    { label: 'Account Profile', icon: HiOutlineUserCircle, key: 'profile' },
    { label: 'Settings', icon: HiOutlineCog6Tooth, key: 'settings' },
]

export default function UserProfileDropdown({
    initials = 'PS',
    onAccountProfile,
    onSettings,
    onSignOut,
}) {
    const { colors, fonts } = useTheme()
    const [open, setOpen] = useState(false)

    const handleItemClick = (key) => {
        if (key === 'profile') onAccountProfile?.()
        else if (key === 'settings') onSettings?.()
        else if (key === 'signout') onSignOut?.()
        setOpen(false)
    }

    return (
        <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {/* Avatar trigger */}
            <div
                style={{
                    width: 38,
                    height: 38,
                    borderRadius: radius.full,
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: fontSize.sm,
                    fontWeight: 700,
                    fontFamily: fonts.heading,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            >
                {initials}
            </div>

            {/* Invisible bridge — full dropdown width so cursor can move to any item without closing */}
            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        width: 220,
                        height: 14,
                        zIndex: 99,
                    }}
                />
            )}

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 12px)',
                            right: 0,
                            minWidth: 220,
                            background: colors.surface,
                            border: `1px solid ${colors.border}`,
                            borderRadius: radius.lg,
                            boxShadow: `0 12px 40px rgba(0,0,0,0.25), 0 0 1px ${colors.border}`,
                            padding: spacing.sm,
                            zIndex: 100,
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        {MENU_ITEMS.map(({ label, icon: Icon, key }) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => handleItemClick(key)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: '10px 14px',
                                    border: 'none',
                                    background: 'transparent',
                                    borderRadius: radius.sm,
                                    color: colors.textPrimary,
                                    fontFamily: fonts.body,
                                    fontSize: fontSize.sm,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = colors.card
                                    e.currentTarget.style.color = colors.textPrimary
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent'
                                    e.currentTarget.style.color = colors.textPrimary
                                }}
                            >
                                <Icon style={{ width: 18, height: 18, color: colors.accent, flexShrink: 0 }} />
                                {label}
                            </button>
                        ))}
                        <div style={{ height: 1, background: colors.border, margin: `${spacing.xs} 0` }} />
                        <button
                            type="button"
                            onClick={() => handleItemClick('signout')}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '10px 14px',
                                border: 'none',
                                background: 'transparent',
                                borderRadius: radius.sm,
                                color: colors.red || '#EF4444',
                                fontFamily: fonts.body,
                                fontSize: fontSize.sm,
                                fontWeight: 500,
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = `${colors.red || '#EF4444'}12`
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent'
                            }}
                        >
                            <HiOutlineArrowRightOnRectangle style={{ width: 18, height: 18, flexShrink: 0 }} />
                            Sign Out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
