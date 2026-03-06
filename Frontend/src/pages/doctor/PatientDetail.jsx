import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme';
import DoctorLayout from '../../components/shared/DoctorLayout';
import ScoreRing from '../../components/shared/ScoreRing';
import { useToast } from '../../components/shared/Toast';
import { PATIENTS, TRIALS, TRIAL_CRITERIA, PATIENT_TRIAL_MATCHES, MATCH_SCORES, REJECTION_REASONS } from './data/mockData';

export default function PatientDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { colors, fonts } = useTheme();
    const { addToast } = useToast();
    const [referrals, setReferrals] = useState({});
    const [showRejectDropdown, setShowRejectDropdown] = useState(null);
    const [backHover, setBackHover] = useState(false);
    const [chatHover, setChatHover] = useState(false);

    const patient = PATIENTS.find(p => p.id === id);
    const matchedTrialIds = PATIENT_TRIAL_MATCHES[id] || [];
    const matchedTrials = matchedTrialIds.map(tid => TRIALS.find(t => t.id === tid)).filter(Boolean);

    if (!patient) return (
        <DoctorLayout>
            <div style={{ padding: 64, textAlign: 'center', color: colors.textSecondary }}>Patient not found.</div>
        </DoctorLayout>
    );

    const handleApprove = (trialId) => {
        setReferrals(p => ({ ...p, [trialId]: 'approved' }));
        addToast('Referral sent to clinic', 'success');
    };
    const handleReject = (trialId, reason) => {
        setReferrals(p => ({ ...p, [trialId]: 'rejected' }));
        setShowRejectDropdown(null);
        addToast(`Marked as not suitable: ${reason}`, 'info');
    };

    const InfoRow = ({ label, value }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${colors.border}20` }}>
            <span style={{ fontSize: 13, color: colors.textSecondary, fontFamily: fonts.body, fontWeight: 500 }}>{label}</span>
            <span style={{ fontSize: 14, color: colors.textPrimary, fontFamily: fonts.body, fontWeight: 500 }}>{value}</span>
        </div>
    );

    return (
        <DoctorLayout>
            <div className="page-enter" style={{ padding: '28px 32px', maxWidth: '1200px' }}>
                <button onClick={() => navigate('/doctor/patients')} onMouseEnter={() => setBackHover(true)} onMouseLeave={() => setBackHover(false)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, background: backHover ? colors.card : 'transparent', border: 'none', color: colors.textSecondary, fontFamily: fonts.body, fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease', marginBottom: 24 }}>
                    ← All Patients
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '38% 1fr', gap: 24, alignItems: 'start' }}>
                    {/* LEFT: Patient Profile */}
                    <div style={{ background: colors.card, borderRadius: 14, padding: 28, border: `1px solid ${colors.border}`, boxShadow: colors.shadow, position: 'sticky', top: 24, transition: 'all 0.3s ease' }}>
                        <div style={{ fontFamily: fonts.mono, fontSize: 24, fontWeight: 700, color: colors.accent, marginBottom: 20 }}>{patient.id}</div>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                            {[`${patient.age} yrs`, patient.gender, `📍 ${patient.location}`].map((item, i) => (
                                <span key={i} style={{ padding: '4px 12px', borderRadius: 9999, fontSize: 13, fontFamily: fonts.body, background: `${colors.accent}10`, color: colors.textSecondary }}>{item}</span>
                            ))}
                        </div>
                        <InfoRow label="Diagnosis" value={patient.diagnosis} />
                        <InfoRow label="Medications" value={patient.meds} />
                        <InfoRow label="HbA1c" value={patient.hba1c} />
                        <InfoRow label="BMI" value={patient.bmi} />
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 9999, background: colors.greenGlow, color: colors.green, fontFamily: fonts.mono, fontSize: 12, fontWeight: 500, marginTop: 20 }}>🔒 Anonymized</div>
                        <button onClick={() => navigate(`/doctor/chat/${patient.id}`)} onMouseEnter={() => setChatHover(true)} onMouseLeave={() => setChatHover(false)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: 12, borderRadius: 10, border: `1px solid ${colors.accent}30`, background: chatHover ? colors.accent : colors.accentGlow, color: chatHover ? '#fff' : colors.accent, fontFamily: fonts.body, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', marginTop: 16 }}>
                            💬 Chat with Patient
                        </button>
                    </div>

                    {/* RIGHT: Trial Matches */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <h2 style={{ fontFamily: fonts.heading, fontSize: 20, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>Trial Matches ({matchedTrials.length})</h2>
                        {matchedTrials.map(trial => {
                            const score = MATCH_SCORES[id]?.[trial.id] || 0;
                            const criteria = TRIAL_CRITERIA[trial.id] || [];
                            const status = referrals[trial.id];
                            return (
                                <div key={trial.id} style={{ background: colors.card, borderRadius: 14, padding: 24, border: `1px solid ${colors.border}`, boxShadow: colors.shadow, transition: 'all 0.3s ease' }}>
                                    <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                                        <ScoreRing score={score} size={72} strokeWidth={6} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                                                <span style={{ fontFamily: fonts.heading, fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>{trial.name}</span>
                                                <span style={{ padding: '2px 10px', borderRadius: 9999, fontSize: 11, fontFamily: fonts.mono, background: `${colors.accent}18`, color: colors.accent, fontWeight: 500 }}>{trial.phase}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 13, color: colors.textSecondary, fontFamily: fonts.body }}>
                                                <span>🏥 {trial.sponsor}</span><span>📍 {trial.location}</span><span>📏 {trial.distance}</span><span>🪑 {trial.slots} slots</span>
                                            </div>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, background: colors.greenGlow, color: colors.green, fontFamily: fonts.mono, fontSize: 12, fontWeight: 500, marginTop: 8 }}>💰 {trial.compensation}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                                        {criteria.map((c, i) => {
                                            const [icon, color, bg] = c.pass === true ? ['✓', colors.green, colors.greenGlow] : c.pass === false ? ['✗', colors.red, `${colors.red}15`] : ['⚠️', colors.yellow, `${colors.yellow}15`];
                                            return <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, fontSize: 12, fontFamily: fonts.body, color, background: bg, fontWeight: 500 }}>{icon} {c.label}</span>;
                                        })}
                                    </div>
                                    <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
                                        {status === 'approved' ? (
                                            <div style={{ padding: '10px 20px', borderRadius: 8, background: colors.greenGlow, color: colors.green, fontFamily: fonts.body, fontSize: 14, fontWeight: 600, border: `1px solid ${colors.green}30` }}>Referred ✅</div>
                                        ) : status === 'rejected' ? (
                                            <div style={{ padding: '10px 20px', borderRadius: 8, background: `${colors.red}15`, color: colors.red, fontFamily: fonts.body, fontSize: 14, fontWeight: 600, border: `1px solid ${colors.red}30` }}>Not Suitable ❌</div>
                                        ) : (<>
                                            <button onClick={() => handleApprove(trial.id)} style={{ padding: '10px 20px', borderRadius: 8, background: colors.green, color: '#fff', fontFamily: fonts.body, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseEnter={e => e.target.style.opacity = '0.85'} onMouseLeave={e => e.target.style.opacity = '1'}>✅ Approve Referral</button>
                                            <div style={{ position: 'relative' }}>
                                                <button onClick={() => setShowRejectDropdown(showRejectDropdown === trial.id ? null : trial.id)} style={{ padding: '10px 20px', borderRadius: 8, background: 'transparent', color: colors.red, fontFamily: fonts.body, fontSize: 14, fontWeight: 600, border: `1px solid ${colors.red}30`, cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseEnter={e => e.target.style.background = `${colors.red}15`} onMouseLeave={e => e.target.style.background = 'transparent'}>❌ Not Suitable</button>
                                                {showRejectDropdown === trial.id && (
                                                    <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 8, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, boxShadow: colors.shadow, zIndex: 20, minWidth: 200, overflow: 'hidden' }}>
                                                        {REJECTION_REASONS.map((reason, i) => (
                                                            <button key={i} onClick={() => handleReject(trial.id, reason)} style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', fontSize: 13, fontFamily: fonts.body, color: colors.textPrimary, background: 'transparent', border: 'none', borderBottom: i < REJECTION_REASONS.length - 1 ? `1px solid ${colors.border}` : 'none', cursor: 'pointer', transition: 'background 0.2s ease' }} onMouseEnter={e => e.target.style.background = colors.card} onMouseLeave={e => e.target.style.background = 'transparent'}>{reason}</button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </>)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
}
