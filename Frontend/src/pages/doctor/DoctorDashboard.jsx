import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme';
import DoctorLayout from '../../components/shared/DoctorLayout';
import { PATIENTS, TRIALS } from './data/mockData';

export default function DoctorDashboard() {
    const { colors, fonts } = useTheme();
    const navigate = useNavigate();
    const [hoveredStat, setHoveredStat] = useState(null);
    const [hoveredAction, setHoveredAction] = useState(null);

    const stats = [
        { label: 'ACTIVE TRIALS', value: TRIALS.length, icon: '🔬', iconBg: '#10B981', trend: '↑ 12%', trendColor: '#10B981' },
        { label: 'TOTAL MATCHES', value: 12, icon: '🔗', iconBg: '#8B5CF6', trend: '↑ 23%', trendColor: '#10B981' },
        { label: 'DOCTOR APPROVED', value: 7, icon: '✅', iconBg: '#10B981', trend: '↑ 8%', trendColor: '#10B981' },
        { label: 'ENROLLED PATIENTS', value: 2, icon: '🎯', iconBg: '#F43F5E', trend: '↑ 5%', trendColor: '#10B981' },
    ];

    const quickActions = [
        { label: 'View Patients', icon: '👥', onClick: () => navigate('/doctor/patients') },
        { label: 'View Alerts', icon: '🔔', onClick: () => navigate('/doctor/alerts') },
        { label: 'Open Chat', icon: '💬', onClick: () => navigate('/doctor/chat/PT-0041') },
    ];

    const recentActivity = [
        { icon: '📋', iconBg: '#10B981', title: 'New trial posted', desc: 'GLYCO-ADVANCE Phase III', time: '10 min ago' },
        { icon: '🔬', iconBg: '#8B5CF6', title: 'Patient matched', desc: 'PT-0041 matched with 94% score', time: '25 min ago' },
        { icon: '✅', iconBg: '#10B981', title: 'Doctor approved', desc: 'Dr. Sharma approved PT-0039', time: '1 hr ago' },
        { icon: '🏥', iconBg: '#4F46E5', title: 'Screening completed', desc: 'PT-0037 passed screening', time: '2 hrs ago' },
    ];

    const aiInsights = [
        { type: 'warning', icon: '⚠️', title: 'High Drop-off Alert', desc: '64% drop-off between Matched → Doctor Approved. Consider reducing approval bottleneck.', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
        { type: 'idea', icon: '💡', title: 'Expand Age Criteria', desc: 'Widening age range to 35-70 could increase GLYCO-ADVANCE matches by ~23%.', color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
        { type: 'success', icon: '📈', title: 'Strong Enrollment Trend', desc: 'CARDIO-PROTECT is on track to meet target by Q2 2025 at current pace.', color: '#4F46E5', bg: 'rgba(79,70,229,0.08)' },
    ];

    return (
        <DoctorLayout>
            <div className="page-enter" style={{ padding: '24px 28px', maxWidth: '1100px' }}>

                {/* Doctor Info + Quick Actions row */}
                <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
                    {/* Doctor Info Card */}
                    <div style={{
                        flex: 1,
                        background: colors.card,
                        borderRadius: '12px',
                        padding: '18px 22px',
                        border: `1px solid ${colors.border}`,
                        boxShadow: colors.shadow,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                    }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${colors.accent}, #7C3AED)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            flexShrink: 0,
                        }}>
                            👨‍⚕️
                        </div>
                        <div>
                            <div style={{ fontFamily: fonts.heading, fontSize: '15px', fontWeight: 700, color: colors.textPrimary }}>
                                Dr. Priya Sharma
                            </div>
                            <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: colors.textSecondary, fontFamily: fonts.body, marginTop: '3px' }}>
                                <span>📍 Mumbai, Maharashtra</span>
                                <span>👥 {PATIENTS.length} Patients</span>
                                <span>🔬 {TRIALS.length} Active Trials</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div style={{
                        background: colors.card,
                        borderRadius: '12px',
                        padding: '18px 22px',
                        border: `1px solid ${colors.border}`,
                        boxShadow: colors.shadow,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        <span style={{ fontSize: '13px', color: colors.textSecondary, fontFamily: fonts.heading, fontWeight: 600, whiteSpace: 'nowrap' }}>Quick Actions</span>
                        {quickActions.map((action, i) => (
                            <button
                                key={i}
                                onClick={action.onClick}
                                onMouseEnter={() => setHoveredAction(i)}
                                onMouseLeave={() => setHoveredAction(null)}
                                style={{
                                    padding: '7px 16px',
                                    borderRadius: '7px',
                                    background: hoveredAction === i ? colors.green : 'transparent',
                                    color: hoveredAction === i ? '#fff' : colors.green,
                                    fontFamily: fonts.body,
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    border: `1.5px solid ${colors.green}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <span style={{ fontSize: '12px' }}>{action.icon}</span>
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stat Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '14px',
                    marginBottom: '20px',
                }}>
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            onMouseEnter={() => setHoveredStat(i)}
                            onMouseLeave={() => setHoveredStat(null)}
                            style={{
                                background: colors.card,
                                borderRadius: '12px',
                                padding: '18px',
                                border: `1px solid ${colors.border}`,
                                boxShadow: colors.shadow,
                                transition: 'all 0.25s ease',
                                transform: hoveredStat === i ? 'translateY(-2px)' : 'none',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Colored top border */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: `linear-gradient(90deg, ${colors.accent}, #7C3AED)`,
                                borderRadius: '12px 12px 0 0',
                            }} />

                            {/* Icon + Trend */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    background: `${stat.iconBg}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px',
                                }}>
                                    {stat.icon}
                                </div>
                                <span style={{
                                    padding: '2px 8px',
                                    borderRadius: '9999px',
                                    fontSize: '10px',
                                    fontFamily: fonts.mono,
                                    fontWeight: 600,
                                    background: `${stat.trendColor}12`,
                                    color: stat.trendColor,
                                }}>
                                    {stat.trend}
                                </span>
                            </div>

                            {/* Value */}
                            <div style={{
                                fontFamily: fonts.heading,
                                fontSize: '32px',
                                fontWeight: 700,
                                color: colors.textPrimary,
                                lineHeight: 1,
                                marginBottom: '4px',
                            }}>
                                {stat.value}
                            </div>

                            {/* Label */}
                            <div style={{
                                fontFamily: fonts.mono,
                                fontSize: '10px',
                                fontWeight: 500,
                                color: colors.textSecondary,
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                            }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Two column: Recent Activity + AI Insights */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '14px',
                }}>
                    {/* Recent Activity */}
                    <div style={{
                        background: colors.card,
                        borderRadius: '12px',
                        padding: '20px',
                        border: `1px solid ${colors.border}`,
                        boxShadow: colors.shadow,
                    }}>
                        <h2 style={{
                            fontFamily: fonts.heading,
                            fontSize: '15px',
                            fontWeight: 700,
                            color: colors.textPrimary,
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}>
                            📋 Recent Activity
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {recentActivity.map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '12px 0',
                                    borderBottom: i < recentActivity.length - 1 ? `1px solid ${colors.border}` : 'none',
                                }}>
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '6px',
                                        background: `${item.iconBg}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        flexShrink: 0,
                                    }}>
                                        {item.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontFamily: fonts.body, fontSize: '13px', fontWeight: 600, color: colors.textPrimary, marginBottom: '1px' }}>{item.title}</div>
                                        <div style={{ fontFamily: fonts.body, fontSize: '11px', color: colors.textSecondary }}>{item.desc}</div>
                                    </div>
                                    <span style={{ fontFamily: fonts.mono, fontSize: '10px', color: colors.textSecondary, whiteSpace: 'nowrap', marginTop: '2px' }}>{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Insights */}
                    <div style={{
                        background: colors.card,
                        borderRadius: '12px',
                        padding: '20px',
                        border: `1px solid ${colors.border}`,
                        boxShadow: colors.shadow,
                    }}>
                        <h2 style={{
                            fontFamily: fonts.heading,
                            fontSize: '15px',
                            fontWeight: 700,
                            color: colors.textPrimary,
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}>
                            🤖 AI Insights
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {aiInsights.map((insight, i) => (
                                <div key={i} style={{
                                    background: insight.bg,
                                    borderRadius: '8px',
                                    padding: '14px',
                                    borderLeft: `3px solid ${insight.color}`,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '13px' }}>{insight.icon}</span>
                                        <span style={{ fontFamily: fonts.heading, fontSize: '13px', fontWeight: 700, color: colors.textPrimary }}>{insight.title}</span>
                                    </div>
                                    <p style={{ fontFamily: fonts.body, fontSize: '12px', color: colors.textSecondary, margin: 0, lineHeight: 1.5 }}>{insight.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
}
