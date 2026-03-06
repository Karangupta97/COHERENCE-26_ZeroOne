import React, { useState } from 'react';
import { useTheme } from '../../theme';
import { ThemeSwitcher } from '../../theme';
import DoctorLayout from '../../components/shared/DoctorLayout';
import { motion } from 'framer-motion';
import {
    HiOutlinePaintBrush,
    HiOutlineBell,
    HiOutlineShieldCheck,
    HiOutlineUserCircle,
    HiOutlineBeaker,
    HiOutlineChatBubbleLeftRight,
    HiOutlineKey,
    HiOutlineArrowDownTray,
    HiOutlineTrash,
} from 'react-icons/hi2';

function ToggleSwitch({ on, onToggle, colors }) {
    return (
        <button onClick={onToggle} style={{
            width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
            background: on ? colors.green : colors.border, position: 'relative', transition: 'background 0.25s',
            padding: 0, flexShrink: 0,
        }}>
            <div style={{
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3, left: on ? 22 : 4, transition: 'left 0.25s ease',
                boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
            }} />
        </button>
    )
}

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function DoctorSettings() {
    const { colors, fonts } = useTheme();
    const [settings, setSettings] = useState({
        emailNotif: true,
        pushNotif: true,
        smsNotif: false,
        dataSharing: true,
        aiAnalysis: true,
        twoFactor: false,
        autoApprove: false,
        chatAutoReply: true,
    });

    const toggle = (key) => setSettings({ ...settings, [key]: !settings[key] });

    const card = {
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        boxShadow: colors.shadow,
        padding: '24px',
    };

    const sectionTitle = (IconComp, title, iconBg) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '20px' }}>
            <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: iconBg || colors.accentGlow,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <IconComp style={{ width: 18, height: 18, color: colors.accent }} />
            </div>
            <h3 style={{ margin: 0, fontSize: '16px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                {title}
            </h3>
        </div>
    );

    const settingRow = (label, desc, key, isLast) => (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 0',
            borderBottom: isLast ? 'none' : `1px solid ${colors.border}`,
        }}>
            <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>{label}</div>
                <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: 3, fontFamily: fonts.body }}>{desc}</div>
            </div>
            <ToggleSwitch on={settings[key]} onToggle={() => toggle(key)} colors={colors} />
        </div>
    );

    return (
        <DoctorLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: 800 }}>
                {/* Appearance */}
                <motion.div {...fadeUp} transition={{ duration: 0.3 }} style={card}>
                    {sectionTitle(HiOutlinePaintBrush, 'Appearance')}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>Theme & Mode</div>
                            <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: 3, fontFamily: fonts.body }}>Choose your preferred color theme and dark/light mode</div>
                        </div>
                        <ThemeSwitcher />
                    </div>
                </motion.div>

                {/* Notifications */}
                <motion.div {...fadeUp} transition={{ delay: 0.05 }} style={card}>
                    {sectionTitle(HiOutlineBell, 'Notifications')}
                    {settingRow('Email Notifications', 'Receive patient match updates and trial status via email', 'emailNotif')}
                    {settingRow('Push Notifications', 'Get instant push notifications for important updates', 'pushNotif')}
                    {settingRow('SMS Alerts', 'Receive SMS alerts for urgent patient notifications', 'smsNotif', true)}
                </motion.div>

                {/* Privacy & Security */}
                <motion.div {...fadeUp} transition={{ delay: 0.1 }} style={card}>
                    {sectionTitle(HiOutlineShieldCheck, 'Privacy & Security', colors.greenGlow)}
                    {settingRow('Data Sharing', 'Allow sharing patient data with matched clinical trial sites', 'dataSharing')}
                    {settingRow('AI Analysis', 'Allow AI to analyze patient profiles for better trial matching', 'aiAnalysis')}
                    {settingRow('Two-Factor Authentication', 'Add an extra layer of security to your account', 'twoFactor', true)}
                </motion.div>

                {/* Trial Settings */}
                <motion.div {...fadeUp} transition={{ delay: 0.15 }} style={card}>
                    {sectionTitle(HiOutlineBeaker, 'Trial Preferences')}
                    {settingRow('Auto-Approve High Score', 'Automatically approve patients with match score ≥ 90%', 'autoApprove')}
                    {settingRow('Chat Auto-Reply', 'Enable automatic replies when you are unavailable', 'chatAutoReply', true)}
                </motion.div>

                {/* Account */}
                <motion.div {...fadeUp} transition={{ delay: 0.2 }} style={card}>
                    {sectionTitle(HiOutlineUserCircle, 'Account')}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button style={{
                            padding: '10px 20px', borderRadius: '10px',
                            background: 'transparent', color: colors.accent,
                            border: `1px solid ${colors.border}`, fontSize: '12px',
                            fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6,
                            transition: 'all 0.2s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = colors.accent; e.currentTarget.style.background = colors.accentGlow; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.background = 'transparent'; }}
                        >
                            <HiOutlineKey style={{ width: 14, height: 14 }} /> Change Password
                        </button>
                        <button style={{
                            padding: '10px 20px', borderRadius: '10px',
                            background: 'transparent', color: colors.accent,
                            border: `1px solid ${colors.border}`, fontSize: '12px',
                            fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6,
                            transition: 'all 0.2s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = colors.accent; e.currentTarget.style.background = colors.accentGlow; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.background = 'transparent'; }}
                        >
                            <HiOutlineArrowDownTray style={{ width: 14, height: 14 }} /> Export Data
                        </button>
                        <button style={{
                            padding: '10px 20px', borderRadius: '10px',
                            background: 'transparent', color: colors.red || '#EF4444',
                            border: `1px solid ${colors.border}`, fontSize: '12px',
                            fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6,
                            transition: 'all 0.2s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = colors.red || '#EF4444'; e.currentTarget.style.background = `${colors.red || '#EF4444'}12`; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.background = 'transparent'; }}
                        >
                            <HiOutlineTrash style={{ width: 14, height: 14 }} /> Delete Account
                        </button>
                    </div>
                </motion.div>
            </div>
        </DoctorLayout>
    );
}
