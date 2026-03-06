import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme';
import DoctorLayout from '../../components/shared/DoctorLayout';
import { PATIENTS, TRIALS, PATIENT_TRIAL_MATCHES, MATCH_SCORES } from './data/mockData';
import { motion } from 'framer-motion';
import {
    HiOutlineBeaker,
    HiOutlineMapPin,
    HiOutlineBuildingOffice2,
    HiOutlineBanknotes,
    HiOutlineUserGroup,
    HiOutlineArrowRight,
} from 'react-icons/hi2';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function DoctorTrials() {
    const { colors, fonts } = useTheme();
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState(null);

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
                            <HiOutlineBeaker style={{ width: 22, height: 22, color: colors.accent }} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '18px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                                Trial Matches
                            </h2>
                            <span style={{ fontSize: '13px', color: colors.textSecondary, fontFamily: fonts.body }}>
                                {TRIALS.length} active trials with patient matches
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Trial cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {TRIALS.map((trial, i) => {
                        const matchedPatients = PATIENTS.filter(p => (PATIENT_TRIAL_MATCHES[p.id] || []).includes(trial.id));
                        return (
                            <motion.div
                                key={trial.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 + i * 0.05 }}
                                onMouseEnter={() => setHoveredCard(i)}
                                onMouseLeave={() => setHoveredCard(null)}
                                style={{
                                    ...card,
                                    padding: '20px 24px',
                                    transition: 'all 0.25s ease',
                                    borderColor: hoveredCard === i ? `${colors.accent}50` : colors.border,
                                    transform: hoveredCard === i ? 'translateY(-2px)' : 'none',
                                    boxShadow: hoveredCard === i ? `0 6px 24px ${colors.accent}10` : colors.shadow,
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                            <span style={{ fontFamily: fonts.heading, fontSize: '16px', fontWeight: 700, color: colors.textPrimary }}>{trial.name}</span>
                                            <span style={{
                                                padding: '3px 12px', borderRadius: '20px', fontSize: '11px',
                                                fontFamily: fonts.body, background: colors.accentGlow,
                                                color: colors.accent, fontWeight: 600,
                                            }}>{trial.phase}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: colors.textSecondary, fontFamily: fonts.body, flexWrap: 'wrap' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <HiOutlineBuildingOffice2 style={{ width: 13, height: 13, color: colors.accent }} /> {trial.sponsor}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <HiOutlineMapPin style={{ width: 13, height: 13, color: colors.accent }} /> {trial.location}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <HiOutlineUserGroup style={{ width: 13, height: 13, color: colors.accent }} /> {trial.slots} slots
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <HiOutlineBanknotes style={{ width: 13, height: 13, color: colors.accent }} /> {trial.compensation}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '5px 14px', borderRadius: '20px',
                                        background: colors.greenGlow, color: colors.green,
                                        fontFamily: fonts.body, fontSize: '12px', fontWeight: 600, flexShrink: 0,
                                    }}>
                                        {matchedPatients.length} matches
                                    </div>
                                </div>

                                {matchedPatients.length > 0 && (
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {matchedPatients.map(p => {
                                            const score = MATCH_SCORES[p.id]?.[trial.id] || 0;
                                            return (
                                                <motion.button
                                                    key={p.id}
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => navigate(`/doctor/patients/${p.id}`)}
                                                    style={{
                                                        padding: '5px 14px', borderRadius: '8px',
                                                        background: colors.card,
                                                        border: `1px solid ${colors.border}`,
                                                        color: colors.accent, fontFamily: fonts.body,
                                                        fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        display: 'flex', alignItems: 'center', gap: 4,
                                                    }}>
                                                    {p.id} · {score}%
                                                    <HiOutlineArrowRight style={{ width: 10, height: 10 }} />
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </DoctorLayout>
    );
}
