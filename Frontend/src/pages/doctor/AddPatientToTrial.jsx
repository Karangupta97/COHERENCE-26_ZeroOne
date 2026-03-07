// ============================================================
//  AddPatientToTrial — Doctor refers a patient to a trial
// ============================================================

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme';
import DoctorLayout from '../../components/shared/DoctorLayout';
import { motion } from 'framer-motion';
import {
    HiOutlineUserPlus,
    HiOutlineBeaker,
    HiOutlineUserCircle,
    HiOutlineMagnifyingGlass,
    HiOutlineCheckCircle,
    HiOutlineMapPin,
    HiOutlineDocumentText,
    HiOutlineArrowRight,
    HiOutlineExclamationTriangle,
    HiOutlineSparkles,
    HiOutlineXMark,
    HiOutlineClipboardDocumentList,
} from 'react-icons/hi2';

const fadeUpInitial = { opacity: 0, y: 16 };
const fadeUpAnimate = { opacity: 1, y: 0 };

export default function AddPatientToTrial() {
    const { colors, fonts, radius, fontSize } = useTheme();
    const navigate = useNavigate();

    const [trials, setTrials] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedTrial, setSelectedTrial] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [referralNotes, setReferralNotes] = useState('');
    const [trialSearch, setTrialSearch] = useState('');
    const [patientSearch, setPatientSearch] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null); // { ok, message }
    const [focusedField, setFocusedField] = useState(null);

    // Track whether the entrance animation has already played
    const hasAnimated = useRef(false);
    useEffect(() => {
        if (!loading) {
            // Set after a tick so the first render with content gets the animation
            const t = setTimeout(() => { hasAnimated.current = true; }, 600);
            return () => clearTimeout(t);
        }
    }, [loading]);

    const card = {
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        boxShadow: colors.shadow,
    };

    const inputBase = {
        padding: '10px 14px',
        background: colors.surface,
        border: `1.5px solid ${colors.border}`,
        borderRadius: radius?.md || '10px',
        color: colors.textPrimary,
        fontFamily: fonts.body,
        fontSize: fontSize?.sm || '14px',
        outline: 'none',
        transition: 'all 0.2s ease',
        width: '100%',
        boxSizing: 'border-box',
    };

    // ── Fetch trials & patients on mount ──────
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }

        Promise.all([
            fetch('/api/trials/all', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
            fetch('/api/enrollments/patients', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        ])
            .then(([trialsData, patientsData]) => {
                if (trialsData.ok) setTrials(trialsData.data);
                if (patientsData.ok) setPatients(patientsData.data);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    // ── Filtered lists ────────────────────────
    const filteredTrials = useMemo(() => {
        if (!trialSearch) return trials;
        const q = trialSearch.toLowerCase();
        return trials.filter(t =>
            t.trialName.toLowerCase().includes(q) ||
            t.trialId.toLowerCase().includes(q) ||
            t.category?.toLowerCase().includes(q) ||
            t.location?.toLowerCase().includes(q)
        );
    }, [trials, trialSearch]);

    const filteredPatients = useMemo(() => {
        if (!patientSearch) return patients;
        const q = patientSearch.toLowerCase();
        return patients.filter(p =>
            (p.anonymizedId || '').toLowerCase().includes(q) ||
            `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
            (p.diagnosis || '').toLowerCase().includes(q) ||
            (p.location || '').toLowerCase().includes(q)
        );
    }, [patients, patientSearch]);

    // ── Submit referral ───────────────────────
    const handleSubmit = async () => {
        if (!selectedTrial || !selectedPatient) return;
        setSubmitting(true);
        setResult(null);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/enrollments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    trialId: selectedTrial._id,
                    patientId: selectedPatient._id,
                    referralNotes,
                }),
            });
            const data = await res.json();
            if (res.ok && data.ok) {
                setResult({ ok: true, message: data.message });
            } else {
                setResult({ ok: false, message: data.message || 'Failed to refer patient.' });
            }
        } catch {
            setResult({ ok: false, message: 'Network error. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setSelectedTrial(null);
        setSelectedPatient(null);
        setReferralNotes('');
        setTrialSearch('');
        setPatientSearch('');
        setResult(null);
    };

    // ── Success View ──────────────────────────
    if (result?.ok) {
        return (
            <DoctorLayout>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    style={{
                        ...card, padding: '60px 40px', maxWidth: 600, margin: '40px auto',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center',
                    }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                        style={{
                            width: 80, height: 80, borderRadius: '50%',
                            background: colors.greenGlow || `${colors.green}15`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                        <HiOutlineCheckCircle style={{ width: 40, height: 40, color: colors.green }} />
                    </motion.div>
                    <h2 style={{ margin: 0, fontFamily: fonts.heading, fontSize: '22px', fontWeight: 700, color: colors.textPrimary }}>
                        Patient Referred Successfully!
                    </h2>
                    <p style={{ margin: 0, fontSize: '14px', color: colors.textSecondary, maxWidth: 400 }}>
                        <strong>{selectedPatient?.anonymizedId || `${selectedPatient?.firstName} ${selectedPatient?.lastName}`}</strong> has been referred to <strong>{selectedTrial?.trialName}</strong>. The clinic will review and approve.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={resetForm}
                            style={{
                                padding: '10px 24px', borderRadius: radius?.md || '10px',
                                background: colors.accent, color: '#fff', border: 'none',
                                fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: fonts.body,
                            }}>
                            Refer Another Patient
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/doctor/patients')}
                            style={{
                                padding: '10px 24px', borderRadius: radius?.md || '10px',
                                background: 'transparent', color: colors.textSecondary,
                                border: `1px solid ${colors.border}`,
                                fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: fonts.body,
                            }}>
                            View Patients
                        </motion.button>
                    </div>
                </motion.div>
            </DoctorLayout>
        );
    }

    return (
        <DoctorLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: 1400 }}>

                {/* Header */}
                <motion.div initial={hasAnimated.current ? false : fadeUpInitial} animate={fadeUpAnimate} transition={{ duration: 0.4 }}
                    style={{ ...card, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: '12px',
                            background: colors.accentGlow,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <HiOutlineUserPlus style={{ width: 22, height: 22, color: colors.accent }} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '18px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                                Add Patient to Trial
                            </h2>
                            <span style={{ fontSize: '13px', color: colors.textSecondary, fontFamily: fonts.body }}>
                                Select a trial and a patient to create a referral
                            </span>
                        </div>
                    </div>
                </motion.div>

                {loading ? (
                    <div style={{ ...card, padding: '60px', textAlign: 'center' }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                            style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${colors.border}`, borderTopColor: colors.accent, margin: '0 auto 16px' }} />
                        <p style={{ color: colors.textSecondary, fontFamily: fonts.body }}>Loading trials & patients...</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                        {/* ── Left: Select Trial ────────── */}
                        <motion.div initial={hasAnimated.current ? false : fadeUpInitial} animate={fadeUpAnimate} transition={{ duration: 0.4, delay: 0.1 }}
                            style={{ ...card, padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <HiOutlineBeaker style={{ width: 18, height: 18, color: colors.accent }} />
                                <h3 style={{ margin: 0, fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                                    1. Select Trial
                                </h3>
                                {selectedTrial && (
                                    <HiOutlineCheckCircle style={{ width: 16, height: 16, color: colors.green, marginLeft: 'auto' }} />
                                )}
                            </div>

                            {/* Search */}
                            <div style={{ position: 'relative' }}>
                                <HiOutlineMagnifyingGlass style={{
                                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                                    width: 16, height: 16, color: colors.textSecondary,
                                }} />
                                <input
                                    style={{ ...inputBase, paddingLeft: 36 }}
                                    placeholder="Search trials by name, category, location..."
                                    value={trialSearch}
                                    onChange={e => setTrialSearch(e.target.value)}
                                />
                            </div>

                            {/* Trial list */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: 340, overflowY: 'auto' }}>
                                {filteredTrials.length === 0 ? (
                                    <p style={{ padding: '20px', textAlign: 'center', color: colors.textSecondary, fontSize: '13px' }}>
                                        {trials.length === 0 ? 'No recruiting trials found.' : 'No trials match your search.'}
                                    </p>
                                ) : (
                                    filteredTrials.map(trial => {
                                        const isSelected = selectedTrial?._id === trial._id;
                                        return (
                                            <div key={trial._id}
                                                onClick={() => setSelectedTrial(trial)}
                                                style={{
                                                    padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
                                                    border: `1.5px solid ${isSelected ? colors.accent : colors.border}`,
                                                    background: isSelected ? (colors.accentGlow || `${colors.accent}08`) : colors.card,
                                                    transition: 'all 0.2s',
                                                }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                    <span style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>
                                                        {trial.trialName}
                                                    </span>
                                                    <span style={{
                                                        fontSize: '10px', fontWeight: 600, padding: '2px 8px',
                                                        borderRadius: '6px', fontFamily: fonts.body,
                                                        background: `${colors.accent}15`, color: colors.accent,
                                                    }}>
                                                        {trial.phase}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: colors.textSecondary, fontFamily: fonts.body }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                        <HiOutlineBeaker style={{ width: 12, height: 12 }} /> {trial.category}
                                                    </span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                        <HiOutlineMapPin style={{ width: 12, height: 12 }} /> {trial.location}
                                                    </span>
                                                    <span style={{
                                                        marginLeft: 'auto', fontSize: '11px', fontWeight: 600,
                                                        color: trial.slots <= 3 ? (colors.red || '#EF4444') : colors.green,
                                                    }}>
                                                        {trial.slots} slots
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </motion.div>

                        {/* ── Right: Select Patient ─────── */}
                        <motion.div initial={hasAnimated.current ? false : fadeUpInitial} animate={fadeUpAnimate} transition={{ duration: 0.4, delay: 0.2 }}
                            style={{ ...card, padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <HiOutlineUserCircle style={{ width: 18, height: 18, color: colors.accent }} />
                                <h3 style={{ margin: 0, fontSize: '15px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                                    2. Select Patient
                                </h3>
                                {selectedPatient && (
                                    <HiOutlineCheckCircle style={{ width: 16, height: 16, color: colors.green, marginLeft: 'auto' }} />
                                )}
                            </div>

                            {/* Search */}
                            <div style={{ position: 'relative' }}>
                                <HiOutlineMagnifyingGlass style={{
                                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                                    width: 16, height: 16, color: colors.textSecondary,
                                }} />
                                <input
                                    style={{ ...inputBase, paddingLeft: 36 }}
                                    placeholder="Search patients by name, ID, diagnosis..."
                                    value={patientSearch}
                                    onChange={e => setPatientSearch(e.target.value)}
                                />
                            </div>

                            {/* Patient list */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: 340, overflowY: 'auto' }}>
                                {filteredPatients.length === 0 ? (
                                    <p style={{ padding: '20px', textAlign: 'center', color: colors.textSecondary, fontSize: '13px' }}>
                                        {patients.length === 0 ? 'No patients found.' : 'No patients match your search.'}
                                    </p>
                                ) : (
                                    filteredPatients.map(patient => {
                                        const isSelected = selectedPatient?._id === patient._id;
                                        const name = patient.anonymizedId || `${patient.firstName} ${patient.lastName}`;
                                        return (
                                            <div key={patient._id}
                                                onClick={() => setSelectedPatient(patient)}
                                                style={{
                                                    padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
                                                    border: `1.5px solid ${isSelected ? colors.accent : colors.border}`,
                                                    background: isSelected ? (colors.accentGlow || `${colors.accent}08`) : colors.card,
                                                    transition: 'all 0.2s',
                                                }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{
                                                            width: 32, height: 32, borderRadius: '50%',
                                                            background: `linear-gradient(135deg, ${colors.accent}, ${colors.green || colors.accent})`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: '#fff', fontSize: '11px', fontWeight: 700, fontFamily: fonts.heading,
                                                        }}>
                                                            {(patient.firstName?.[0] || 'P').toUpperCase()}
                                                        </div>
                                                        <span style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.body }}>
                                                            {name}
                                                        </span>
                                                    </div>
                                                    {patient.gender && (
                                                        <span style={{ fontSize: '11px', color: colors.textSecondary, fontFamily: fonts.body }}>
                                                            {patient.age && `${patient.age}y`}{patient.gender && ` · ${patient.gender}`}
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: colors.textSecondary, fontFamily: fonts.body }}>
                                                    {patient.diagnosis && (
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                            <HiOutlineClipboardDocumentList style={{ width: 12, height: 12 }} /> {patient.diagnosis}
                                                        </span>
                                                    )}
                                                    {patient.location && (
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', marginLeft: 'auto' }}>
                                                            <HiOutlineMapPin style={{ width: 12, height: 12 }} /> {patient.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* ── Bottom: Notes + Submit ───────── */}
                {!loading && (
                    <motion.div initial={hasAnimated.current ? false : fadeUpInitial} animate={fadeUpAnimate} transition={{ duration: 0.4, delay: 0.3 }}
                        style={{ ...card, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Selected summary */}
                        {(selectedTrial || selectedPatient) && (
                            <div style={{
                                display: 'flex', gap: '12px', padding: '12px 16px',
                                background: colors.accentGlow || `${colors.accent}06`,
                                border: `1px solid ${colors.accent}20`,
                                borderRadius: '10px',
                                flexWrap: 'wrap',
                            }}>
                                <div style={{ flex: 1, minWidth: 200 }}>
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Trial
                                    </span>
                                    <p style={{ margin: '2px 0 0', fontSize: '14px', fontWeight: 600, color: selectedTrial ? colors.accent : colors.textSecondary }}>
                                        {selectedTrial ? `${selectedTrial.trialName} (${selectedTrial.phase})` : 'Not selected'}
                                    </p>
                                </div>
                                <div style={{ width: 1, background: colors.border, alignSelf: 'stretch' }} />
                                <div style={{ flex: 1, minWidth: 200 }}>
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Patient
                                    </span>
                                    <p style={{ margin: '2px 0 0', fontSize: '14px', fontWeight: 600, color: selectedPatient ? colors.accent : colors.textSecondary }}>
                                        {selectedPatient
                                            ? (selectedPatient.anonymizedId || `${selectedPatient.firstName} ${selectedPatient.lastName}`)
                                            : 'Not selected'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Referral notes */}
                        <div>
                            <label style={{
                                fontSize: '11px', fontWeight: 600, color: colors.textSecondary,
                                textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px',
                                display: 'flex', alignItems: 'center', gap: '6px',
                            }}>
                                <HiOutlineDocumentText style={{ width: 13, height: 13 }} /> Referral Notes (optional)
                            </label>
                            <textarea
                                style={{
                                    ...inputBase,
                                    minHeight: '100px', resize: 'vertical',
                                    borderColor: focusedField === 'notes' ? colors.accent : colors.border,
                                    boxShadow: focusedField === 'notes' ? `0 0 0 3px ${colors.accent}15` : 'none',
                                }}
                                placeholder="Add clinical notes, reason for referral, relevant observations..."
                                value={referralNotes}
                                onChange={e => setReferralNotes(e.target.value)}
                                onFocus={() => setFocusedField('notes')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </div>

                        {/* Error message */}
                        {result && !result.ok && (
                            <div style={{
                                padding: '10px 14px', borderRadius: '10px',
                                background: `${colors.red || '#EF4444'}10`, border: `1px solid ${colors.red || '#EF4444'}30`,
                                display: 'flex', alignItems: 'center', gap: '8px',
                                fontSize: '13px', color: colors.red || '#EF4444', fontFamily: fonts.body,
                            }}>
                                <HiOutlineExclamationTriangle style={{ width: 16, height: 16, flexShrink: 0 }} />
                                {result.message}
                            </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/doctor/patients')}
                                style={{
                                    padding: '10px 20px', borderRadius: radius?.md || '10px',
                                    background: 'transparent', color: colors.textSecondary,
                                    border: `1px solid ${colors.border}`,
                                    fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: fonts.body,
                                }}>
                                Cancel
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                disabled={!selectedTrial || !selectedPatient || submitting}
                                style={{
                                    padding: '10px 28px', borderRadius: radius?.md || '10px',
                                    background: (!selectedTrial || !selectedPatient || submitting)
                                        ? `${colors.border}60`
                                        : `linear-gradient(135deg, ${colors.accent}, ${colors.green || colors.accent})`,
                                    color: (!selectedTrial || !selectedPatient || submitting) ? colors.textSecondary : '#fff',
                                    border: 'none', fontSize: '14px', fontWeight: 700,
                                    cursor: (!selectedTrial || !selectedPatient || submitting) ? 'not-allowed' : 'pointer',
                                    fontFamily: fonts.body,
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    boxShadow: (!selectedTrial || !selectedPatient || submitting) ? 'none' : `0 4px 16px ${colors.accent}30`,
                                }}>
                                {submitting ? (
                                    <>
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                            style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                                        Referring...
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineUserPlus style={{ width: 16, height: 16 }} /> Refer Patient to Trial
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </div>
        </DoctorLayout>
    );
}
