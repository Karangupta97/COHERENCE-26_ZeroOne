import { useState, useEffect, useCallback } from 'react'
import { useTheme, radius, spacing, fontSize } from '../../theme.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import useClinic from '../../hooks/useClinic'
import {
    HiOutlineUserCircle,
    HiOutlinePencilSquare,
    HiOutlineShieldCheck,
    HiOutlineCheckCircle,
    HiOutlineXMark,
    HiOutlineBuildingOffice2,
    HiOutlineMapPin,
} from 'react-icons/hi2'

export default function ClinicProfilePage() {
    const { colors, fonts } = useTheme()
    const { clinic } = useClinic()

    const buildProfile = useCallback((c) => ({
        clinicName: c?.clinicName || `${c?.firstName || ''} ${c?.lastName || ''}`.trim() || 'Clinic',
        firstName: c?.firstName || '',
        lastName: c?.lastName || '',
        email: c?.email || '',
        phone: c?.phone || '',
        address: c?.address || '',
        city: c?.city || '',
        state: c?.state || '',
    }), [])

    const [editing, setEditing] = useState(false)
    const [profile, setProfile] = useState(() => buildProfile(clinic))
    const [savedProfile, setSavedProfile] = useState(() => buildProfile(clinic))
    const [saveToast, setSaveToast] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (clinic) {
            const fresh = buildProfile(clinic)
            setProfile(fresh)
            setSavedProfile(fresh)
        }
    }, [clinic, buildProfile])

    const handleEditToggle = () => {
        if (editing) setProfile({ ...savedProfile })
        setEditing(!editing)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem('token')
            const payload = {
                clinicName: profile.clinicName,
                firstName: profile.firstName,
                lastName: profile.lastName,
                phone: profile.phone,
                address: profile.address,
                city: profile.city,
                state: profile.state,
            }

            const res = await fetch('/api/profile/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            const data = await res.json()
            if (data.ok) {
                localStorage.setItem('user', JSON.stringify(data.user))
                setSavedProfile({ ...profile })
                setEditing(false)
                setSaveToast(true)
                setTimeout(() => setSaveToast(false), 3000)
            } else {
                setSaveToast('error')
                setTimeout(() => setSaveToast(false), 3000)
            }
        } catch {
            setSaveToast('error')
            setTimeout(() => setSaveToast(false), 3000)
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (field, value) => {
        setProfile({ ...profile, [field]: value })
    }

    const cardStyle = {
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.lg,
        boxShadow: colors.shadow,
        padding: spacing.lg,
    }

    const labelStyle = {
        fontSize: fontSize.xs, fontWeight: 600, color: colors.textSecondary,
        textTransform: 'uppercase', letterSpacing: '1px',
        fontFamily: fonts.mono || fonts.body, marginBottom: 4,
    }

    const valueStyle = {
        fontSize: fontSize.base, fontWeight: 500, color: colors.textPrimary,
        fontFamily: fonts.body,
    }

    const inputStyle = {
        width: '100%', padding: '8px 10px', borderRadius: radius.sm,
        border: `1px solid ${colors.accent}40`, background: colors.card,
        color: colors.textPrimary, fontSize: fontSize.sm, fontFamily: fonts.body,
        outline: 'none', transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    }

    const renderField = (label, field, readOnly = false) => (
        <div key={field}>
            <div style={labelStyle}>{label}</div>
            {editing && !readOnly ? (
                <input
                    value={profile[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    style={inputStyle}
                />
            ) : (
                <div style={valueStyle}>{profile[field] || '—'}</div>
            )}
        </div>
    )

    const initials = profile.clinicName
        ? profile.clinicName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
        : `${(profile.firstName || '')[0] || ''}${(profile.lastName || '')[0] || ''}`.toUpperCase() || 'CL'

    const locationStr = [profile.city, profile.state].filter(Boolean).join(', ') || '—'

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, position: 'relative' }}>
            <AnimatePresence>
                {saveToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            position: 'fixed', top: 80, right: 32, zIndex: 100,
                            background: saveToast === 'error' ? (colors.red || '#EF4444') : colors.green,
                            color: '#fff', padding: `${spacing.sm} ${spacing.lg}`,
                            borderRadius: radius.md, fontSize: fontSize.sm, fontWeight: 600,
                            fontFamily: fonts.body, display: 'flex', alignItems: 'center', gap: spacing.sm,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        }}
                    >
                        <HiOutlineCheckCircle style={{ width: 18, height: 18 }} />
                        {saveToast === 'error' ? 'Failed to save profile!' : 'Profile saved successfully!'}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    ...cardStyle,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xl,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, height: 4,
                        background: `linear-gradient(90deg, ${colors.accent}, ${colors.green})`,
                    }}
                />
                <div
                    style={{
                        width: 80, height: 80, borderRadius: radius.full,
                        background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '28px', fontWeight: 800,
                        fontFamily: fonts.heading, flexShrink: 0,
                    }}
                >
                    {initials}
                </div>
                <div style={{ flex: 1 }}>
                    <h2
                        style={{
                            margin: 0,
                            fontSize: fontSize.xxl,
                            fontFamily: fonts.heading,
                            fontWeight: 700,
                            color: colors.textPrimary,
                        }}
                    >
                        {profile.clinicName}
                    </h2>
                    <p
                        style={{
                            margin: '4px 0 0',
                            fontSize: fontSize.sm,
                            color: colors.textSecondary,
                            fontFamily: fonts.body,
                        }}
                    >
                        <HiOutlineMapPin style={{ width: 14, height: 14, display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                        {locationStr}
                    </p>
                    {profile.email && (
                        <p
                            style={{
                                margin: '2px 0 0',
                                fontSize: fontSize.xs,
                                color: colors.textSecondary,
                                fontFamily: fonts.body,
                                opacity: 0.9,
                            }}
                        >
                            {profile.email}
                        </p>
                    )}
                </div>
                <div style={{ display: 'flex', gap: spacing.sm, flexShrink: 0 }}>
                    {editing && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: `8px ${spacing.md}`, borderRadius: radius.sm,
                                background: colors.green, color: '#fff',
                                border: 'none', fontSize: fontSize.sm, fontWeight: 600,
                                fontFamily: fonts.body,
                                cursor: saving ? 'not-allowed' : 'pointer',
                                opacity: saving ? 0.7 : 1,
                            }}
                        >
                            <HiOutlineCheckCircle style={{ width: 16, height: 16 }} />
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    )}
                    <button
                        onClick={handleEditToggle}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: `8px ${spacing.md}`, borderRadius: radius.sm,
                            background: editing ? `${colors.red}18` : colors.accentGlow,
                            color: editing ? colors.red : colors.accent,
                            border: `1px solid ${editing ? `${colors.red}40` : `${colors.accent}40`}`,
                            fontSize: fontSize.sm, fontWeight: 600,
                            fontFamily: fonts.body, cursor: 'pointer',
                        }}
                    >
                        {editing ? (
                            <><HiOutlineXMark style={{ width: 16, height: 16 }} /> Cancel</>
                        ) : (
                            <><HiOutlinePencilSquare style={{ width: 16, height: 16 }} /> Edit Profile</>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={cardStyle}
                >
                    <h3
                        style={{
                            margin: `0 0 ${spacing.lg}`,
                            fontSize: fontSize.lg,
                            fontFamily: fonts.heading,
                            fontWeight: 700,
                            color: colors.textPrimary,
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.sm,
                        }}
                    >
                        <HiOutlineBuildingOffice2 style={{ width: 20, height: 20, color: colors.accent }} />
                        Clinic Information
                    </h3>
                    {editing && (
                        <div
                            style={{
                                background: colors.accentGlow,
                                borderRadius: radius.sm,
                                padding: `${spacing.xs} ${spacing.sm}`,
                                marginBottom: spacing.md,
                                fontSize: fontSize.xs,
                                color: colors.accent,
                                fontWeight: 500,
                            }}
                        >
                            Edit fields below, then click Save
                        </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                        {renderField('Clinic Name', 'clinicName')}
                        {renderField('Contact First Name', 'firstName')}
                        {renderField('Contact Last Name', 'lastName')}
                        {renderField('Email', 'email', true)}
                        {renderField('Phone', 'phone')}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    style={cardStyle}
                >
                    <h3
                        style={{
                            margin: `0 0 ${spacing.lg}`,
                            fontSize: fontSize.lg,
                            fontFamily: fonts.heading,
                            fontWeight: 700,
                            color: colors.textPrimary,
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.sm,
                        }}
                    >
                        <HiOutlineMapPin style={{ width: 20, height: 20, color: colors.green }} />
                        Location
                    </h3>
                    {editing && (
                        <div
                            style={{
                                background: colors.greenGlow,
                                borderRadius: radius.sm,
                                padding: `${spacing.xs} ${spacing.sm}`,
                                marginBottom: spacing.md,
                                fontSize: fontSize.xs,
                                color: colors.green,
                                fontWeight: 500,
                            }}
                        >
                            Edit fields below, then click Save
                        </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                        {renderField('Address', 'address')}
                        {renderField('City', 'city')}
                        {renderField('State', 'state')}
                    </div>
                </motion.div>
            </div>

            {/* Privacy & Consent */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={cardStyle}
            >
                <h3
                    style={{
                        margin: `0 0 ${spacing.md}`,
                        fontSize: fontSize.lg,
                        fontFamily: fonts.heading,
                        fontWeight: 700,
                        color: colors.textPrimary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.sm,
                    }}
                >
                    <HiOutlineShieldCheck style={{ width: 20, height: 20, color: colors.green }} />
                    Privacy & Data
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {[
                        'Candidate data handled in compliance with HIPAA',
                        'Trial and enrollment data used only for matching',
                        'No data shared without appropriate consent',
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                            <div
                                style={{
                                    width: 18, height: 18, borderRadius: 4,
                                    background: colors.green,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontSize: '11px', fontWeight: 700,
                                    flexShrink: 0,
                                }}
                            >
                                ✓
                            </div>
                            <span style={{ fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: fonts.body }}>
                                {item}
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
