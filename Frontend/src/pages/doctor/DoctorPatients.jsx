import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme';
import DoctorLayout from '../../components/shared/DoctorLayout';
import StatusBadge from '../../components/shared/StatusBadge';
import PatientAvatar from '../../components/shared/PatientAvatar';
import { PATIENTS } from './data/mockData';

export default function DoctorPatients() {
    const { colors, fonts } = useTheme();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [hoveredCard, setHoveredCard] = useState(null);

    const tabs = [
        { key: 'all', label: 'All' },
        { key: 'awaiting', label: 'Awaiting Review' },
        { key: 'referred', label: 'Referred' },
        { key: 'enrolled', label: 'Enrolled' },
        { key: 'screening', label: 'Screening' },
    ];

    const filtered = useMemo(() => {
        return PATIENTS.filter(p => {
            const matchesSearch = !search ||
                p.anonymizedId.toLowerCase().includes(search.toLowerCase()) ||
                p.diagnosis.toLowerCase().includes(search.toLowerCase());
            const matchesFilter = activeFilter === 'all' || p.status === activeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [search, activeFilter]);

    return (
        <DoctorLayout>
            <div className="page-enter" style={{ padding: '28px 32px', maxWidth: '1200px' }}>
                <p style={{ fontFamily: fonts.body, fontSize: '15px', color: colors.textSecondary, margin: '0 0 20px 0' }}>{PATIENTS.length} patients under your care</p>

                {/* Search bar */}
                <div style={{ marginBottom: '20px' }}>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Patient ID or diagnosis…"
                        onFocus={(e) => { e.target.style.borderColor = colors.accent; e.target.style.boxShadow = `0 0 0 3px ${colors.accentGlow}`; }}
                        onBlur={(e) => { e.target.style.borderColor = colors.border; e.target.style.boxShadow = 'none'; }}
                        style={{
                            width: '100%', maxWidth: '480px', padding: '12px 16px 12px 40px', borderRadius: '10px', border: `1.5px solid ${colors.border}`, background: colors.surface, color: colors.textPrimary, fontFamily: fonts.body, fontSize: '14px', transition: 'all 0.3s ease',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237DB3CC' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: '14px center'
                        }} />
                </div>

                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    {tabs.map(tab => (
                        <button key={tab.key} onClick={() => setActiveFilter(tab.key)}
                            style={{ padding: '8px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: activeFilter === tab.key ? 600 : 500, fontFamily: fonts.body, color: activeFilter === tab.key ? '#fff' : colors.textSecondary, background: activeFilter === tab.key ? colors.accent : 'transparent', border: activeFilter === tab.key ? 'none' : `1px solid ${colors.border}`, cursor: 'pointer', transition: 'all 0.2s ease' }}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Patient cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filtered.map((patient, i) => (
                        <div key={patient.anonymizedId} onMouseEnter={() => setHoveredCard(i)} onMouseLeave={() => setHoveredCard(null)} onClick={() => navigate(`/doctor/patients/${patient.anonymizedId}`)}
                            style={{ background: colors.card, borderRadius: '14px', padding: '20px 24px', border: `1px solid ${hoveredCard === i ? colors.accent + '40' : colors.border}`, boxShadow: colors.shadow, cursor: 'pointer', transition: 'all 0.3s ease', transform: hoveredCard === i ? 'translateY(-1px)' : 'none', display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <PatientAvatar patientId={patient.anonymizedId} size={48} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                    <span style={{ fontFamily: fonts.mono, fontSize: '15px', fontWeight: 600, color: colors.textPrimary }}>{patient.anonymizedId}</span>
                                    <StatusBadge status={patient.status} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: colors.textSecondary, fontFamily: fonts.body, flexWrap: 'wrap' }}>
                                    <span>{patient.age} · {patient.gender}</span>
                                    <span style={{ opacity: 0.4 }}>|</span>
                                    <span>{patient.diagnosis}</span>
                                    <span style={{ opacity: 0.4 }}>|</span>
                                    <span>{patient.meds}</span>
                                    <span style={{ opacity: 0.4 }}>|</span>
                                    <span>📍 {patient.location}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '9999px', background: colors.accentGlow, color: colors.accent, fontFamily: fonts.mono, fontSize: '13px', fontWeight: 600, flexShrink: 0 }}>
                                {patient.matches} matches
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); navigate(`/doctor/patients/${patient.anonymizedId}`); }}
                                style={{ padding: '8px 18px', borderRadius: '8px', background: 'transparent', color: colors.accent, fontFamily: fonts.body, fontSize: '13px', fontWeight: 600, border: `1px solid ${colors.accent}30`, cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap', flexShrink: 0 }}
                                onMouseEnter={(e) => { e.target.style.background = colors.accent; e.target.style.color = '#fff'; }}
                                onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = colors.accent; }}>
                                View Details →
                            </button>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div style={{ padding: '48px', textAlign: 'center', color: colors.textSecondary, fontFamily: fonts.body, fontSize: '15px' }}>No patients found matching your search.</div>
                    )}
                </div>
            </div>
        </DoctorLayout>
    );
}
