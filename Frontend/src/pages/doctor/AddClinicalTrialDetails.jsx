import React, { useState } from 'react';
import { useTheme } from '../../theme';
import DoctorLayout from '../../components/shared/DoctorLayout';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineDocumentText,
    HiOutlineCheckCircle,
    HiOutlineExclamationTriangle,
    HiOutlineMagnifyingGlass,
    HiOutlineUserCircle,
    HiOutlineArrowRight,
    HiOutlineArrowLeft,
    HiOutlineClipboardDocumentList,
    HiOutlineBeaker,
    HiOutlineHeart,
    HiOutlineShieldCheck,
    HiOutlineSparkles,
    HiOutlineMapPin,
    HiOutlineEye,
    HiOutlineXMark,
    HiOutlineArrowPath,
} from 'react-icons/hi2';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

const MEDICAL_HISTORY_OPTIONS = [
    'Hypertension',
    'Type 2 Diabetes Mellitus',
    'Type 1 Diabetes Mellitus',
    'Asthma',
    'COPD',
    'Coronary Artery Disease',
    'Heart Failure',
    'Atrial Fibrillation',
    'Stroke',
    'Chronic Kidney Disease',
    'Hypothyroidism',
    'Hyperthyroidism',
    'Rheumatoid Arthritis',
    'Osteoarthritis',
    'Osteoporosis',
    'Depression',
    'Anxiety Disorder',
    'Epilepsy',
    'Migraine',
    'GERD',
    'Peptic Ulcer Disease',
    'Irritable Bowel Syndrome',
    'Crohn\'s Disease',
    'Ulcerative Colitis',
    'Hepatitis B',
    'Hepatitis C',
    'HIV/AIDS',
    'Tuberculosis',
    'Anemia',
    'Deep Vein Thrombosis',
    'Pulmonary Embolism',
    'Sleep Apnea',
    'Psoriasis',
    'Eczema',
    'Lupus (SLE)',
    'Multiple Sclerosis',
    'Parkinson\'s Disease',
    'Alzheimer\'s Disease',
    'Cancer (specify)',
    'Obesity',
    'Hyperlipidemia',
];

const EMPTY_FORM = {
    age: '',
    gender: '',
    primaryDiagnosis: '',
    secondaryDiagnoses: '',
    diagnosisDate: '',
    medicalHistory: '',
    surgicalHistory: '',
    familyHistory: '',
    currentMedications: [{ name: '', dosage: '', frequency: '' }],
    allergies: '',
    bloodGroup: '',
    smokingStatus: '',
    alcoholUse: '',
    // Vitals
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    weight: '',
    height: '',
    bmi: '',
    // Labs
    hba1c: '',
    creatinine: '',
    alt: '',
    ast: '',
    hemoglobin: '',
    plateletCount: '',
    wbc: '',
    // Eligibility
    ecogPerformanceStatus: '',
    hasAdequateOrganFunction: '',
    isPregnantOrNursing: '',
    hasInformedConsent: '',
    // Notes
    inclusionNotes: '',
    exclusionNotes: '',
    doctorRemarks: '',
};

