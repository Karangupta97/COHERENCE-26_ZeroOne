// ============================================================
//  Settings — Clinic portal settings page
// ============================================================

import { useState } from 'react';
import { useTheme } from '../../theme';
import Toast from '../../components/shared/Toast';

export default function Settings() {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();

    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        matchAlerts: true,
        enrollmentAlerts: true,
        autoApproveHighScore: false,
        autoApproveThreshold: 90,
        defaultRadius: 50,
        exportFormat: 'CSV',
        timezone: 'Asia/Kolkata',
    });

    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

    const update = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

    const handleSave = () => {
        setToast({ show: true, message: 'Settings saved successfully!', variant: 'success' });
    };

    const cardStyle = {
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.lg,
        padding: spacing.lg,
    };

    const toggleStyle = (enabled) => ({
        width: '44px', height: '24px', borderRadius: radius.full,
        background: enabled ? colors.accent : `${colors.border}80`,
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s ease', padding: 0,
    });

    const toggleDot = (enabled) => ({
        position: 'absolute', top: '3px',
        left: enabled ? '23px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    });

    const inputStyle = {
        padding: `${spacing.sm} ${spacing.md}`,
        background: colors.surface, border: `1px solid ${colors.border}`,
        borderRadius: radius.md, color: colors.textPrimary,
        fontFamily: fonts.body, fontSize: fontSize.sm, outline: 'none',
        width: '200px',
    };

    const labelStyle = { fontSize: fontSize.sm, color: colors.textPrimary, fontWeight: 500, flex: 1 };
    const descStyle = { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: '2px' };

    const ToggleRow = ({ label, desc, settingKey }) => (
        <div style={{ display: 'flex', alignItems: 'center', padding: `${spacing.sm} 0`, borderBottom: `1px solid ${colors.border}30` }}>
            <div style={{ flex: 1 }}>
                <div style={labelStyle}>{label}</div>
                {desc && <div style={descStyle}>{desc}</div>}
            </div>
            <button style={toggleStyle(settings[settingKey])} onClick={() => update(settingKey, !settings[settingKey])}>
                <div style={toggleDot(settings[settingKey])} />
            </button>
        </div>
    );

    return (
        <div style={{ padding: spacing.xl, display: 'flex', flexDirection: 'column', gap: spacing.lg, animation: 'fadeInUp 0.4s ease' }}>

            {/* Notification Preferences */}
            <div style={cardStyle}>
                <h3 style={{ fontFamily: fonts.heading, fontSize: fontSize.base, fontWeight: 700, color: colors.textPrimary, margin: `0 0 ${spacing.md}` }}>
                    🔔 Notification Preferences
                </h3>
                <ToggleRow label="Email Notifications" desc="Receive updates via email" settingKey="emailNotifications" />
                <ToggleRow label="SMS Notifications" desc="Receive SMS for urgent updates" settingKey="smsNotifications" />
                <ToggleRow label="Match Alerts" desc="Alert when new matches are found" settingKey="matchAlerts" />
                <ToggleRow label="Enrollment Alerts" desc="Alert when patients are enrolled" settingKey="enrollmentAlerts" />
            </div>

            {/* Auto-Approve */}
            <div style={cardStyle}>
                <h3 style={{ fontFamily: fonts.heading, fontSize: fontSize.base, fontWeight: 700, color: colors.textPrimary, margin: `0 0 ${spacing.md}` }}>
                    🤖 AI Automation
                </h3>
                <ToggleRow label="Auto-Approve High Score Matches" desc={`Automatically approve candidates with score ≥ ${settings.autoApproveThreshold}%`} settingKey="autoApproveHighScore" />
                {settings.autoApproveHighScore && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: `${spacing.sm} 0` }}>
                        <label style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Threshold:</label>
                        <input type="range" min="70" max="100" value={settings.autoApproveThreshold}
                            onChange={e => update('autoApproveThreshold', parseInt(e.target.value))}
                            style={{ width: '150px', accentColor: colors.accent }} />
                        <span style={{ fontFamily: fonts.mono, fontSize: fontSize.sm, color: colors.accent, fontWeight: 700 }}>
                            {settings.autoApproveThreshold}%
                        </span>
                    </div>
                )}
            </div>

            {/* General Settings */}
            <div style={cardStyle}>
                <h3 style={{ fontFamily: fonts.heading, fontSize: fontSize.base, fontWeight: 700, color: colors.textPrimary, margin: `0 0 ${spacing.md}` }}>
                    🌐 General
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                        <label style={{ ...labelStyle, minWidth: '160px' }}>Default Location Radius</label>
                        <input type="number" style={inputStyle} value={settings.defaultRadius} onChange={e => update('defaultRadius', e.target.value)} />
                        <span style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>km</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                        <label style={{ ...labelStyle, minWidth: '160px' }}>Export Format</label>
                        <select style={inputStyle} value={settings.exportFormat} onChange={e => update('exportFormat', e.target.value)}>
                            <option>CSV</option><option>Excel</option><option>PDF</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                        <label style={{ ...labelStyle, minWidth: '160px' }}>Timezone</label>
                        <select style={inputStyle} value={settings.timezone} onChange={e => update('timezone', e.target.value)}>
                            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                            <option value="America/New_York">America/New_York (EST)</option>
                            <option value="Europe/London">Europe/London (GMT)</option>
                            <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Calendar Integration */}
            <div style={cardStyle}>
                <h3 style={{ fontFamily: fonts.heading, fontSize: fontSize.base, fontWeight: 700, color: colors.textPrimary, margin: `0 0 ${spacing.md}` }}>
                    📅 Calendar Integration
                </h3>
                <div style={{ display: 'flex', gap: spacing.md }}>
                    {[
                        { label: 'Connect Google Calendar', icon: '📆', bg: '#4285F4' },
                        { label: 'Connect Outlook', icon: '📧', bg: '#0078D4' },
                    ].map(btn => (
                        <button key={btn.label} onClick={() => setToast({ show: true, message: `${btn.label} — coming soon!`, variant: 'info' })} style={{
                            padding: `${spacing.md} ${spacing.lg}`, background: `${btn.bg}15`,
                            color: btn.bg, border: `1px solid ${btn.bg}40`,
                            borderRadius: radius.md, fontSize: fontSize.sm, fontWeight: 600,
                            cursor: 'pointer', fontFamily: fonts.body, display: 'flex',
                            alignItems: 'center', gap: spacing.sm, transition: 'all 0.2s ease',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = `${btn.bg}25`; }}
                            onMouseLeave={e => { e.currentTarget.style.background = `${btn.bg}15`; }}
                        >
                            {btn.icon} {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <button onClick={handleSave} style={{
                padding: `${spacing.md} ${spacing.xl}`,
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                color: '#fff', border: 'none', borderRadius: radius.md,
                fontSize: fontSize.base, fontWeight: 700, cursor: 'pointer',
                fontFamily: fonts.body, boxShadow: `0 4px 20px ${colors.accent}40`,
                transition: 'all 0.3s ease', alignSelf: 'flex-start',
            }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
                💾 Save Settings
            </button>

            <Toast message={toast.message} variant={toast.variant} isVisible={toast.show}
                onClose={() => setToast({ ...toast, show: false })} />

            <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
}

