import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme';
import DoctorLayout from '../../components/shared/DoctorLayout';
import { ALERTS } from './data/mockData';

export default function DoctorAlerts() {
    const { colors, fonts } = useTheme();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [dismissed, setDismissed] = useState([]);
    const [dismissing, setDismissing] = useState([]);
    const [hoveredCard, setHoveredCard] = useState(null);

    const tabs = [
        { key: 'all', label: 'All' },
        { key: 'high', label: 'High Match 90%+' },
        { key: 'urgent', label: 'Urgent' },
        { key: 'new', label: 'New This Week' },
    ];

    const filtered = ALERTS.filter(a => {
        if (dismissed.includes(a.id)) return false;
        if (filter === 'high') return a.score >= 90;
        if (filter === 'urgent') return a.urgency === 'urgent';
        if (filter === 'new') return a.closesIn <= 14;
        return true;
    });

    const handleDismiss = (id) => {
        setDismissing(prev => [...prev, id]);
        setTimeout(() => {
            setDismissed(prev => [...prev, id]);
            setDismissing(prev => prev.filter(d => d !== id));
        }, 400);
    };

    return (
        <DoctorLayout>
            <div className="page-enter" style={{ padding: '28px 32px', maxWidth: '1200px' }}>
                <p style={{ fontFamily: fonts.body, fontSize: '15px', color: colors.textSecondary, margin: '0 0 20px 0' }}>New trials matching your existing patients</p>

                <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
                    {tabs.map(tab => (
                        <button key={tab.key} onClick={() => setFilter(tab.key)}
                            style={{ padding: '8px 16px', borderRadius: 9999, fontSize: 13, fontWeight: filter === tab.key ? 600 : 500, fontFamily: fonts.body, color: filter === tab.key ? '#fff' : colors.textSecondary, background: filter === tab.key ? colors.accent : 'transparent', border: filter === tab.key ? 'none' : `1px solid ${colors.border}`, cursor: 'pointer', transition: 'all 0.2s ease' }}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {filtered.map((alert, i) => (
                        <div key={alert.id} className={dismissing.includes(alert.id) ? 'collapse-exit' : ''} onMouseEnter={() => setHoveredCard(i)} onMouseLeave={() => setHoveredCard(null)}
                            style={{ background: colors.card, borderRadius: 14, padding: '20px 24px', border: `1px solid ${hoveredCard === i ? colors.accent + '40' : colors.border}`, boxShadow: colors.shadow, display: 'flex', alignItems: 'center', gap: 20, transition: 'all 0.3s ease', transform: hoveredCard === i ? 'translateY(-1px)' : 'none' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: alert.urgency === 'urgent' ? colors.red : colors.yellow, flexShrink: 0 }} className={alert.urgency === 'urgent' ? 'pulse-dot' : ''} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                                    <span style={{ fontFamily: fonts.heading, fontSize: 17, fontWeight: 700, color: colors.textPrimary }}>{alert.trialName}</span>
                                    <span style={{ padding: '2px 10px', borderRadius: 9999, fontSize: 11, fontFamily: fonts.mono, background: `${colors.accent}18`, color: colors.accent, fontWeight: 500 }}>{alert.phase}</span>
                                    <span style={{ fontSize: 13, color: colors.textSecondary, fontFamily: fonts.body }}>{alert.sponsor}</span>
                                </div>
                                <p style={{ fontSize: 14, color: colors.textSecondary, fontFamily: fonts.body, marginBottom: 6 }}>
                                    Matches <strong style={{ color: colors.accent }}>{alert.patientId}</strong> — {alert.score}% compatibility
                                </p>
                                <p style={{ fontSize: 13, color: colors.yellow, fontFamily: fonts.body, margin: 0 }}>⚠️ Closes in {alert.closesIn} days · {alert.slots} slots remaining</p>
                            </div>
                            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                                <button onClick={() => navigate(`/doctor/patients/${alert.patientId}`)}
                                    style={{ padding: '8px 18px', borderRadius: 8, background: colors.accent, color: '#fff', fontFamily: fonts.body, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}
                                    onMouseEnter={e => e.target.style.opacity = '0.85'} onMouseLeave={e => e.target.style.opacity = '1'}>
                                    Review Patient →
                                </button>
                                <button onClick={() => handleDismiss(alert.id)}
                                    style={{ padding: '8px 18px', borderRadius: 8, background: 'transparent', color: colors.textSecondary, fontFamily: fonts.body, fontSize: 13, fontWeight: 500, border: `1px solid ${colors.border}`, cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}
                                    onMouseEnter={e => { e.target.style.background = colors.card; e.target.style.color = colors.textPrimary; }}
                                    onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = colors.textSecondary; }}>
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div style={{ padding: 48, textAlign: 'center', color: colors.textSecondary, fontFamily: fonts.body, fontSize: 15 }}>No alerts matching your filter.</div>
                    )}
                </div>
            </div>
        </DoctorLayout>
    );
}
