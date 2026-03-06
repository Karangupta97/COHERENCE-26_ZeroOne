import React, { useState } from 'react';
import { useTheme, radius, spacing, fontSize } from '../../theme';
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
} from 'react-icons/hi2';

function ToggleSwitch({ on, onToggle, colors }) {
    return (
        <button onClick={onToggle} style={{
            width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
            background: on ? colors.green : colors.border, position: 'relative', transition: 'background 0.2s',
            padding: 0,
        }}>
            <div style={{
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3, left: on ? 22 : 4, transition: 'left 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }} />
        </button>
    )
}

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

    const cardStyle = { background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.lg, boxShadow: colors.shadow, padding: spacing.lg };

    const sectionTitle = (icon, title, iconColor) => {
        const Icon = icon;
        return (
            <h3 style={{ margin: `0 0 ${spacing.lg}`, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <Icon style={{ width: 20, height: 20, color: iconColor }} /> {title}
            </h3>
        );
    };

    const settingRow = (label, desc, key) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${spacing.md} 0`, borderBottom: `1px solid ${colors.border}` }}>
            <div>
                <div style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>{label}</div>
                <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2, fontFamily: fonts.body }}>{desc}</div>
            </div>
            <ToggleSwitch on={settings[key]} onToggle={() => toggle(key)} colors={colors} />
        </div>
    );

    return (
        <DoctorLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
                {/* Appearance */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
                    {sectionTitle(HiOutlinePaintBrush, 'Appearance', colors.accent)}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${spacing.md} 0`, borderBottom: `1px solid ${colors.border}` }}>
                        <div>
                            <div style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>Theme & Mode</div>
                            <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2, fontFamily: fonts.body }}>Choose your preferred color theme and dark/light mode</div>
                        </div>
                        <ThemeSwitcher />
                    </div>
                </motion.div>

                {/* Notifications */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={cardStyle}>
                    {sectionTitle(HiOutlineBell, 'Notification Preferences', colors.accent)}
                    {settingRow('Email Notifications', 'Receive patient match updates and trial status via email', 'emailNotif')}
                    {settingRow('Push Notifications', 'Get instant push notifications for important updates', 'pushNotif')}
                    {settingRow('SMS Alerts', 'Receive SMS alerts for urgent patient notifications', 'smsNotif')}
                </motion.div>

                {/* Privacy & Security */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={cardStyle}>
                    {sectionTitle(HiOutlineShieldCheck, 'Privacy & Security', colors.green)}
                    {settingRow('Data Sharing', 'Allow sharing patient data with matched clinical trial sites', 'dataSharing')}
                    {settingRow('AI Analysis', 'Allow AI to analyze patient profiles for better trial matching', 'aiAnalysis')}
                    {settingRow('Two-Factor Authentication', 'Add an extra layer of security to your account', 'twoFactor')}
                </motion.div>

                {/* Trial Settings */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={cardStyle}>
                    {sectionTitle(HiOutlineBeaker, 'Trial Preferences', colors.accent)}
                    {settingRow('Auto-Approve High Score', 'Automatically approve patients with match score ≥ 90%', 'autoApprove')}
                    {settingRow('Chat Auto-Reply', 'Enable automatic replies when you are unavailable', 'chatAutoReply')}
                </motion.div>

                {/* Account */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={cardStyle}>
                    {sectionTitle(HiOutlineUserCircle, 'Account', colors.accent)}
                    <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
                        <button style={{
                            padding: `10px ${spacing.xl}`, borderRadius: radius.sm,
                            background: colors.accentGlow, color: colors.accent,
                            border: `1px solid ${colors.accent}40`, fontSize: fontSize.sm,
                            fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                        }}>
                            Change Password
                        </button>
                        <button style={{
                            padding: `10px ${spacing.xl}`, borderRadius: radius.sm,
                            background: colors.accentGlow, color: colors.accent,
                            border: `1px solid ${colors.accent}40`, fontSize: fontSize.sm,
                            fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                        }}>
                            Export Data
                        </button>
                        <button style={{
                            padding: `10px ${spacing.xl}`, borderRadius: radius.sm,
                            background: `${colors.red}18`, color: colors.red,
                            border: `1px solid ${colors.red}40`, fontSize: fontSize.sm,
                            fontWeight: 600, fontFamily: fonts.body, cursor: 'pointer',
                        }}>
                            Delete Account
                        </button>
                    </div>
                </motion.div>
            </div>
        </DoctorLayout>
    );
}
