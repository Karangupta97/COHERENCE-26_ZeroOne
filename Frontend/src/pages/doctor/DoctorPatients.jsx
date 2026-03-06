import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme';
import DoctorLayout from '../../components/shared/DoctorLayout';
import StatusBadge from '../../components/shared/StatusBadge';
import PatientAvatar from '../../components/shared/PatientAvatar';
import { PATIENTS } from './data/mockData';
import { motion } from 'framer-motion';
import {
    HiOutlineMagnifyingGlass,
    HiOutlineUserGroup,
    HiOutlineMapPin,
    HiOutlineArrowRight,
    HiOutlineFunnel,
} from 'react-icons/hi2';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function DoctorPatients() {
    const { colors, fonts } = useTheme();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [hoveredCard, setHoveredCard] = useState(null);

    const tabs = [
        { key: 'all', label: 'All Patients' },
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
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        ...card, padding: '20px 24px',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: '12px',
                            background: colors.accentGlow,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <HiOutlineUserGroup style={{ width: 22, height: 22, color: colors.accent }} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '18px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                                Patient Management
                            </h2>
                            <span style={{ fontSize: '13px', color: colors.textSecondary, fontFamily: fonts.body }}>
                                {PATIENTS.length} patients under your care
                            </span>
                        </div>
                    </div>

                    {/* Search */}
                    <div style={{ position: 'relative', width: 320 }}>
                        <HiOutlineMagnifyingGlass style={{
                            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                            width: 16, height: 16, color: colors.textSecondary, pointerEvents: 'none',
                        }} />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by ID or diagnosis…"
                            onFocus={(e) => { e.target.style.borderColor = colors.accent; e.target.style.boxShadow = `0 0 0 3px ${colors.accent}15`; }}
                            onBlur={(e) => { e.target.style.borderColor = colors.border; e.target.style.boxShadow = 'none'; }}
                            style={{
                                width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px',
                                border: `1.5px solid ${colors.border}`, background: colors.card,
                                color: colors.textPrimary, fontFamily: fonts.body, fontSize: '13px',
                                transition: 'all 0.2s ease', outline: 'none',
                            }} />
                    </div>
                </motion.div>

                {/* Filter tabs */}
                <motion.div {...fadeUp} transition={{ delay: 0.05 }}
                    style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {tabs.map(tab => (
                        <button key={tab.key} onClick={() => setActiveFilter(tab.key)}
                            style={{
                                padding: '8px 18px', borderRadius: '20px',
                                fontSize: '12px', fontWeight: activeFilter === tab.key ? 600 : 500,
                                fontFamily: fonts.body,
                                color: activeFilter === tab.key ? '#fff' : colors.textSecondary,
                                background: activeFilter === tab.key ? colors.accent : 'transparent',
                                border: activeFilter === tab.key ? 'none' : `1px solid ${colors.border}`,
                                cursor: 'pointer', transition: 'all 0.2s ease',
                            }}>
                            {tab.label}
                        </button>
                    ))}
                    <span style={{ marginLeft: 'auto', fontSize: '12px', color: colors.textSecondary, fontFamily: fonts.body, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <HiOutlineFunnel style={{ width: 14, height: 14 }} /> {filtered.length} results
                    </span>
                </motion.div>

                {/* Patient cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filtered.map((patient, i) => (
                        <motion.div key={patient.anonymizedId}
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 + i * 0.04 }}
                            onMouseEnter={() => setHoveredCard(i)} onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => navigate(`/doctor/patients/${patient.anonymizedId}`)}
                            style={{
                                ...card,
                                padding: '18px 22px',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                borderColor: hoveredCard === i ? `${colors.accent}50` : colors.border,
                                transform: hoveredCard === i ? 'translateY(-2px)' : 'none',
                                boxShadow: hoveredCard === i ? `0 6px 24px ${colors.accent}10` : colors.shadow,
                                display: 'flex', alignItems: 'center', gap: '18px',
                            }}>
                            <PatientAvatar patientId={patient.anonymizedId} size={44} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                    <span style={{ fontFamily: fonts.heading, fontSize: '14px', fontWeight: 700, color: colors.textPrimary }}>{patient.anonymizedId}</span>
                                    <StatusBadge status={patient.status} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: colors.textSecondary, fontFamily: fonts.body, flexWrap: 'wrap' }}>
                                    <span>{patient.age} · {patient.gender}</span>
                                    <span style={{ opacity: 0.3 }}>|</span>
                                    <span>{patient.diagnosis}</span>
                                    <span style={{ opacity: 0.3 }}>|</span>
                                    <span>{patient.meds}</span>
                                    <span style={{ opacity: 0.3 }}>|</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <HiOutlineMapPin style={{ width: 11, height: 11 }} /> {patient.location}
                                    </span>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '5px 14px', borderRadius: '20px',
                                background: colors.accentGlow, color: colors.accent,
                                fontFamily: fonts.body, fontSize: '12px', fontWeight: 600, flexShrink: 0,
                            }}>
                                {patient.matches} matches
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); navigate(`/doctor/patients/${patient.anonymizedId}`); }}
                                style={{
                                    padding: '8px 16px', borderRadius: '10px',
                                    background: 'transparent', color: colors.accent,
                                    fontFamily: fonts.body, fontSize: '12px', fontWeight: 600,
                                    border: `1px solid ${colors.border}`, cursor: 'pointer',
                                    transition: 'all 0.2s ease', whiteSpace: 'nowrap', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', gap: 4,
                                }}
                                onMouseEnter={(e) => { e.target.style.background = colors.accent; e.target.style.color = '#fff'; e.target.style.borderColor = colors.accent; }}
                                onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = colors.accent; e.target.style.borderColor = colors.border; }}>
                                View <HiOutlineArrowRight style={{ width: 12, height: 12 }} />
                            </button>
                        </motion.div>
                    ))}
                    {filtered.length === 0 && (
                        <div style={{
                            padding: '60px', textAlign: 'center', color: colors.textSecondary,
                            fontFamily: fonts.body, fontSize: '14px', ...card,
                        }}>
                            No patients found matching your search.
                        </div>
                    )}
                </div>
            </div>
        </DoctorLayout>
    );
}