export default function AddClinicalTrialDetails() {
    const { colors, fonts, radius } = useTheme();

    // ── State ──────────────────────────────────────
    const [anonymizedId, setAnonymizedId] = useState('');
    const [patientVerified, setPatientVerified] = useState(false);
    const [patientInfo, setPatientInfo] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState('');

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [currentStep, setCurrentStep] = useState(0);

    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [focusedField, setFocusedField] = useState(null);
    const [matchedTrials, setMatchedTrials] = useState([]);
    const [matchLoading, setMatchLoading] = useState(false);
    const [expandedTrial, setExpandedTrial] = useState(null);
    const [aiAnalyzing, setAiAnalyzing] = useState(false);
    const [aiProgress, setAiProgress] = useState(0);

    // ── Style helpers ──────────────────────────────
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
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s ease',
        width: '100%',
        boxSizing: 'border-box',
    };

    const labelStyle = {
        fontSize: '11px',
        fontWeight: 600,
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        marginBottom: '6px',
        display: 'block',
    };

    const focusedInput = (field) => ({
        ...inputBase,
        borderColor: focusedField === field ? colors.accent : colors.border,
        boxShadow: focusedField === field ? `0 0 0 3px ${colors.accent}15` : 'none',
    });

    // ── Handlers ───────────────────────────────────
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleMedChange = (index, key, value) => {
        setFormData(prev => {
            const meds = [...prev.currentMedications];
            meds[index] = { ...meds[index], [key]: value };
            return { ...prev, currentMedications: meds };
        });
    };

    const addMedication = () => {
        setFormData(prev => ({
            ...prev,
            currentMedications: [...prev.currentMedications, { name: '', dosage: '', frequency: '' }],
        }));
    };

    const removeMedication = (index) => {
        setFormData(prev => ({
            ...prev,
            currentMedications: prev.currentMedications.filter((_, i) => i !== index),
        }));
    };

    // ── Verify patient ─────────────────────────────
    const handleVerify = async () => {
        const id = anonymizedId.trim().toUpperCase();
        if (!id || !/^ANON-[A-F0-9]{8}$/i.test(id)) {
            setVerifyError('Please enter a valid ID in format ANON-XXXXXXXX');
            return;
        }
        // Role pre-check
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role && user.role !== 'doctor') {
                setVerifyError(`Access denied. You are logged in as "${user.role}". Only doctors can submit clinical trial details.`);
                return;
            }
        } catch { /* proceed to API */ }
        setVerifying(true);
        setVerifyError('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/clinical-details/verify/${encodeURIComponent(id)}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok && data.ok) {
                setPatientVerified(true);
                setPatientInfo(data.data);
                setAnonymizedId(id);
                // Pre-fill form with existing patient data
                setFormData(prev => ({
                    ...prev,
                    age: data.data.age || '',
                    gender: data.data.gender || '',
                    bloodGroup: data.data.bloodGroup || '',
                }));
            } else {
                if (res.status === 403) {
                    setVerifyError('Access denied. Only doctor accounts can use this feature. Please log in with a doctor account.');
                } else {
                    setVerifyError(data.message || 'Patient not found.');
                }
            }
        } catch {
            setVerifyError('Network error. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    // ── Submit form ────────────────────────────────
    const handleSubmit = async () => {
        setSubmitting(true);
        setResult(null);
        try {
            const token = localStorage.getItem('token');

            // Build payload
            const payload = {
                anonymizedId,
                age: formData.age ? Number(formData.age) : undefined,
                gender: formData.gender || undefined,
                ethnicity: undefined,
                primaryDiagnosis: formData.primaryDiagnosis || undefined,
                secondaryDiagnoses: formData.secondaryDiagnoses ? formData.secondaryDiagnoses.split(',').map(s => s.trim()).filter(Boolean) : undefined,
                diagnosisDate: formData.diagnosisDate || undefined,
                medicalHistory: formData.medicalHistory ? formData.medicalHistory.split(',').map(s => s.trim()).filter(Boolean) : undefined,
                surgicalHistory: formData.surgicalHistory ? formData.surgicalHistory.split(',').map(s => s.trim()).filter(Boolean) : undefined,
                familyHistory: formData.familyHistory ? formData.familyHistory.split(',').map(s => s.trim()).filter(Boolean) : undefined,
                currentMedications: formData.currentMedications.filter(m => m.name.trim()),
                allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()).filter(Boolean) : undefined,
                bloodGroup: formData.bloodGroup || undefined,
                smokingStatus: formData.smokingStatus || undefined,
                alcoholUse: formData.alcoholUse || undefined,
                vitals: {
                    bloodPressureSystolic: formData.bloodPressureSystolic ? Number(formData.bloodPressureSystolic) : undefined,
                    bloodPressureDiastolic: formData.bloodPressureDiastolic ? Number(formData.bloodPressureDiastolic) : undefined,
                    heartRate: formData.heartRate ? Number(formData.heartRate) : undefined,
                    weight: formData.weight ? Number(formData.weight) : undefined,
                    height: formData.height ? Number(formData.height) : undefined,
                    bmi: formData.bmi ? Number(formData.bmi) : undefined,
                },
                labValues: {
                    hba1c: formData.hba1c || undefined,
                    creatinine: formData.creatinine || undefined,
                    alt: formData.alt || undefined,
                    ast: formData.ast || undefined,
                    hemoglobin: formData.hemoglobin || undefined,
                    plateletCount: formData.plateletCount || undefined,
                    wbc: formData.wbc || undefined,
                },
                ecogPerformanceStatus: formData.ecogPerformanceStatus !== '' ? Number(formData.ecogPerformanceStatus) : undefined,
                hasAdequateOrganFunction: formData.hasAdequateOrganFunction !== '' ? formData.hasAdequateOrganFunction === 'true' : undefined,
                isPregnantOrNursing: formData.isPregnantOrNursing !== '' ? formData.isPregnantOrNursing === 'true' : undefined,
                hasInformedConsent: formData.hasInformedConsent !== '' ? formData.hasInformedConsent === 'true' : undefined,
                inclusionNotes: formData.inclusionNotes || undefined,
                exclusionNotes: formData.exclusionNotes || undefined,
                doctorRemarks: formData.doctorRemarks || undefined,
            };

            const res = await fetch('/api/clinical-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (res.ok && data.ok) {
                setResult({ ok: true, message: data.message });
                // Show AI Analysis loading, then fetch trial matches
                setAiAnalyzing(true);
                setAiProgress(0);
                const analysisDuration = 3000 + Math.random() * 5000; // 3-8 seconds
                const startTime = Date.now();
                const progressInterval = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    const pct = Math.min((elapsed / analysisDuration) * 100, 98);
                    setAiProgress(Math.round(pct));
                }, 150);
                await new Promise(resolve => setTimeout(resolve, analysisDuration));
                clearInterval(progressInterval);
                setAiProgress(100);
                await fetchTrialMatches();
                setAiAnalyzing(false);
            } else {
                setResult({ ok: false, message: data.message || 'Failed to submit details.' });
            }
        } catch {
            setResult({ ok: false, message: 'Network error. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    const resetAll = () => {
        setAnonymizedId('');
        setPatientVerified(false);
        setPatientInfo(null);
        setFormData(EMPTY_FORM);
        setCurrentStep(0);
        setResult(null);
        setVerifyError('');
        setMatchedTrials([]);
        setMatchLoading(false);
        setExpandedTrial(null);
        setAiAnalyzing(false);
        setAiProgress(0);
    };

    const fetchTrialMatches = async () => {
        setMatchLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/matching/patient/${encodeURIComponent(anonymizedId)}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.ok) {
                setMatchedTrials(data.data);
            }
        } catch { /* silently fail */ }
        finally { setMatchLoading(false); }
    };

    // ── AI Analysis Loading Steps ───────────────────
    const AI_STEPS = [
        { label: 'Parsing clinical data', threshold: 10 },
        { label: 'Extracting medical history', threshold: 25 },
        { label: 'Analyzing lab values & vitals', threshold: 45 },
        { label: 'Matching against trial criteria', threshold: 65 },
        { label: 'Computing eligibility scores', threshold: 80 },
        { label: 'Generating AI recommendations', threshold: 95 },
    ];

    // ── Field renderer ─────────────────────────────
    function renderInput(label, field, opts = {}) {
        const { type = 'text', placeholder = '', options = null } = opts;
        return (
            <div>
                <label style={labelStyle}>{label}</label>
                {options ? (
                    <select
                        style={focusedInput(field)}
                        value={formData[field]}
                        onChange={e => handleChange(field, e.target.value)}
                        onFocus={() => setFocusedField(field)}
                        onBlur={() => setFocusedField(null)}
                    >
                        <option value="">Select...</option>
                        {options.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                ) : type === 'textarea' ? (
                    <textarea
                        style={{ ...focusedInput(field), minHeight: '80px', resize: 'vertical' }}
                        placeholder={placeholder}
                        value={formData[field]}
                        onChange={e => handleChange(field, e.target.value)}
                        onFocus={() => setFocusedField(field)}
                        onBlur={() => setFocusedField(null)}
                    />
                ) : (
                    <input
                        type={type}
                        style={focusedInput(field)}
                        placeholder={placeholder}
                        value={formData[field]}
                        onChange={e => handleChange(field, e.target.value)}
                        onFocus={() => setFocusedField(field)}
                        onBlur={() => setFocusedField(null)}
                    />
                )}
            </div>
        );
    }

    // ── Steps ──────────────────────────────────────
    const STEPS = [
        { label: 'Demographics', icon: HiOutlineUserCircle },
        { label: 'Medical History', icon: HiOutlineClipboardDocumentList },
        { label: 'Vitals & Lab', icon: HiOutlineHeart },
        { label: 'Eligibility', icon: HiOutlineShieldCheck },
        { label: 'Review', icon: HiOutlineDocumentText },
    ];

    function renderStep0() {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {renderInput('Age', 'age', { type: 'number', placeholder: 'e.g. 45' })}
                {renderInput('Gender', 'gender', {
                    options: [
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' },
                        { value: 'Other', label: 'Other' },
                    ],
                })}
                {renderInput('Blood Group', 'bloodGroup', {
                    options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(v => ({ value: v, label: v })),
                })}
                {renderInput('Smoking Status', 'smokingStatus', {
                    options: [
                        { value: 'Never', label: 'Never' },
                        { value: 'Former', label: 'Former' },
                        { value: 'Current', label: 'Current' },
                    ],
                })}
                {renderInput('Alcohol Use', 'alcoholUse', {
                    options: [
                        { value: 'None', label: 'None' },
                        { value: 'Occasional', label: 'Occasional' },
                        { value: 'Moderate', label: 'Moderate' },
                        { value: 'Heavy', label: 'Heavy' },
                    ],
                })}
            </div>
        );
    }

    function renderStep1() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {renderInput('Primary Diagnosis', 'primaryDiagnosis', { placeholder: 'e.g. Type 2 Diabetes Mellitus' })}
                    {renderInput('Diagnosis Date', 'diagnosisDate', { type: 'date' })}
                </div>
                {renderInput('Secondary Diagnoses', 'secondaryDiagnoses', { placeholder: 'Comma-separated: Hypertension, Obesity' })}
                {/* Medical History — multi-select dropdown with tags */}
                <div>
                    <label style={labelStyle}>Medical History</label>
                    <div style={{ position: 'relative' }}>
                        {/* Selected tags */}
                        <div style={{
                            display: 'flex', flexWrap: 'wrap', gap: '6px',
                            padding: '8px 12px', minHeight: '42px',
                            background: colors.surface, border: `1.5px solid ${colors.border}`,
                            borderRadius: radius?.md || '10px',
                            cursor: 'text', alignItems: 'center',
                        }}
                            onClick={() => {
                                const el = document.getElementById('mh-custom-input');
                                if (el) el.focus();
                            }}
                        >
                            {formData.medicalHistory
                                .split(',')
                                .map(s => s.trim())
                                .filter(Boolean)
                                .map((item) => (
                                    <span key={item} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                        background: colors.accentGlow, color: colors.accent,
                                        padding: '3px 10px', borderRadius: '999px',
                                        fontSize: '12px', fontWeight: 600, fontFamily: fonts.body,
                                        border: `1px solid ${colors.accent}30`,
                                    }}>
                                        {item}
                                        <span
                                            style={{ cursor: 'pointer', fontWeight: 700, fontSize: '14px', lineHeight: 1, marginLeft: '2px' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const updated = formData.medicalHistory
                                                    .split(',')
                                                    .map(s => s.trim())
                                                    .filter(s => s && s !== item)
                                                    .join(', ');
                                                handleChange('medicalHistory', updated);
                                            }}
                                        >×</span>
                                    </span>
                                ))}
                            <input
                                id="mh-custom-input"
                                type="text"
                                placeholder={formData.medicalHistory ? 'Add more...' : 'Type or select conditions...'}
                                style={{
                                    border: 'none', outline: 'none', background: 'transparent',
                                    color: colors.textPrimary, fontFamily: fonts.body, fontSize: '13px',
                                    flex: 1, minWidth: '120px', padding: '2px 0',
                                }}
                                onFocus={() => setFocusedField('medicalHistory')}
                                onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ',') {
                                        e.preventDefault();
                                        const val = e.target.value.trim().replace(/,$/g, '');
                                        if (val) {
                                            const existing = formData.medicalHistory
                                                .split(',')
                                                .map(s => s.trim())
                                                .filter(Boolean);
                                            if (!existing.some(s => s.toLowerCase() === val.toLowerCase())) {
                                                handleChange('medicalHistory', [...existing, val].join(', '));
                                            }
                                            e.target.value = '';
                                        }
                                    }
                                }}
                            />
                        </div>

                        {/* Dropdown */}
                        {focusedField === 'medicalHistory' && (
                            <div style={{
                                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                                marginTop: '4px', maxHeight: '200px', overflowY: 'auto',
                                background: colors.surface, border: `1.5px solid ${colors.accent}40`,
                                borderRadius: radius?.md || '10px', boxShadow: colors.shadow,
                            }}>
                                {MEDICAL_HISTORY_OPTIONS
                                    .filter(opt => {
                                        const existing = formData.medicalHistory.split(',').map(s => s.trim().toLowerCase());
                                        return !existing.includes(opt.toLowerCase());
                                    })
                                    .filter(opt => {
                                        const input = document.getElementById('mh-custom-input');
                                        const query = (input?.value || '').toLowerCase();
                                        return !query || opt.toLowerCase().includes(query);
                                    })
                                    .map(opt => (
                                        <div
                                            key={opt}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                const existing = formData.medicalHistory
                                                    .split(',')
                                                    .map(s => s.trim())
                                                    .filter(Boolean);
                                                if (!existing.some(s => s.toLowerCase() === opt.toLowerCase())) {
                                                    handleChange('medicalHistory', [...existing, opt].join(', '));
                                                }
                                                const input = document.getElementById('mh-custom-input');
                                                if (input) input.value = '';
                                            }}
                                            style={{
                                                padding: '8px 14px', cursor: 'pointer',
                                                fontSize: '13px', color: colors.textPrimary,
                                                fontFamily: fonts.body,
                                                borderBottom: `1px solid ${colors.border}`,
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = colors.accentGlow}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
                {renderInput('Surgical History', 'surgicalHistory', { placeholder: 'Comma-separated: Appendectomy 2015, Knee Arthroscopy 2020' })}
                {renderInput('Family History', 'familyHistory', { placeholder: 'Comma-separated: Father — Heart Disease, Mother — Diabetes' })}
                {renderInput('Allergies', 'allergies', { placeholder: 'Comma-separated: Penicillin, Latex' })}

                {/* Medications */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>Current Medications</label>
                        <button onClick={addMedication}
                            style={{
                                background: colors.accentGlow, color: colors.accent, border: 'none',
                                borderRadius: '8px', padding: '4px 12px', fontSize: '12px', fontWeight: 600,
                                cursor: 'pointer', fontFamily: fonts.body,
                            }}>
                            + Add
                        </button>
                    </div>
                    {formData.currentMedications.map((med, i) => (
                        <div key={i} style={{
                            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '8px',
                            marginBottom: '8px', alignItems: 'center',
                        }}>
                            <input style={inputBase} placeholder="Medication name"
                                value={med.name} onChange={e => handleMedChange(i, 'name', e.target.value)} />
                            <input style={inputBase} placeholder="Dosage"
                                value={med.dosage} onChange={e => handleMedChange(i, 'dosage', e.target.value)} />
                            <input style={inputBase} placeholder="Frequency"
                                value={med.frequency} onChange={e => handleMedChange(i, 'frequency', e.target.value)} />
                            {formData.currentMedications.length > 1 && (
                                <button onClick={() => removeMedication(i)}
                                    style={{
                                        background: `${colors.red || '#EF4444'}12`, color: colors.red || '#EF4444',
                                        border: 'none', borderRadius: '8px', width: 32, height: 32,
                                        cursor: 'pointer', fontSize: '14px', fontWeight: 700,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    function renderStep2() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>Vitals</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    {renderInput('Systolic BP (mmHg)', 'bloodPressureSystolic', { type: 'number', placeholder: '120' })}
                    {renderInput('Diastolic BP (mmHg)', 'bloodPressureDiastolic', { type: 'number', placeholder: '80' })}
                    {renderInput('Heart Rate (bpm)', 'heartRate', { type: 'number', placeholder: '72' })}
                    {renderInput('Weight (kg)', 'weight', { type: 'number', placeholder: '75' })}
                    {renderInput('Height (cm)', 'height', { type: 'number', placeholder: '170' })}
                    {renderInput('BMI', 'bmi', { type: 'number', placeholder: '25.9' })}
                </div>

                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>Lab Values</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    {renderInput('HbA1c (%)', 'hba1c', { placeholder: '6.5' })}
                    {renderInput('Creatinine (mg/dL)', 'creatinine', { placeholder: '1.0' })}
                    {renderInput('ALT (U/L)', 'alt', { placeholder: '25' })}
                    {renderInput('AST (U/L)', 'ast', { placeholder: '22' })}
                    {renderInput('Hemoglobin (g/dL)', 'hemoglobin', { placeholder: '14.0' })}
                    {renderInput('Platelet Count', 'plateletCount', { placeholder: '250000' })}
                    {renderInput('WBC', 'wbc', { placeholder: '7500' })}
                </div>
            </div>
        );
    }

    function renderStep3() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {renderInput('ECOG Performance Status (0-5)', 'ecogPerformanceStatus', {
                        options: [0, 1, 2, 3, 4, 5].map(v => ({ value: String(v), label: `${v} — ${['Fully active', 'Restricted', 'Ambulatory >50%', 'Ambulatory ≤50%', 'Bedridden', 'Dead'][v]}` })),
                    })}
                    {renderInput('Adequate Organ Function?', 'hasAdequateOrganFunction', {
                        options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }],
                    })}
                    {renderInput('Pregnant or Nursing?', 'isPregnantOrNursing', {
                        options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }],
                    })}
                    {renderInput('Informed Consent Given?', 'hasInformedConsent', {
                        options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }],
                    })}
                </div>
                {renderInput('Inclusion Notes', 'inclusionNotes', { type: 'textarea', placeholder: 'Notes on why this patient meets inclusion criteria...' })}
                {renderInput('Exclusion Notes', 'exclusionNotes', { type: 'textarea', placeholder: 'Any exclusion criteria concerns...' })}
                {renderInput('Doctor Remarks', 'doctorRemarks', { type: 'textarea', placeholder: 'Additional clinical observations...' })}
            </div>
        );
    }

    function renderReview() {
        const Section = ({ title, children }) => (
            <div style={{ marginBottom: 16 }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 700, color: colors.accent, fontFamily: fonts.heading, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {title}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
                    {children}
                </div>
            </div>
        );

        const Item = ({ label, value }) => value ? (
            <div>
                <span style={{ fontSize: '11px', color: colors.textSecondary, fontFamily: fonts.body }}>{label}</span>
                <p style={{ margin: '2px 0 0', fontSize: '14px', color: colors.textPrimary, fontWeight: 500, fontFamily: fonts.body }}>{value}</p>
            </div>
        ) : null;

        return (
            <div>
                <Section title="Patient">
                    <Item label="Anonymized ID" value={anonymizedId} />
                </Section>
                <Section title="Demographics">
                    <Item label="Age" value={formData.age} />
                    <Item label="Gender" value={formData.gender} />
                    <Item label="Blood Group" value={formData.bloodGroup} />
                    <Item label="Smoking" value={formData.smokingStatus} />
                    <Item label="Alcohol" value={formData.alcoholUse} />
                </Section>
                <Section title="Medical History">
                    <Item label="Primary Diagnosis" value={formData.primaryDiagnosis} />
                    <Item label="Diagnosis Date" value={formData.diagnosisDate} />
                    <Item label="Secondary" value={formData.secondaryDiagnoses} />
                    <Item label="Medical History" value={formData.medicalHistory} />
                    <Item label="Allergies" value={formData.allergies} />
                </Section>
                {formData.currentMedications.some(m => m.name) && (
                    <Section title="Medications">
                        {formData.currentMedications.filter(m => m.name).map((m, i) => (
                            <Item key={i} label={m.name} value={`${m.dosage} — ${m.frequency}`} />
                        ))}
                    </Section>
                )}
                <Section title="Vitals">
                    <Item label="Blood Pressure" value={formData.bloodPressureSystolic ? `${formData.bloodPressureSystolic}/${formData.bloodPressureDiastolic} mmHg` : ''} />
                    <Item label="Heart Rate" value={formData.heartRate ? `${formData.heartRate} bpm` : ''} />
                    <Item label="Weight" value={formData.weight ? `${formData.weight} kg` : ''} />
                    <Item label="Height" value={formData.height ? `${formData.height} cm` : ''} />
                    <Item label="BMI" value={formData.bmi} />
                </Section>
                <Section title="Lab Values">
                    <Item label="HbA1c" value={formData.hba1c} />
                    <Item label="Creatinine" value={formData.creatinine} />
                    <Item label="ALT" value={formData.alt} />
                    <Item label="AST" value={formData.ast} />
                    <Item label="Hemoglobin" value={formData.hemoglobin} />
                    <Item label="Platelets" value={formData.plateletCount} />
                    <Item label="WBC" value={formData.wbc} />
                </Section>
                <Section title="Eligibility">
                    <Item label="ECOG Status" value={formData.ecogPerformanceStatus} />
                    <Item label="Organ Function" value={formData.hasAdequateOrganFunction === 'true' ? 'Yes' : formData.hasAdequateOrganFunction === 'false' ? 'No' : ''} />
                    <Item label="Pregnant/Nursing" value={formData.isPregnantOrNursing === 'true' ? 'Yes' : formData.isPregnantOrNursing === 'false' ? 'No' : ''} />
                    <Item label="Informed Consent" value={formData.hasInformedConsent === 'true' ? 'Yes' : formData.hasInformedConsent === 'false' ? 'No' : ''} />
                </Section>
                {(formData.inclusionNotes || formData.exclusionNotes || formData.doctorRemarks) && (
                    <Section title="Notes">
                        <Item label="Inclusion" value={formData.inclusionNotes} />
                        <Item label="Exclusion" value={formData.exclusionNotes} />
                        <Item label="Doctor Remarks" value={formData.doctorRemarks} />
                    </Section>
                )}
            </div>
        );
    }

    const stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3, renderReview];

    // ── Success view with trial matches ─────────────────
    // ── AI Analyzing interstitial screen ─────────
    if (aiAnalyzing) {
        const currentStepIdx = AI_STEPS.findIndex(s => aiProgress < s.threshold);
        const activeStep = currentStepIdx === -1 ? AI_STEPS.length - 1 : currentStepIdx;

        return (
            <DoctorLayout>
                <div style={{ maxWidth: 600, margin: '80px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
                    {/* Pulsing brain icon */}
                    <motion.div
                        animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            width: 80, height: 80, borderRadius: '50%',
                            background: `linear-gradient(135deg, ${colors.accent}25, ${colors.green || colors.accent}25)`,
                            border: `2px solid ${colors.accent}40`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <HiOutlineSparkles style={{ width: 36, height: 36, color: colors.accent }} />
                    </motion.div>

                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ margin: 0, fontSize: '22px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                            AI Analysis in Progress
                        </h2>
                        <p style={{ margin: '8px 0 0', fontSize: '14px', color: colors.textSecondary, fontFamily: fonts.body, lineHeight: 1.5 }}>
                            Analyzing clinical data for patient <strong style={{ color: colors.accent }}>{anonymizedId}</strong>
                        </p>
                    </div>

                    {/* Progress bar */}
                    <div style={{ width: '100%', maxWidth: 440 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: colors.textSecondary, fontFamily: fonts.body }}>
                                {AI_STEPS[activeStep]?.label || 'Finalizing...'}
                            </span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: colors.accent, fontFamily: fonts.body }}>
                                {aiProgress}%
                            </span>
                        </div>
                        <div style={{
                            width: '100%', height: 8, borderRadius: 4,
                            background: colors.border, overflow: 'hidden',
                        }}>
                            <motion.div
                                animate={{ width: `${aiProgress}%` }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                style={{
                                    height: '100%', borderRadius: 4,
                                    background: `linear-gradient(90deg, ${colors.accent}, ${colors.green || colors.accent})`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Step checklist */}
                    <div style={{
                        ...card, padding: '20px 24px', width: '100%', maxWidth: 440,
                        display: 'flex', flexDirection: 'column', gap: '12px',
                    }}>
                        {AI_STEPS.map((step, i) => {
                            const done = aiProgress >= step.threshold;
                            const active = i === activeStep;
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {done ? (
                                        <HiOutlineCheckCircle style={{ width: 18, height: 18, color: colors.green, flexShrink: 0 }} />
                                    ) : active ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            style={{
                                                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                                                border: `2px solid ${colors.border}`, borderTopColor: colors.accent,
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                                            border: `2px solid ${colors.border}`,
                                        }} />
                                    )}
                                    <span style={{
                                        fontSize: '13px', fontFamily: fonts.body, fontWeight: active ? 600 : 400,
                                        color: done ? colors.green : active ? colors.textPrimary : colors.textSecondary,
                                        transition: 'color 0.3s',
                                    }}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DoctorLayout>
        );
    }

    if (result?.ok) {
        const scoreColor = (s) => s >= 60 ? (colors.green) : s >= 40 ? (colors.yellow || '#F59E0B') : (colors.red || '#EF4444');
        const eligBadge = (eligible) => {
            const cfg = {
                Eligible: { bg: colors.greenGlow || `${colors.green}15`, color: colors.green, label: 'Eligible' },
                'Partially Eligible': { bg: `${colors.yellow || '#F59E0B'}20`, color: colors.yellow || '#F59E0B', label: 'Partial Match' },
                'Not Eligible': { bg: `${colors.red || '#EF4444'}20`, color: colors.red || '#EF4444', label: 'Not Eligible' },
            };
            const c = cfg[eligible] || cfg['Not Eligible'];
            return (
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: c.bg, color: c.color, fontFamily: fonts.body }}>
                    {c.label}
                </span>
            );
        };

        return (
            <DoctorLayout>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Success banner */}
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        style={{
                            ...card, padding: '24px 28px',
                            display: 'flex', alignItems: 'center', gap: '16px',
                            borderLeft: `4px solid ${colors.green}`,
                        }}>
                        <div style={{
                            width: 52, height: 52, borderRadius: '50%',
                            background: colors.greenGlow || `${colors.green}15`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <HiOutlineCheckCircle style={{ width: 28, height: 28, color: colors.green }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ margin: 0, fontFamily: fonts.heading, fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>
                                Clinical Details Submitted Successfully
                            </h2>
                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: colors.textSecondary, fontFamily: fonts.body }}>
                                Patient <strong style={{ color: colors.accent }}>{anonymizedId}</strong> — details recorded and AI matching initiated.
                            </p>
                        </div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={resetAll}
                            style={{
                                padding: '8px 20px', borderRadius: radius?.md || '10px',
                                background: 'transparent', color: colors.textSecondary,
                                border: `1px solid ${colors.border}`,
                                fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: fonts.body,
                            }}>
                            + New Patient
                        </motion.button>
                    </motion.div>

                    {/* Trial Matches Section */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                        style={{ ...card, padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3 style={{
                                margin: 0, fontSize: '16px', fontFamily: fonts.heading, fontWeight: 700,
                                color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: '8px',
                            }}>
                                <HiOutlineSparkles style={{ width: 20, height: 20, color: colors.accent }} />
                                AI Trial Match Results
                            </h3>
                            <button onClick={fetchTrialMatches} disabled={matchLoading}
                                style={{
                                    padding: '6px 14px', borderRadius: '8px',
                                    background: colors.card || colors.surface, color: colors.textSecondary,
                                    border: `1px solid ${colors.border}`, fontSize: '12px', fontWeight: 600,
                                    cursor: matchLoading ? 'default' : 'pointer', fontFamily: fonts.body,
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                }}>
                                <HiOutlineArrowPath style={{ width: 14, height: 14, animation: matchLoading ? 'spin 1s linear infinite' : 'none' }} />
                                Refresh
                            </button>
                        </div>

                        {/* Loading */}
                        {matchLoading && (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.textSecondary, fontFamily: fonts.body }}>
                                <HiOutlineArrowPath style={{ width: 28, height: 28, animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
                                <div style={{ fontSize: '14px' }}>Analyzing patient profile against available trials...</div>
                            </div>
                        )}

                        {/* Empty */}
                        {!matchLoading && matchedTrials.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.textSecondary, fontFamily: fonts.body }}>
                                <div style={{ fontSize: '14px', marginBottom: '4px' }}>No matching trials found for this patient.</div>
                                <div style={{ fontSize: '12px' }}>Matches may appear as new trials are added.</div>
                            </div>
                        )}

                        {/* Match list */}
                        {!matchLoading && matchedTrials.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {matchedTrials.map((trial, i) => {
                                    const isExpanded = expandedTrial === trial.trialId;
                                    const sColor = scoreColor(trial.score);
                                    const r = (20 - 2) / 2;
                                    const circ = 2 * Math.PI * r;
                                    const offset = circ - (trial.score / 100) * circ;
                                    return (
                                        <motion.div key={trial.trialId}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05, duration: 0.3 }}>
                                            {/* Card Row */}
                                            <div
                                                onClick={() => setExpandedTrial(isExpanded ? null : trial.trialId)}
                                                style={{
                                                    background: colors.card || colors.surface,
                                                    border: `1px solid ${isExpanded ? colors.accent : colors.border}`,
                                                    borderRadius: isExpanded ? '12px 12px 0 0' : '12px',
                                                    padding: '14px 16px',
                                                    display: 'flex', alignItems: 'center', gap: '14px',
                                                    cursor: 'pointer', transition: 'all 0.2s',
                                                }}
                                            >
                                                {/* Score mini ring */}
                                                <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
                                                    <svg width={40} height={40} style={{ transform: 'rotate(-90deg)' }}>
                                                        <circle cx={20} cy={20} r={r} fill="none" stroke={colors.border} strokeWidth={2} />
                                                        <circle cx={20} cy={20} r={r} fill="none" stroke={sColor} strokeWidth={2}
                                                            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                                                            style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
                                                    </svg>
                                                    <span style={{
                                                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '11px', fontWeight: 700, color: sColor,
                                                    }}>{trial.score}%</span>
                                                </div>

                                                {/* Info */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                        <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: fonts.heading, color: colors.textPrimary }}>
                                                            {trial.trialName}
                                                        </span>
                                                        {trial.phase && (
                                                            <span style={{
                                                                fontSize: '10px', fontWeight: 600, padding: '1px 7px', borderRadius: '999px',
                                                                background: colors.greenGlow || `${colors.green}15`, color: colors.green, fontFamily: fonts.body,
                                                            }}>{trial.phase}</span>
                                                        )}
                                                        {eligBadge(trial.eligible)}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '3px', fontFamily: fonts.body, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <HiOutlineMapPin style={{ width: 12, height: 12 }} />
                                                        {trial.hospital || trial.location || 'TBD'}
                                                        {trial.location && trial.hospital ? ` • ${trial.location}` : ''}
                                                        {trial.drug ? ` • ${trial.drug}` : ''}
                                                    </div>
                                                    {/* Quick reason chips */}
                                                    <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                        {trial.reasons.filter(r => r.passed).slice(0, 2).map((r, idx) => (
                                                            <span key={idx} style={{ fontSize: '10px', color: colors.green, fontWeight: 500, background: colors.greenGlow || `${colors.green}10`, padding: '1px 7px', borderRadius: '6px', fontFamily: fonts.body }}>
                                                                ✓ {r.text}
                                                            </span>
                                                        ))}
                                                        {trial.reasons.filter(r => !r.passed).length > 0 && (
                                                            <span style={{ fontSize: '10px', color: colors.red || '#EF4444', fontWeight: 500, background: `${colors.red || '#EF4444'}12`, padding: '1px 7px', borderRadius: '6px', fontFamily: fonts.body }}>
                                                                ✗ {trial.reasons.filter(r => !r.passed).length} not met
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Expand toggle */}
                                                <button onClick={(e) => { e.stopPropagation(); setExpandedTrial(isExpanded ? null : trial.trialId); }}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '4px',
                                                        padding: '5px 12px', borderRadius: '8px',
                                                        background: isExpanded ? colors.accent : (colors.accentGlow || `${colors.accent}10`),
                                                        color: isExpanded ? '#fff' : colors.accent,
                                                        border: `1px solid ${colors.accent}40`, fontSize: '11px', fontWeight: 600,
                                                        fontFamily: fonts.body, cursor: 'pointer', flexShrink: 0,
                                                    }}>
                                                    <HiOutlineEye style={{ width: 13, height: 13 }} />
                                                    {isExpanded ? 'Hide' : 'Details'}
                                                </button>
                                            </div>

                                            {/* Expanded detail panel */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        style={{
                                                            background: colors.card || colors.surface,
                                                            border: `1px solid ${colors.accent}40`,
                                                            borderTop: 'none', borderRadius: '0 0 12px 12px',
                                                            padding: '20px', overflow: 'hidden',
                                                        }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                                                            <h4 style={{ margin: 0, fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                                                                {trial.trialName} — Full Details
                                                            </h4>
                                                            <button onClick={() => setExpandedTrial(null)}
                                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textSecondary }}>
                                                                <HiOutlineXMark style={{ width: 18, height: 18 }} />
                                                            </button>
                                                        </div>

                                                        {/* Info grid */}
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                                            {[
                                                                ['Trial Code', trial.trialCode],
                                                                ['Phase', trial.phase],
                                                                ['Category', trial.category],
                                                                ['Location', trial.location],
                                                                ['Hospital', trial.hospital],
                                                                ['Drug', trial.drug],
                                                                ['Slots', trial.slots != null ? `${trial.slots - (trial.enrolled || 0)} remaining` : 'N/A'],
                                                                ['Match Score', `${trial.score}%`],
                                                                ['Eligibility', trial.eligible],
                                                            ].map(([l, v]) => (
                                                                <div key={l}>
                                                                    <div style={{ fontSize: '10px', color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: fonts.body }}>{l}</div>
                                                                    <div style={{ fontSize: '13px', color: colors.textPrimary, fontWeight: 500, marginTop: '2px', fontFamily: fonts.body }}>{v || '—'}</div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {trial.description && (
                                                            <div style={{ marginBottom: '16px' }}>
                                                                <div style={{ fontSize: '10px', color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px', fontFamily: fonts.body }}>Description</div>
                                                                <div style={{ fontSize: '13px', color: colors.textPrimary, lineHeight: 1.6, fontFamily: fonts.body }}>{trial.description}</div>
                                                            </div>
                                                        )}

                                                        {/* Symptoms & Required Conditions */}
                                                        {(trial.symptoms?.length > 0 || trial.requiredConditions?.length > 0) && (
                                                            <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                                                {trial.symptoms?.length > 0 && (
                                                                    <div style={{ flex: 1, minWidth: 180 }}>
                                                                        <div style={{ fontSize: '10px', color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px', fontFamily: fonts.body }}>Symptoms</div>
                                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                                            {trial.symptoms.map((s, idx) => (
                                                                                <span key={idx} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: `${colors.yellow || '#F59E0B'}15`, color: colors.yellow || '#F59E0B', fontWeight: 500, fontFamily: fonts.body }}>{s}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {trial.requiredConditions?.length > 0 && (
                                                                    <div style={{ flex: 1, minWidth: 180 }}>
                                                                        <div style={{ fontSize: '10px', color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px', fontFamily: fonts.body }}>Required Conditions</div>
                                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                                            {trial.requiredConditions.map((c, idx) => (
                                                                                <span key={idx} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: colors.accentGlow || `${colors.accent}10`, color: colors.accent, fontWeight: 500, fontFamily: fonts.body }}>{c}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* AI Explanation */}
                                                        <div style={{
                                                            marginBottom: '18px', padding: '14px 16px',
                                                            background: `linear-gradient(135deg, ${colors.accent}08, ${colors.accent}04)`,
                                                            border: `1px solid ${colors.accent}20`,
                                                            borderRadius: '10px',
                                                        }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                                <HiOutlineSparkles style={{ width: 15, height: 15, color: colors.accent }} />
                                                                <span style={{ fontSize: '11px', fontWeight: 700, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: fonts.body }}>AI Match Explanation</span>
                                                            </div>
                                                            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.7, color: colors.textPrimary, fontFamily: fonts.body }}>
                                                                {(() => {
                                                                    const passed = trial.reasons.filter(r => r.passed);
                                                                    const failed = trial.reasons.filter(r => !r.passed);
                                                                    const parts = [];

                                                                    if (trial.score >= 60) {
                                                                        parts.push(`This patient is a **strong match** for **${trial.trialName}** with a **${trial.score}% compatibility score**.`);
                                                                    } else if (trial.score >= 40) {
                                                                        parts.push(`This patient is a **partial match** for **${trial.trialName}** with a **${trial.score}% compatibility score**.`);
                                                                    } else {
                                                                        parts.push(`This patient has a **low match** for **${trial.trialName}** with only a **${trial.score}% compatibility score**.`);
                                                                    }

                                                                    if (passed.length > 0) {
                                                                        const passedTypes = [...new Set(passed.map(r => r.type))];
                                                                        parts.push(`The patient meets the **${passedTypes.join(', ')}** criteria${passed.length > 1 ? '' : ''}.`);
                                                                        passed.forEach(r => {
                                                                            if (r.type === 'condition' && r.text.includes('Diagnosis confirmed')) parts.push('The primary diagnosis aligns with the trial requirements.');
                                                                            if (r.type === 'condition' && r.text.includes('symptoms match')) parts.push(`${r.text}.`);
                                                                            if (r.type === 'age' && r.text.includes('within range')) parts.push(`${r.text}.`);
                                                                            if (r.type === 'location' && r.text.includes('Location match')) parts.push(`The trial is conveniently located near the patient.`);
                                                                        });
                                                                    }

                                                                    if (failed.length > 0) {
                                                                        const failedSummaries = failed.map(r => {
                                                                            if (r.type === 'condition') return 'the primary diagnosis does not align with the trial conditions';
                                                                            if (r.type === 'age') return 'the patient\'s age falls outside the required range';
                                                                            if (r.type === 'biomarker') return `biomarker criteria not met (${r.text})`;
                                                                            if (r.type === 'location') return 'the trial location does not match the patient\'s location';
                                                                            if (r.type === 'exclusion') return r.text;
                                                                            return r.text;
                                                                        });
                                                                        parts.push(`However, ${failedSummaries.join('; ')}.`);
                                                                    }

                                                                    if (trial.eligible === 'Eligible') {
                                                                        parts.push('**Recommendation: This patient is eligible and can proceed with enrollment.**');
                                                                    } else if (trial.eligible === 'Partially Eligible') {
                                                                        parts.push('**Recommendation: Review unmet criteria with the patient before proceeding.**');
                                                                    } else {
                                                                        parts.push('**Recommendation: This trial is not a suitable match for the patient.**');
                                                                    }

                                                                    return parts.join(' ').split('**').map((part, i) =>
                                                                        i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
                                                                    );
                                                                })()}
                                                            </p>
                                                        </div>

                                                        {/* Matching Breakdown */}
                                                        <div>
                                                            <div style={{ fontSize: '10px', color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', fontFamily: fonts.body }}>Matching Breakdown</div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                                {trial.reasons.map((reason, idx) => (
                                                                    <div key={idx} style={{
                                                                        display: 'flex', alignItems: 'center', gap: '8px',
                                                                        padding: '6px 10px',
                                                                        background: reason.passed ? (colors.greenGlow || `${colors.green}10`) : `${colors.red || '#EF4444'}08`,
                                                                        borderRadius: '8px',
                                                                        border: `1px solid ${reason.passed ? `${colors.green}25` : `${colors.red || '#EF4444'}18`}`,
                                                                    }}>
                                                                        <span style={{ fontSize: '13px', flexShrink: 0, width: 16, textAlign: 'center' }}>
                                                                            {reason.passed ? '✓' : '✗'}
                                                                        </span>
                                                                        <span style={{
                                                                            fontSize: '10px', fontWeight: 600,
                                                                            color: reason.passed ? colors.green : (colors.red || '#EF4444'),
                                                                            textTransform: 'uppercase', letterSpacing: '0.4px',
                                                                            minWidth: 60, fontFamily: fonts.body,
                                                                        }}>{reason.type}</span>
                                                                        <span style={{ fontSize: '12px', color: colors.textPrimary, fontFamily: fonts.body }}>
                                                                            {reason.text}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                </div>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </DoctorLayout>
        );
    }

    // ── Verify patient view ────────────────────────
    if (!patientVerified) {
        return (
            <DoctorLayout>
                <div style={{ maxWidth: 560, margin: '20px auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Header */}
                    <motion.div {...fadeUp} transition={{ duration: 0.4 }}
                        style={{ ...card, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: '12px',
                            background: colors.accentGlow,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <HiOutlineDocumentText style={{ width: 22, height: 22, color: colors.accent }} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '18px', fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                                Add Patient Clinical Trial Details
                            </h2>
                            <span style={{ fontSize: '13px', color: colors.textSecondary, fontFamily: fonts.body }}>
                                Enter the patient's anonymized ID to begin
                            </span>
                        </div>
                    </motion.div>

                    {/* ID Input */}
                    <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}
                        style={{ ...card, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        <div style={{
                            padding: '14px 16px', borderRadius: '10px',
                            background: colors.accentGlow || `${colors.accent}06`,
                            border: `1px solid ${colors.accent}20`,
                            fontSize: '13px', color: colors.textSecondary, fontFamily: fonts.body,
                            lineHeight: 1.5,
                        }}>
                            <strong style={{ color: colors.textPrimary }}>Privacy Notice:</strong> You will only interact with the patient's anonymized ID.
                            Personal information such as name, email, or phone is never shared.
                        </div>

                        <div>
                            <label style={labelStyle}>
                                <HiOutlineMagnifyingGlass style={{ width: 12, height: 12, marginRight: 4, verticalAlign: 'middle' }} />
                                Patient Anonymized ID
                            </label>
                            <input
                                style={{
                                    ...inputBase,
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    fontFamily: fonts.heading,
                                    letterSpacing: '1px',
                                    textAlign: 'center',
                                    padding: '14px',
                                    borderColor: focusedField === 'anonId' ? colors.accent : colors.border,
                                    boxShadow: focusedField === 'anonId' ? `0 0 0 3px ${colors.accent}15` : 'none',
                                }}
                                placeholder="ANON-XXXXXXXX"
                                value={anonymizedId}
                                onChange={e => setAnonymizedId(e.target.value.toUpperCase())}
                                onFocus={() => setFocusedField('anonId')}
                                onBlur={() => setFocusedField(null)}
                                onKeyDown={e => e.key === 'Enter' && handleVerify()}
                                maxLength={13}
                            />
                        </div>

                        {verifyError && (
                            <div style={{
                                padding: '10px 14px', borderRadius: '10px',
                                background: `${colors.red || '#EF4444'}10`, border: `1px solid ${colors.red || '#EF4444'}30`,
                                display: 'flex', alignItems: 'center', gap: '8px',
                                fontSize: '13px', color: colors.red || '#EF4444', fontFamily: fonts.body,
                            }}>
                                <HiOutlineExclamationTriangle style={{ width: 16, height: 16, flexShrink: 0 }} />
                                {verifyError}
                            </div>
                        )}

                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={handleVerify}
                            disabled={verifying || !anonymizedId.trim()}
                            style={{
                                padding: '12px 24px', borderRadius: radius?.md || '10px',
                                background: (!anonymizedId.trim() || verifying) ? `${colors.border}60` : colors.accent,
                                color: (!anonymizedId.trim() || verifying) ? colors.textSecondary : '#fff',
                                border: 'none', fontSize: '15px', fontWeight: 700,
                                cursor: (!anonymizedId.trim() || verifying) ? 'not-allowed' : 'pointer',
                                fontFamily: fonts.body,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            }}>
                            {verifying ? (
                                <>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                        style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <HiOutlineArrowRight style={{ width: 16, height: 16 }} />
                                    Verify & Continue
                                </>
                            )}
                        </motion.button>
                    </motion.div>
                </div>
            </DoctorLayout>
        );
    }

    // ── Main form view ─────────────────────────────
    return (
        <DoctorLayout>
            <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Patient badge */}
                <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
                    <div style={{
                        ...card, padding: '14px 20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                width: 38, height: 38, borderRadius: '10px',
                                background: `linear-gradient(135deg, ${colors.accent}, ${colors.green || colors.accent})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: '12px', fontWeight: 700, fontFamily: fonts.heading,
                            }}>
                                {anonymizedId.slice(5, 7)}
                            </div>
                            <div>
                                <span style={{ fontSize: '15px', fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>
                                    {anonymizedId}
                                </span>
                                <div style={{ fontSize: '12px', color: colors.textSecondary, fontFamily: fonts.body }}>
                                    {patientInfo?.gender && `${patientInfo.gender}`}
                                    {patientInfo?.age && ` · ${patientInfo.age}y`}
                                    {patientInfo?.bloodGroup && ` · ${patientInfo.bloodGroup}`}
                                </div>
                            </div>
                        </div>
                        <span style={{
                            fontSize: '10px', fontWeight: 600, padding: '3px 10px', borderRadius: '8px',
                            background: `${colors.green}15`, color: colors.green, fontFamily: fonts.body,
                        }}>
                            Verified
                        </span>
                    </div>
                </motion.div>

                {/* Step indicator */}
                <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }}>
                    <div style={{
                        ...card, padding: '16px 20px',
                        display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center',
                    }}>
                        {STEPS.map((step, i) => {
                            const Icon = step.icon;
                            const isActive = i === currentStep;
                            const isDone = i < currentStep;
                            return (
                                <React.Fragment key={i}>
                                    <div
                                        onClick={() => i <= currentStep && setCurrentStep(i)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            padding: '6px 12px', borderRadius: '8px',
                                            background: isActive ? colors.accentGlow : isDone ? `${colors.green}10` : 'transparent',
                                            cursor: i <= currentStep ? 'pointer' : 'default',
                                            transition: 'all 0.2s',
                                        }}>
                                        {isDone ? (
                                            <HiOutlineCheckCircle style={{ width: 16, height: 16, color: colors.green }} />
                                        ) : (
                                            <Icon style={{ width: 16, height: 16, color: isActive ? colors.accent : colors.textSecondary }} />
                                        )}
                                        <span style={{
                                            fontSize: '12px', fontWeight: isActive ? 700 : 500, fontFamily: fonts.body,
                                            color: isActive ? colors.accent : isDone ? colors.green : colors.textSecondary,
                                        }}>
                                            {step.label}
                                        </span>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div style={{ width: 20, height: 1, background: colors.border }} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Form content */}
                <motion.div key={currentStep} {...fadeUp} transition={{ duration: 0.3 }}>
                    <div style={{ ...card, padding: '24px' }}>
                        <h3 style={{
                            margin: '0 0 20px', fontSize: '15px', fontWeight: 700, fontFamily: fonts.heading,
                            color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                            {React.createElement(STEPS[currentStep].icon, { style: { width: 18, height: 18, color: colors.accent } })}
                            {STEPS[currentStep].label}
                        </h3>
                        {stepRenderers[currentStep]()}
                    </div>
                </motion.div>

                {/* Error */}
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

                {/* Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => currentStep === 0 ? resetAll() : setCurrentStep(s => s - 1)}
                        style={{
                            padding: '10px 20px', borderRadius: radius?.md || '10px',
                            background: 'transparent', color: colors.textSecondary,
                            border: `1px solid ${colors.border}`,
                            fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: fonts.body,
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                        <HiOutlineArrowLeft style={{ width: 14, height: 14 }} />
                        {currentStep === 0 ? 'Change Patient' : 'Back'}
                    </motion.button>

                    {currentStep < STEPS.length - 1 ? (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => setCurrentStep(s => s + 1)}
                            style={{
                                padding: '10px 24px', borderRadius: radius?.md || '10px',
                                background: colors.accent, color: '#fff', border: 'none',
                                fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: fonts.body,
                                display: 'flex', alignItems: 'center', gap: '6px',
                            }}>
                            Next <HiOutlineArrowRight style={{ width: 14, height: 14 }} />
                        </motion.button>
                    ) : (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={submitting}
                            style={{
                                padding: '10px 28px', borderRadius: radius?.md || '10px',
                                background: submitting ? `${colors.border}60` : `linear-gradient(135deg, ${colors.accent}, ${colors.green || colors.accent})`,
                                color: submitting ? colors.textSecondary : '#fff',
                                border: 'none', fontSize: '14px', fontWeight: 700,
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                fontFamily: fonts.body,
                                display: 'flex', alignItems: 'center', gap: '6px',
                                boxShadow: submitting ? 'none' : `0 4px 16px ${colors.accent}30`,
                            }}>
                            {submitting ? (
                                <>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                        style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <HiOutlineCheckCircle style={{ width: 16, height: 16 }} />
                                    Submit Clinical Details
                                </>
                            )}
                        </motion.button>
                    )}
                </div>
            </div>
        </DoctorLayout>
    );
}
