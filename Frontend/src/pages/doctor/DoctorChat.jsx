import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme';
import DoctorLayout from '../../components/shared/DoctorLayout';
import PatientAvatar from '../../components/shared/PatientAvatar';
import { PATIENTS, CHAT_MESSAGES, MATCH_SCORES, TRIALS, PATIENT_TRIAL_MATCHES } from './data/mockData';
import { motion } from 'framer-motion';
import {
    HiOutlineChatBubbleLeftRight,
    HiOutlinePaperAirplane,
    HiOutlineBeaker,
    HiOutlineArrowRight,
} from 'react-icons/hi2';

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
            <div style={{ display: 'flex', height: 'calc(100vh - 80px)', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${colors.border}`, boxShadow: colors.shadow }}>

                {/* LEFT: Chat list */}
                <div style={{
                    width: '280px', borderRight: `1px solid ${colors.border}`,
                    overflowY: 'auto', background: colors.surface, flexShrink: 0,
                    display: 'flex', flexDirection: 'column',
                }}>
                    <div style={{ padding: '20px 20px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${colors.border}` }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '8px',
                            background: colors.accentGlow,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <HiOutlineChatBubbleLeftRight style={{ width: 16, height: 16, color: colors.accent }} />
                        </div>
                        <span style={{ fontFamily: fonts.heading, fontSize: '16px', fontWeight: 700, color: colors.textPrimary }}>Messages</span>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {PATIENTS.map(p => {
                            const lastMsg = (messages[p.anonymizedId] || []).slice(-1)[0];
                            const unread = p.anonymizedId !== activeChat && (messages[p.anonymizedId] || []).filter(m => m.sender === 'patient').length > 0 ? 1 : 0;
                            const active = activeChat === p.anonymizedId;
                            return (
                                <div key={p.anonymizedId} onClick={() => { setActiveChat(p.anonymizedId); navigate(`/doctor/chat/${p.anonymizedId}`, { replace: true }); }}
                                    style={{
                                        padding: '14px 18px', cursor: 'pointer',
                                        background: active ? colors.accentGlow : 'transparent',
                                        borderLeft: active ? `3px solid ${colors.accent}` : '3px solid transparent',
                                        transition: 'all 0.2s ease',
                                        display: 'flex', gap: 12, alignItems: 'center',
                                    }}
                                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = colors.card; }}
                                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                                    <PatientAvatar patientId={p.anonymizedId} size={40} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                            <span style={{ fontFamily: fonts.heading, fontSize: '13px', fontWeight: 600, color: colors.textPrimary }}>{p.anonymizedId}</span>
                                            {unread > 0 && <span style={{
                                                width: 18, height: 18, borderRadius: '50%', background: colors.accent,
                                                color: '#fff', fontSize: '10px', fontWeight: 700,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>{unread}</span>}
                                        </div>
                                        <div style={{ fontSize: '11px', color: colors.textSecondary, fontFamily: fonts.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.diagnosis}</div>
                                        {lastMsg && <div style={{ fontSize: '10px', color: colors.textSecondary, fontFamily: fonts.body, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.6 }}>{lastMsg.text}</div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT: Active conversation */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.bg }}>
                    {activePatient && (
                        <div style={{
                            padding: '14px 24px', borderBottom: `1px solid ${colors.border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            background: colors.surface,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <PatientAvatar patientId={activePatient.anonymizedId} size={38} />
                                <div>
                                    <span style={{ fontFamily: fonts.heading, fontSize: '14px', fontWeight: 700, color: colors.textPrimary }}>{activePatient.anonymizedId}</span>
                                    <span style={{ marginLeft: 10, fontSize: '12px', color: colors.textSecondary, fontFamily: fonts.body }}>{activePatient.diagnosis}</span>
                                </div>
                            </div>
                            <button onClick={() => navigate(`/doctor/patients/${activePatient.anonymizedId}`)}
                                style={{
                                    padding: '7px 16px', borderRadius: '8px',
                                    background: 'transparent', border: `1px solid ${colors.border}`,
                                    color: colors.accent, fontFamily: fonts.body, fontSize: '12px', fontWeight: 600,
                                    cursor: 'pointer', transition: 'all 0.2s ease',
                                    display: 'flex', alignItems: 'center', gap: 4,
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = colors.accentGlow; e.currentTarget.style.borderColor = colors.accent; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = colors.border; }}>
                                Profile <HiOutlineArrowRight style={{ width: 12, height: 12 }} />
                            </button>
                        </div>
                    )}

                    {topTrial && (
                        <div style={{
                            padding: '10px 24px', background: colors.accentGlow,
                            borderBottom: `1px solid ${colors.accent}15`,
                            fontSize: '12px', fontFamily: fonts.body, color: colors.accent, fontWeight: 600,
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                            <HiOutlineBeaker style={{ width: 14, height: 14 }} />
                            Discussing: {topTrial.name} Trial — {topScore}% match
                        </div>
                    )}

                    <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {activeMessages.map((msg, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                style={{ display: 'flex', justifyContent: msg.sender === 'doctor' ? 'flex-end' : 'flex-start' }}>
                                <div style={{
                                    maxWidth: '65%', padding: '12px 16px',
                                    borderRadius: msg.sender === 'doctor' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                    background: msg.sender === 'doctor' ? colors.accent : colors.surface,
                                    color: msg.sender === 'doctor' ? '#fff' : colors.textPrimary,
                                    fontFamily: fonts.body, fontSize: '13px', lineHeight: 1.6,
                                    boxShadow: `0 1px 6px ${colors.accent}08`,
                                    border: msg.sender === 'doctor' ? 'none' : `1px solid ${colors.border}`,
                                }}>
                                    {msg.text}
                                    <div style={{ fontSize: '10px', marginTop: 6, opacity: 0.5, textAlign: msg.sender === 'doctor' ? 'right' : 'left', fontFamily: fonts.body }}>{msg.time}</div>
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={{
                        padding: '16px 24px', borderTop: `1px solid ${colors.border}`,
                        display: 'flex', gap: 10, background: colors.surface,
                    }}>
                        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                            placeholder="Type your message…"
                            onFocus={e => { e.target.style.borderColor = colors.accent; e.target.style.boxShadow = `0 0 0 3px ${colors.accent}12`; }}
                            onBlur={e => { e.target.style.borderColor = colors.border; e.target.style.boxShadow = 'none'; }}
                            style={{
                                flex: 1, padding: '11px 16px', borderRadius: '10px',
                                border: `1.5px solid ${colors.border}`, background: colors.card,
                                color: colors.textPrimary, fontFamily: fonts.body, fontSize: '13px',
                                transition: 'all 0.2s ease', outline: 'none',
                            }} />
                        <button onClick={handleSend}
                            onMouseEnter={() => setSendHover(true)} onMouseLeave={() => setSendHover(false)}
                            style={{
                                padding: '11px 22px', borderRadius: '10px',
                                background: sendHover ? `${colors.accent}dd` : colors.accent,
                                color: '#fff', fontFamily: fonts.body, fontSize: '13px', fontWeight: 600,
                                border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
                                display: 'flex', alignItems: 'center', gap: 6,
                            }}>
                            Send <HiOutlinePaperAirplane style={{ width: 14, height: 14 }} />
                        </button>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
}
