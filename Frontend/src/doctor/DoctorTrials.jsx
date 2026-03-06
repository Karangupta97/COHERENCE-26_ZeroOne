import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme';
import DoctorLayout from '../components/shared/DoctorLayout';
import { PATIENTS, TRIALS, PATIENT_TRIAL_MATCHES, MATCH_SCORES } from './data/mockData';

export default function DoctorTrials() {
    const { colors, fonts } = useTheme();
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState(null);

    return (
        <DoctorLayout>
            <div className="page-enter" style={{ padding: '24px 28px', maxWidth: '1100px' }}>
                <p style={{ fontFamily: fonts.body, fontSize: '14px', color: colors.textSecondary, margin: '0 0 20px 0' }}>
                    {TRIALS.length} active trials with patient matches
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {TRIALS.map((trial, i) => {
                        const matchedPatients = PATIENTS.filter(p => (PATIENT_TRIAL_MATCHES[p.id] || []).includes(trial.id));
                        return (
                            <div
                                key={trial.id}
                                onMouseEnter={() => setHoveredCard(i)}
                                onMouseLeave={() => setHoveredCard(null)}
                                style={{
                                    background: colors.card,
                                    borderRadius: '12px',
                                    padding: '18px 22px',
                                    border: `1px solid ${hoveredCard === i ? colors.accent + '40' : colors.border}`,
                                    boxShadow: colors.shadow,
                                    transition: 'all 0.2s ease',
                                    transform: hoveredCard === i ? 'translateY(-1px)' : 'none',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                            <span style={{ fontFamily: fonts.heading, fontSize: '16px', fontWeight: 700, color: colors.textPrimary }}>{trial.name}</span>
                                            <span style={{ padding: '2px 10px', borderRadius: 9999, fontSize: 11, fontFamily: fonts.mono, background: `${colors.accent}12`, color: colors.accent, fontWeight: 500 }}>{trial.phase}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: colors.textSecondary, fontFamily: fonts.body }}>
                                            <span>🏥 {trial.sponsor}</span>
                                            <span>📍 {trial.location}</span>
                                            <span>🪑 {trial.slots} slots</span>
                                            <span>💰 {trial.compensation}</span>
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '4px 14px',
                                        borderRadius: 9999,
                                        background: `${colors.green}12`,
                                        color: colors.green,
                                        fontFamily: fonts.mono,
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        flexShrink: 0,
                                    }}>
                                        {matchedPatients.length} matches
                                    </div>
                                </div>

                                {matchedPatients.length > 0 && (
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {matchedPatients.map(p => {
                                            const score = MATCH_SCORES[p.id]?.[trial.id] || 0;
                                            return (
                                                <button
                                                    key={p.id}
                                                    onClick={() => navigate(`/doctor/patients/${p.id}`)}
                                                    style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '6px',
                                                        background: `${colors.accent}08`,
                                                        border: `1px solid ${colors.accent}20`,
                                                        color: colors.accent,
                                                        fontFamily: fonts.mono,
                                                        fontSize: '11px',
                                                        fontWeight: 500,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                    onMouseEnter={e => { e.target.style.background = colors.accent; e.target.style.color = '#fff'; }}
                                                    onMouseLeave={e => { e.target.style.background = `${colors.accent}08`; e.target.style.color = colors.accent; }}
                                                >
                                                    {p.id} · {score}%
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </DoctorLayout>
    );
}
