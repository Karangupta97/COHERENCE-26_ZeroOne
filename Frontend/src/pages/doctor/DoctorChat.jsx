import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme';
import DoctorLayout from '../../components/shared/DoctorLayout';
import PatientAvatar from '../../components/shared/PatientAvatar';
import { PATIENTS, CHAT_MESSAGES, MATCH_SCORES, TRIALS, PATIENT_TRIAL_MATCHES } from './data/mockData';

export default function DoctorChat() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const { colors, fonts } = useTheme();
    const [activeChat, setActiveChat] = useState(patientId || PATIENTS[0].anonymizedId);
    const [messages, setMessages] = useState({ ...CHAT_MESSAGES });
    const [input, setInput] = useState('');
    const [sendHover, setSendHover] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => { if (patientId) setActiveChat(patientId); }, [patientId]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, activeChat]);

    const activePatient = PATIENTS.find(p => p.anonymizedId === activeChat);
    const activeMessages = messages[activeChat] || [];
    const topTrialId = (PATIENT_TRIAL_MATCHES[activeChat] || [])[0];
    const topTrial = TRIALS.find(t => t.id === topTrialId);
    const topScore = MATCH_SCORES[activeChat]?.[topTrialId] || 0;

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsg = { sender: 'doctor', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => ({ ...prev, [activeChat]: [...(prev[activeChat] || []), newMsg] }));
        setInput('');
    };

    return (
        <DoctorLayout>
            <div className="page-enter" style={{ display: 'flex', height: '100vh' }}>
                {/* LEFT: Chat list */}
                <div style={{ width: '260px', borderRight: `1px solid ${colors.border}`, overflowY: 'auto', background: colors.surface, transition: 'all 0.3s ease', flexShrink: 0 }}>
                    <div style={{ padding: '20px 16px 12px', fontFamily: fonts.heading, fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>Messages</div>
                    {PATIENTS.map(p => {
                        const lastMsg = (messages[p.anonymizedId] || []).slice(-1)[0];
                        const unread = p.anonymizedId !== activeChat && (messages[p.anonymizedId] || []).filter(m => m.sender === 'patient').length > 0 ? 1 : 0;
                        const active = activeChat === p.anonymizedId;
                        return (
                            <div key={p.anonymizedId} onClick={() => { setActiveChat(p.anonymizedId); navigate(`/doctor/chat/${p.anonymizedId}`, { replace: true }); }}
                                style={{ padding: '14px 16px', cursor: 'pointer', background: active ? colors.accentGlow : 'transparent', borderLeft: active ? `3px solid ${colors.accent}` : '3px solid transparent', transition: 'all 0.2s ease', display: 'flex', gap: 12, alignItems: 'center' }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.background = colors.card; }} onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                                <PatientAvatar patientId={p.anonymizedId} size={40} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                        <span style={{ fontFamily: fonts.mono, fontSize: 13, fontWeight: 600, color: colors.textPrimary }}>{p.anonymizedId}</span>
                                        {unread > 0 && <span style={{ width: 18, height: 18, borderRadius: '50%', background: colors.accent, color: '#fff', fontSize: 10, fontWeight: 700, fontFamily: fonts.mono, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</span>}
                                    </div>
                                    <div style={{ fontSize: 12, color: colors.textSecondary, fontFamily: fonts.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.diagnosis}</div>
                                    {lastMsg && <div style={{ fontSize: 11, color: colors.textSecondary, fontFamily: fonts.body, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.7 }}>{lastMsg.text}</div>}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* RIGHT: Active conversation */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.bg, transition: 'all 0.3s ease' }}>
                    {activePatient && (
                        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: colors.surface, transition: 'all 0.3s ease' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <PatientAvatar patientId={activePatient.anonymizedId} size={38} />
                                <div>
                                    <span style={{ fontFamily: fonts.mono, fontSize: 15, fontWeight: 600, color: colors.textPrimary }}>{activePatient.anonymizedId}</span>
                                    <span style={{ marginLeft: 10, fontSize: 13, color: colors.textSecondary, fontFamily: fonts.body }}>{activePatient.diagnosis}</span>
                                </div>
                            </div>
                            <button onClick={() => navigate(`/doctor/patients/${activePatient.anonymizedId}`)}
                                style={{ padding: '6px 14px', borderRadius: 8, background: 'transparent', border: `1px solid ${colors.border}`, color: colors.accent, fontFamily: fonts.body, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease' }}
                                onMouseEnter={e => e.target.style.background = colors.card} onMouseLeave={e => e.target.style.background = 'transparent'}>
                                View Profile →
                            </button>
                        </div>
                    )}

                    {topTrial && (
                        <div style={{ padding: '10px 24px', background: colors.accentGlow, borderBottom: `1px solid ${colors.accent}20`, fontSize: 13, fontFamily: fonts.body, color: colors.accent, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.3s ease' }}>
                            💊 Discussing: {topTrial.name} Trial — {topScore}% match
                        </div>
                    )}

                    <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {activeMessages.map((msg, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'doctor' ? 'flex-end' : 'flex-start' }}>
                                <div style={{ maxWidth: '65%', padding: '12px 16px', borderRadius: msg.sender === 'doctor' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: msg.sender === 'doctor' ? colors.accent : colors.card, color: msg.sender === 'doctor' ? '#fff' : colors.textPrimary, fontFamily: fonts.body, fontSize: 14, lineHeight: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }}>
                                    {msg.text}
                                    <div style={{ fontSize: 10, marginTop: 6, opacity: 0.6, textAlign: msg.sender === 'doctor' ? 'right' : 'left', fontFamily: fonts.mono }}>{msg.time}</div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={{ padding: '16px 24px', borderTop: `1px solid ${colors.border}`, display: 'flex', gap: 12, background: colors.surface, transition: 'all 0.3s ease' }}>
                        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                            placeholder="Type your message…"
                            onFocus={e => { e.target.style.borderColor = colors.accent; e.target.style.boxShadow = `0 0 0 3px ${colors.accentGlow}`; }}
                            onBlur={e => { e.target.style.borderColor = colors.border; e.target.style.boxShadow = 'none'; }}
                            style={{ flex: 1, padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${colors.border}`, background: colors.bg, color: colors.textPrimary, fontFamily: fonts.body, fontSize: 14, transition: 'all 0.3s ease' }} />
                        <button onClick={handleSend} onMouseEnter={() => setSendHover(true)} onMouseLeave={() => setSendHover(false)}
                            style={{ padding: '12px 24px', borderRadius: 10, background: sendHover ? `${colors.accent}dd` : colors.accent, color: '#fff', fontFamily: fonts.body, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
}
