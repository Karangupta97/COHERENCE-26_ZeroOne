import React, { useState } from 'react';
import { useTheme } from '../../theme';
import DoctorLayout from '../../components/shared/DoctorLayout';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
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
} from 'react-icons/hi2';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

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
    };

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
                {renderInput('Medical History', 'medicalHistory', { placeholder: 'Comma-separated: Asthma, Migraines' })}
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

    // ── Success view ───────────────────────────────
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
                        Clinical Trial Details Submitted!
                    </h2>
                    <p style={{ margin: 0, fontSize: '14px', color: colors.textSecondary, maxWidth: 400 }}>
                        Details for patient <strong>{anonymizedId}</strong> have been recorded. The patient can now view these details in their dashboard.
                    </p>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={resetAll}
                        style={{
                            marginTop: '8px', padding: '10px 28px', borderRadius: radius?.md || '10px',
                            background: colors.accent, color: '#fff', border: 'none',
                            fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: fonts.body,
                        }}>
                        Submit for Another Patient
                    </motion.button>
                </motion.div>
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
