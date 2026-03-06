import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme';
import DoctorLayout from '../../components/shared/DoctorLayout';
import { ALERTS } from './data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineBellAlert,
    HiOutlineExclamationTriangle,
    HiOutlineClock,
    HiOutlineArrowRight,
    HiOutlineXMark,
    HiOutlineUserGroup,
} from 'react-icons/hi2';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function DoctorAlerts() {
    const { colors, fonts } = useTheme();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [dismissed, setDismissed] = useState([]);
    const [hoveredCard, setHoveredCard] = useState(null);

    const tabs = [
        { key: 'all', label: 'All Alerts' },
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
        setDismissed(prev => [...prev, id]);
    };

    const card = {
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        boxShadow: colors.shadow,
    };

    return (
        <DoctorLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: 1400 }}>

                {/* Header */}
                <motion.div {...fadeUp} transition={{ duration: 0.4 }}
                    style={{ ...card, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: '12px',
                            background: colors.accentGlow,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <HiOutlineBellAlert style={{ width: 22, height: 22, color: colors.accent }} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '18px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                                Trial Alerts
                            </h2>
                            <span style={{ fontSize: '13px', color: colors.textSecondary, fontFamily: fonts.body }}>
                                New trials matching your existing patients
                            </span>
                        </div>
                    </div>
                    <span style={{ fontSize: '12px', color: colors.textSecondary, fontFamily: fonts.body }}>
                        {filtered.length} active alerts
                    </span>
                </motion.div>

                {/* Filter tabs */}
                <motion.div {...fadeUp} transition={{ delay: 0.05 }}
                    style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {tabs.map(tab => (
                        <button key={tab.key} onClick={() => setFilter(tab.key)}
                            style={{
                                padding: '8px 18px', borderRadius: '20px',
                                fontSize: '12px', fontWeight: filter === tab.key ? 600 : 500,
                                fontFamily: fonts.body,
                                color: filter === tab.key ? '#fff' : colors.textSecondary,
                                background: filter === tab.key ? colors.accent : 'transparent',
                                border: filter === tab.key ? 'none' : `1px solid ${colors.border}`,
                                cursor: 'pointer', transition: 'all 0.2s ease',
                            }}>
                            {tab.label}
                        </button>
                    ))}
                </motion.div>

                {/* Alert cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <AnimatePresence mode="popLayout">
                        {filtered.map((alert, i) => (
                            <motion.div key={alert.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
                                transition={{ delay: i * 0.04, duration: 0.3 }}
                                onMouseEnter={() => setHoveredCard(i)} onMouseLeave={() => setHoveredCard(null)}
                                style={{
                                    ...card,
                                    padding: '20px 24px',
                                    display: 'flex', alignItems: 'center', gap: '18px',
                                    transition: 'all 0.25s ease',
                                    borderColor: hoveredCard === i ? `${colors.accent}50` : colors.border,
                                    transform: hoveredCard === i ? 'translateY(-2px)' : 'none',
                                    boxShadow: hoveredCard === i ? `0 6px 24px ${colors.accent}10` : colors.shadow,
                                }}>
                                {/* Urgency dot */}
                                <div style={{
                                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                                    background: alert.urgency === 'urgent' ? (colors.red || '#EF4444') : (colors.yellow || '#F59E0B'),
                                    boxShadow: alert.urgency === 'urgent' ? `0 0 8px ${colors.red || '#EF4444'}50` : 'none',
                                }} />

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                                        <span style={{ fontFamily: fonts.heading, fontSize: '15px', fontWeight: 700, color: colors.textPrimary }}>{alert.trialName}</span>
                                        <span style={{
                                            padding: '3px 12px', borderRadius: '20px', fontSize: '10px',
                                            fontFamily: fonts.body, background: colors.accentGlow,
                                            color: colors.accent, fontWeight: 600,
                                        }}>{alert.phase}</span>
                                        <span style={{ fontSize: '12px', color: colors.textSecondary, fontFamily: fonts.body }}>{alert.sponsor}</span>
                                    </div>
                                    <p style={{ fontSize: '13px', color: colors.textSecondary, fontFamily: fonts.body, margin: '0 0 6px' }}>
                                        Matches <strong style={{ color: colors.accent }}>{alert.patientId}</strong> — {alert.score}% compatibility
                                    </p>
                                    <p style={{
                                        fontSize: '12px', color: colors.yellow || '#F59E0B', fontFamily: fonts.body, margin: 0,
                                        display: 'flex', alignItems: 'center', gap: 6,
                                    }}>
                                        <HiOutlineExclamationTriangle style={{ width: 13, height: 13 }} />
                                        Closes in {alert.closesIn} days · {alert.slots} slots remaining
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                    <button onClick={() => navigate(`/doctor/patients/${alert.patientId}`)}
                                        style={{
                                            padding: '9px 18px', borderRadius: '10px',
                                            background: colors.accent, color: '#fff',
                                            fontFamily: fonts.body, fontSize: '12px', fontWeight: 600,
                                            border: 'none', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: 4,
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                                        Review <HiOutlineArrowRight style={{ width: 12, height: 12 }} />
                                    </button>
                                    <button onClick={() => handleDismiss(alert.id)}
                                        style={{
                                            padding: '9px 18px', borderRadius: '10px',
                                            background: 'transparent', color: colors.textSecondary,
                                            fontFamily: fonts.body, fontSize: '12px', fontWeight: 500,
                                            border: `1px solid ${colors.border}`, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: 4,
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = colors.card; e.currentTarget.style.borderColor = `${colors.red || '#EF4444'}40`; e.currentTarget.style.color = colors.red || '#EF4444'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textSecondary; }}>
                                        <HiOutlineXMark style={{ width: 14, height: 14 }} /> Dismiss
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {filtered.length === 0 && (
                        <motion.div {...fadeUp} style={{
                            padding: '60px', textAlign: 'center', color: colors.textSecondary,
                            fontFamily: fonts.body, fontSize: '14px', ...card,
                        }}>
                            No alerts matching your filter.
                        </motion.div>
                    )}
                </div>
            </div>
        </DoctorLayout>
    );
}
