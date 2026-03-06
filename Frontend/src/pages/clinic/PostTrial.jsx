// ============================================================
//  PostTrial — Modern multi-step trial posting wizard
// ============================================================

import { useState, useRef } from 'react';
import { useTheme } from '../../theme';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineBeaker,
    HiOutlineUserCircle,
    HiOutlineTruck,
    HiOutlineCheckCircle,
    HiOutlineChevronRight,
    HiOutlineChevronLeft,
    HiOutlineRocketLaunch,
    HiOutlineSparkles,
    HiOutlineXMark,
    HiOutlinePlusCircle,
    HiOutlineLightBulb,
    HiOutlineLink,
    HiOutlineUserGroup,
    HiOutlineCpuChip,
    HiOutlineArrowPath,
    HiOutlineExclamationTriangle,
} from 'react-icons/hi2';

const PHASES = ['Phase I', 'Phase II', 'Phase III', 'Phase IV'];
const CATEGORIES = ['Endocrinology', 'Cardiology', 'Oncology', 'Neurology', 'Metabolic', 'Nephrology', 'Pulmonology', 'Rheumatology'];
const DIAGNOSES = ['Type 2 Diabetes', 'Hypertension', 'Breast Cancer', 'Chronic Kidney Disease', 'Metabolic Syndrome', 'Asthma', 'COPD', 'Rheumatoid Arthritis', 'Heart Failure', 'Alzheimer\'s Disease'];
const EXCLUSIONS = ['Pregnancy', 'Active Infection', 'Liver Cirrhosis', 'Uncontrolled Diabetes', 'Recent Surgery', 'Immunocompromised'];
const OPERATORS = ['>', '<', '>=', '<=', '=', '!='];

const STEPS = [
    { key: 'basic', label: 'Trial Info', Icon: HiOutlineBeaker },
    { key: 'requirements', label: 'Eligibility', Icon: HiOutlineUserCircle },
    { key: 'logistics', label: 'Logistics', Icon: HiOutlineTruck },
    { key: 'review', label: 'Review', Icon: HiOutlineCheckCircle },
];

export default function PostTrial({ setPage }) {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();

    const [formData, setFormData] = useState({
        trialName: '', trialId: '', phase: '', category: '', duration: '',
        ageMin: '', ageMax: '', gender: 'All',
        diagnoses: [], exclusions: [],
        labValues: [{ labName: '', operator: '>', value: '', unit: '' }],
        slots: '', target: '', compensation: '', location: '',
        startDate: '', endDate: '', description: '',
    });

    const [currentStep, setCurrentStep] = useState(0);
    const [phase, setPhase] = useState('form'); // form | loading | preview | success
    const [focusedField, setFocusedField] = useState(null);

    const update = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
    const toggleChip = (key, val) => setFormData(prev => ({
        ...prev,
        [key]: prev[key].includes(val) ? prev[key].filter(v => v !== val) : [...prev[key], val],
    }));
    const addLabRow = () => setFormData(prev => ({
        ...prev, labValues: [...prev.labValues, { labName: '', operator: '>', value: '', unit: '' }],
    }));
    const updateLab = (idx, field, val) => setFormData(prev => ({
        ...prev, labValues: prev.labValues.map((l, i) => i === idx ? { ...l, [field]: val } : l),
    }));
    const removeLab = (idx) => setFormData(prev => ({
        ...prev, labValues: prev.labValues.filter((_, i) => i !== idx),
    }));

    const handleSubmit = () => { setPhase('loading'); setTimeout(() => setPhase('preview'), 2500); };
    const handleConfirm = () => setPhase('success');

    // ── Shared styles ─────────────────────────
    const inputBase = {
        padding: `10px 14px`,
        background: colors.surface,
        border: `1.5px solid ${colors.border}`,
        borderRadius: radius.md,
        color: colors.textPrimary,
        fontFamily: fonts.body,
        fontSize: fontSize.sm,
        outline: 'none',
        transition: 'all 0.2s ease',
        width: '100%',
        boxSizing: 'border-box',
    };
    const inputFocusStyle = (name) => ({
        ...inputBase,
        borderColor: focusedField === name ? colors.accent : colors.border,
        boxShadow: focusedField === name ? `0 0 0 3px ${colors.accent}15` : 'none',
    });
    const labelStyle = {
        fontSize: fontSize.xs, fontWeight: 600, color: colors.textSecondary,
        textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px',
        display: 'block', fontFamily: fonts.body,
    };

    const nextStep = () => currentStep < STEPS.length - 1 && setCurrentStep(currentStep + 1);
    const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

    // ── Stepper Header ────────────────────────
    const Stepper = () => (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 0,
            padding: `${spacing.lg} ${spacing.xl}`,
            background: colors.card,
            borderRadius: radius.lg,
            border: `1px solid ${colors.border}`,
            marginBottom: spacing.lg,
        }}>
            {STEPS.map((s, i) => {
                const isActive = i === currentStep;
                const isDone = i < currentStep;
                const StepIcon = s.Icon;
                return (
                    <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            onClick={() => i <= currentStep && setCurrentStep(i)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: spacing.sm,
                                padding: `8px 16px`, borderRadius: radius.full,
                                background: isActive ? colors.accentGlow : isDone ? colors.greenGlow : 'transparent',
                                border: `1.5px solid ${isActive ? colors.accent : isDone ? colors.green : colors.border}`,
                                cursor: i <= currentStep ? 'pointer' : 'default',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <div style={{
                                width: 28, height: 28, borderRadius: '50%',
                                background: isActive ? colors.accent : isDone ? colors.green : `${colors.border}40`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.3s',
                            }}>
                                {isDone
                                    ? <HiOutlineCheckCircle style={{ width: 16, height: 16, color: '#fff' }} />
                                    : <StepIcon style={{ width: 14, height: 14, color: isActive ? '#fff' : colors.textSecondary }} />}
                            </div>
                            <span style={{
                                fontSize: fontSize.xs, fontWeight: isActive ? 700 : 500,
                                color: isActive ? colors.accent : isDone ? colors.green : colors.textSecondary,
                                fontFamily: fonts.body, whiteSpace: 'nowrap',
                            }}>{s.label}</span>
                        </motion.div>
                        {i < STEPS.length - 1 && (
                            <div style={{
                                flex: 1, height: 2, margin: `0 ${spacing.sm}`,
                                background: isDone ? colors.green : `${colors.border}60`,
                                borderRadius: 1, transition: 'background 0.5s',
                            }} />
                        )}
                    </div>
                );
            })}
        </div>
    );

    // ── Step 1: Basic Info ─────────────────────
    const BasicInfoStep = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm,
            }}>
                <div style={{ width: 40, height: 40, borderRadius: radius.md, background: colors.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HiOutlineBeaker style={{ width: 20, height: 20, color: colors.accent }} />
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                        Trial Information
                    </h3>
                    <p style={{ margin: 0, fontSize: fontSize.xs, color: colors.textSecondary }}>Enter the basic details about your clinical trial</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                <div>
                    <label style={labelStyle}>Trial Name *</label>
                    <input style={inputFocusStyle('trialName')} placeholder="e.g. GLYCO-ADVANCE"
                        value={formData.trialName} onChange={e => update('trialName', e.target.value)}
                        onFocus={() => setFocusedField('trialName')} onBlur={() => setFocusedField(null)} />
                </div>
                <div>
                    <label style={labelStyle}>Trial ID *</label>
                    <input style={inputFocusStyle('trialId')} placeholder="e.g. CT-2024-007"
                        value={formData.trialId} onChange={e => update('trialId', e.target.value)}
                        onFocus={() => setFocusedField('trialId')} onBlur={() => setFocusedField(null)} />
                </div>
                <div>
                    <label style={labelStyle}>Phase *</label>
                    <select style={inputFocusStyle('phase')} value={formData.phase} onChange={e => update('phase', e.target.value)}
                        onFocus={() => setFocusedField('phase')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select Phase</option>
                        {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>Medical Category *</label>
                    <select style={inputFocusStyle('category')} value={formData.category} onChange={e => update('category', e.target.value)}
                        onFocus={() => setFocusedField('category')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select Category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Duration</label>
                    <input style={inputFocusStyle('duration')} placeholder="e.g. 18 months"
                        value={formData.duration} onChange={e => update('duration', e.target.value)}
                        onFocus={() => setFocusedField('duration')} onBlur={() => setFocusedField(null)} />
                </div>
            </div>
        </motion.div>
    );

    // ── Step 2: Patient Requirements ──────────
    const RequirementsStep = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                <div style={{ width: 40, height: 40, borderRadius: radius.md, background: colors.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HiOutlineUserCircle style={{ width: 20, height: 20, color: colors.accent }} />
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                        Eligibility Criteria
                    </h3>
                    <p style={{ margin: 0, fontSize: fontSize.xs, color: colors.textSecondary }}>Define patient requirements for AI-powered matching</p>
                </div>
            </div>

            {/* Age + Gender */}
            <div style={{
                background: colors.card, border: `1px solid ${colors.border}`, borderRadius: radius.lg,
                padding: spacing.lg,
            }}>
                <label style={{ ...labelStyle, marginBottom: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                    <HiOutlineUserCircle style={{ width: 14, height: 14, color: colors.accent }} /> Demographics
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing.md }}>
                    <div>
                        <label style={{ ...labelStyle, fontSize: '10px' }}>Min Age</label>
                        <input type="number" style={inputFocusStyle('ageMin')} placeholder="18"
                            value={formData.ageMin} onChange={e => update('ageMin', e.target.value)}
                            onFocus={() => setFocusedField('ageMin')} onBlur={() => setFocusedField(null)} />
                    </div>
                    <div>
                        <label style={{ ...labelStyle, fontSize: '10px' }}>Max Age</label>
                        <input type="number" style={inputFocusStyle('ageMax')} placeholder="75"
                            value={formData.ageMax} onChange={e => update('ageMax', e.target.value)}
                            onFocus={() => setFocusedField('ageMax')} onBlur={() => setFocusedField(null)} />
                    </div>
                    <div>
                        <label style={{ ...labelStyle, fontSize: '10px' }}>Gender</label>
                        <select style={inputFocusStyle('gender')} value={formData.gender}
                            onChange={e => update('gender', e.target.value)}
                            onFocus={() => setFocusedField('gender')} onBlur={() => setFocusedField(null)}>
                            <option value="All">All</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Diagnoses */}
            <div style={{
                background: colors.card, border: `1px solid ${colors.border}`, borderRadius: radius.lg,
                padding: spacing.lg,
            }}>
                <label style={{ ...labelStyle, marginBottom: spacing.md }}>Required Diagnosis (select multiple)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
                    {DIAGNOSES.map(d => {
                        const sel = formData.diagnoses.includes(d);
                        return (
                            <motion.button key={d} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                onClick={() => toggleChip('diagnoses', d)} style={{
                                    padding: `6px 14px`, borderRadius: radius.full,
                                    border: `1.5px solid ${sel ? colors.accent : colors.border}`,
                                    background: sel ? colors.accentGlow : 'transparent',
                                    color: sel ? colors.accent : colors.textSecondary,
                                    fontSize: fontSize.xs, fontWeight: sel ? 600 : 500,
                                    cursor: 'pointer', fontFamily: fonts.body,
                                    transition: 'all 0.2s ease',
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                }}>
                                {sel && <HiOutlineCheckCircle style={{ width: 12, height: 12 }} />} {d}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Exclusions */}
            <div style={{
                background: colors.card, border: `1px solid ${colors.border}`, borderRadius: radius.lg,
                padding: spacing.lg,
            }}>
                <label style={{ ...labelStyle, marginBottom: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                    <HiOutlineExclamationTriangle style={{ width: 14, height: 14, color: colors.red || '#EF4444' }} /> Exclusion Conditions
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
                    {EXCLUSIONS.map(e => {
                        const sel = formData.exclusions.includes(e);
                        return (
                            <motion.button key={e} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                onClick={() => toggleChip('exclusions', e)} style={{
                                    padding: `6px 14px`, borderRadius: radius.full,
                                    border: `1.5px solid ${sel ? (colors.red || '#EF4444') : colors.border}`,
                                    background: sel ? `${colors.red || '#EF4444'}12` : 'transparent',
                                    color: sel ? (colors.red || '#EF4444') : colors.textSecondary,
                                    fontSize: fontSize.xs, fontWeight: sel ? 600 : 500,
                                    cursor: 'pointer', fontFamily: fonts.body,
                                    transition: 'all 0.2s ease',
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                }}>
                                {sel && <HiOutlineXMark style={{ width: 12, height: 12 }} />} {e}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Lab Values */}
            <div style={{
                background: colors.card, border: `1px solid ${colors.border}`, borderRadius: radius.lg,
                padding: spacing.lg,
            }}>
                <label style={{ ...labelStyle, marginBottom: spacing.md }}>Lab Value Thresholds</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {formData.labValues.map((lab, idx) => (
                        <div key={idx} style={{
                            display: 'grid', gridTemplateColumns: '2fr 80px 1fr 1fr auto', gap: spacing.sm, alignItems: 'center',
                        }}>
                            <input style={inputFocusStyle(`lab-${idx}`)} placeholder="Lab Name (e.g. HbA1c)"
                                value={lab.labName} onChange={e => updateLab(idx, 'labName', e.target.value)}
                                onFocus={() => setFocusedField(`lab-${idx}`)} onBlur={() => setFocusedField(null)} />
                            <select style={inputBase} value={lab.operator} onChange={e => updateLab(idx, 'operator', e.target.value)}>
                                {OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <input style={inputFocusStyle(`labval-${idx}`)} placeholder="Value"
                                value={lab.value} onChange={e => updateLab(idx, 'value', e.target.value)}
                                onFocus={() => setFocusedField(`labval-${idx}`)} onBlur={() => setFocusedField(null)} />
                            <input style={inputFocusStyle(`labunit-${idx}`)} placeholder="Unit"
                                value={lab.unit} onChange={e => updateLab(idx, 'unit', e.target.value)}
                                onFocus={() => setFocusedField(`labunit-${idx}`)} onBlur={() => setFocusedField(null)} />
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => removeLab(idx)} style={{
                                background: `${colors.red || '#EF4444'}12`, color: colors.red || '#EF4444',
                                border: 'none', borderRadius: radius.sm, padding: '8px',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <HiOutlineXMark style={{ width: 16, height: 16 }} />
                            </motion.button>
                        </div>
                    ))}
                    <motion.button whileHover={{ scale: 1.01 }} onClick={addLabRow} style={{
                        background: colors.accentGlow, color: colors.accent,
                        border: `1.5px dashed ${colors.accent}40`, borderRadius: radius.md,
                        padding: `10px`, fontSize: fontSize.xs, fontWeight: 600,
                        cursor: 'pointer', fontFamily: fonts.body,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
                    }}>
                        <HiOutlinePlusCircle style={{ width: 16, height: 16 }} /> Add Lab Value
                    </motion.button>

                    {/* Hints */}
                    <div style={{
                        background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.md,
                        padding: `${spacing.sm} ${spacing.md}`, marginTop: spacing.xs,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs }}>
                            <HiOutlineLightBulb style={{ width: 14, height: 14, color: colors.accent }} />
                            <span style={{ fontSize: '11px', fontWeight: 600, color: colors.textSecondary }}>Common Lab Value Examples</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {[
                                { lab: 'HbA1c', op: '>', val: '7.0', unit: '%' },
                                { lab: 'BMI', op: '>=', val: '25', unit: 'kg/m²' },
                                { lab: 'eGFR', op: '>=', val: '60', unit: 'mL/min' },
                                { lab: 'LDL', op: '<', val: '130', unit: 'mg/dL' },
                                { lab: 'Creatinine', op: '<=', val: '1.5', unit: 'mg/dL' },
                            ].map((ex, i) => (
                                <span key={i} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                    padding: '2px 8px', borderRadius: radius.sm,
                                    background: `${colors.accent}10`, border: `1px solid ${colors.accent}20`,
                                    fontSize: '11px', fontFamily: fonts.mono, color: colors.textSecondary,
                                    cursor: 'pointer',
                                }} onClick={() => {
                                    const emptyIdx = formData.labValues.findIndex(l => !l.labName);
                                    if (emptyIdx >= 0) {
                                        updateLab(emptyIdx, 'labName', ex.lab);
                                        updateLab(emptyIdx, 'operator', ex.op);
                                        updateLab(emptyIdx, 'value', ex.val);
                                        updateLab(emptyIdx, 'unit', ex.unit);
                                    } else {
                                        setFormData(prev => ({
                                            ...prev,
                                            labValues: [...prev.labValues, { labName: ex.lab, operator: ex.op, value: ex.val, unit: ex.unit }],
                                        }));
                                    }
                                }}>
                                    <span style={{ fontWeight: 600, color: colors.accent }}>{ex.lab}</span>
                                    <span>{ex.op}</span><span>{ex.val}</span>
                                    <span style={{ opacity: 0.6 }}>{ex.unit}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    // ── Step 3: Logistics ─────────────────────
    const LogisticsStep = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                <div style={{ width: 40, height: 40, borderRadius: radius.md, background: colors.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HiOutlineTruck style={{ width: 20, height: 20, color: colors.accent }} />
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                        Logistics & Details
                    </h3>
                    <p style={{ margin: 0, fontSize: fontSize.xs, color: colors.textSecondary }}>Set enrollment targets, compensation, and schedule</p>
                </div>
            </div>

            <div style={{
                background: colors.card, border: `1px solid ${colors.border}`, borderRadius: radius.lg,
                padding: spacing.lg,
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md,
            }}>
                <div>
                    <label style={labelStyle}>Available Slots</label>
                    <input type="number" style={inputFocusStyle('slots')} placeholder="50"
                        value={formData.slots} onChange={e => update('slots', e.target.value)}
                        onFocus={() => setFocusedField('slots')} onBlur={() => setFocusedField(null)} />
                </div>
                <div>
                    <label style={labelStyle}>Enrollment Target</label>
                    <input type="number" style={inputFocusStyle('target')} placeholder="50"
                        value={formData.target} onChange={e => update('target', e.target.value)}
                        onFocus={() => setFocusedField('target')} onBlur={() => setFocusedField(null)} />
                </div>
                <div>
                    <label style={labelStyle}>Compensation</label>
                    <input style={inputFocusStyle('compensation')} placeholder="₹5,000/visit"
                        value={formData.compensation} onChange={e => update('compensation', e.target.value)}
                        onFocus={() => setFocusedField('compensation')} onBlur={() => setFocusedField(null)} />
                </div>
                <div>
                    <label style={labelStyle}>Location</label>
                    <input style={inputFocusStyle('location')} placeholder="Mumbai"
                        value={formData.location} onChange={e => update('location', e.target.value)}
                        onFocus={() => setFocusedField('location')} onBlur={() => setFocusedField(null)} />
                </div>
                <div>
                    <label style={labelStyle}>Start Date</label>
                    <input type="date" style={inputFocusStyle('startDate')}
                        value={formData.startDate} onChange={e => update('startDate', e.target.value)}
                        onFocus={() => setFocusedField('startDate')} onBlur={() => setFocusedField(null)} />
                </div>
                <div>
                    <label style={labelStyle}>End Date</label>
                    <input type="date" style={inputFocusStyle('endDate')}
                        value={formData.endDate} onChange={e => update('endDate', e.target.value)}
                        onFocus={() => setFocusedField('endDate')} onBlur={() => setFocusedField(null)} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Description</label>
                    <textarea style={{ ...inputFocusStyle('description'), minHeight: '120px', resize: 'vertical' }}
                        placeholder="Describe the trial objectives, methodology, and any additional notes..."
                        value={formData.description} onChange={e => update('description', e.target.value)}
                        onFocus={() => setFocusedField('description')} onBlur={() => setFocusedField(null)} />
                </div>
            </div>
        </motion.div>
    );

    // ── Step 4: Review ────────────────────────
    const ReviewStep = () => {
        const sections = [
            {
                title: 'Trial Information', Icon: HiOutlineBeaker,
                items: [
                    ['Trial Name', formData.trialName || '—'],
                    ['Trial ID', formData.trialId || '—'],
                    ['Phase', formData.phase || '—'],
                    ['Category', formData.category || '—'],
                    ['Duration', formData.duration || '—'],
                ],
            },
            {
                title: 'Eligibility Criteria', Icon: HiOutlineUserCircle,
                items: [
                    ['Age Range', `${formData.ageMin || '—'} to ${formData.ageMax || '—'}`],
                    ['Gender', formData.gender],
                    ['Diagnoses', formData.diagnoses.length > 0 ? formData.diagnoses.join(', ') : '—'],
                    ['Exclusions', formData.exclusions.length > 0 ? formData.exclusions.join(', ') : '—'],
                    ['Lab Values', formData.labValues.filter(l => l.labName).map(l => `${l.labName} ${l.operator} ${l.value} ${l.unit}`).join('; ') || '—'],
                ],
            },
            {
                title: 'Logistics', Icon: HiOutlineTruck,
                items: [
                    ['Slots', formData.slots || '—'],
                    ['Target', formData.target || '—'],
                    ['Compensation', formData.compensation || '—'],
                    ['Location', formData.location || '—'],
                    ['Schedule', `${formData.startDate || '—'} to ${formData.endDate || '—'}`],
                ],
            },
        ];

        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                    <div style={{ width: 40, height: 40, borderRadius: radius.md, background: colors.greenGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <HiOutlineCheckCircle style={{ width: 20, height: 20, color: colors.green }} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                            Review & Submit
                        </h3>
                        <p style={{ margin: 0, fontSize: fontSize.xs, color: colors.textSecondary }}>Verify all details before submitting for AI matching</p>
                    </div>
                </div>

                {sections.map((sec, si) => {
                    const SecIcon = sec.Icon;
                    return (
                        <motion.div key={sec.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: si * 0.1 }}
                            style={{
                                background: colors.card, border: `1px solid ${colors.border}`, borderRadius: radius.lg,
                                overflow: 'hidden',
                            }}>
                            <div style={{
                                padding: `${spacing.md} ${spacing.lg}`, background: colors.accentGlow,
                                display: 'flex', alignItems: 'center', gap: spacing.sm,
                                borderBottom: `1px solid ${colors.border}`,
                            }}>
                                <SecIcon style={{ width: 16, height: 16, color: colors.accent }} />
                                <span style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>
                                    {sec.title}
                                </span>
                            </div>
                            <div style={{ padding: `${spacing.sm} ${spacing.lg}` }}>
                                {sec.items.map(([label, value], i) => (
                                    <div key={label} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                                        padding: `${spacing.sm} 0`,
                                        borderBottom: i < sec.items.length - 1 ? `1px solid ${colors.border}30` : 'none',
                                    }}>
                                        <span style={{ fontSize: fontSize.xs, fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: fonts.mono || fonts.body, minWidth: 120 }}>{label}</span>
                                        <span style={{ fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: fonts.body, textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        );
    };

    // ── FORM VIEW ─────────────────────────────
    if (phase === 'form') {
        const stepComponents = [BasicInfoStep, RequirementsStep, LogisticsStep, ReviewStep];
        const CurrentStepComponent = stepComponents[currentStep];

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <Stepper />

                <div style={{
                    background: colors.surface, border: `1px solid ${colors.border}`,
                    borderRadius: radius.lg, padding: spacing.xl, boxShadow: colors.shadow,
                }}>
                    <AnimatePresence mode="wait">
                        <CurrentStepComponent key={currentStep} />
                    </AnimatePresence>

                    {/* Navigation buttons */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        marginTop: spacing.xl, paddingTop: spacing.lg,
                        borderTop: `1px solid ${colors.border}`,
                    }}>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            style={{
                                padding: `10px 24px`, borderRadius: radius.md,
                                background: currentStep === 0 ? `${colors.border}30` : colors.card,
                                color: currentStep === 0 ? `${colors.textSecondary}60` : colors.textPrimary,
                                border: `1px solid ${colors.border}`,
                                fontSize: fontSize.sm, fontWeight: 600, fontFamily: fonts.body,
                                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: spacing.xs,
                                transition: 'all 0.2s',
                            }}>
                            <HiOutlineChevronLeft style={{ width: 16, height: 16 }} /> Previous
                        </motion.button>

                        <span style={{ fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: fonts.body }}>
                            Step {currentStep + 1} of {STEPS.length}
                        </span>

                        {currentStep < STEPS.length - 1 ? (
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={nextStep}
                                style={{
                                    padding: `10px 24px`, borderRadius: radius.md,
                                    background: colors.accent, color: '#fff', border: 'none',
                                    fontSize: fontSize.sm, fontWeight: 600, fontFamily: fonts.body,
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: spacing.xs,
                                    boxShadow: `0 2px 12px ${colors.accent}30`,
                                }}>
                                Next <HiOutlineChevronRight style={{ width: 16, height: 16 }} />
                            </motion.button>
                        ) : (
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                style={{
                                    padding: `10px 28px`, borderRadius: radius.md,
                                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                                    color: '#fff', border: 'none',
                                    fontSize: fontSize.sm, fontWeight: 700, fontFamily: fonts.body,
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: spacing.xs,
                                    boxShadow: `0 4px 20px ${colors.accent}40`,
                                }}>
                                <HiOutlineRocketLaunch style={{ width: 16, height: 16 }} /> Submit for AI Matching
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ── LOADING VIEW ──────────────────────────
    if (phase === 'loading') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    minHeight: '450px', gap: spacing.lg,
                    background: colors.surface, border: `1px solid ${colors.border}`,
                    borderRadius: radius.lg, padding: spacing.xl,
                }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    style={{
                        width: 72, height: 72, borderRadius: '50%',
                        border: `3px solid ${colors.border}`, borderTopColor: colors.accent,
                    }} />
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{
                        fontFamily: fonts.heading, fontSize: fontSize.xl, color: colors.textPrimary,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
                        margin: `0 0 ${spacing.sm}`,
                    }}>
                        <HiOutlineCpuChip style={{ width: 24, height: 24, color: colors.accent }} />
                        AI Processing Trial Criteria
                    </h3>
                    <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, margin: 0 }}>
                        Converting eligibility criteria into structured matching logic...
                    </p>
                </div>
            </motion.div>
        );
    }

    // ── PREVIEW VIEW ──────────────────────────
    if (phase === 'preview') {
        const rules = [
            { field: 'Age', condition: `>= ${formData.ageMin || 40} AND <= ${formData.ageMax || 70}` },
            ...(formData.diagnoses.length > 0 ? [{ field: 'Diagnosis', condition: `contains "${formData.diagnoses.join('" OR "')}"` }] : [{ field: 'Diagnosis', condition: 'contains "Type 2 Diabetes"' }]),
            ...(formData.labValues.filter(l => l.labName).map(l => ({ field: l.labName, condition: `${l.operator} ${l.value} ${l.unit}` }))),
            ...(formData.gender !== 'All' ? [{ field: 'Gender', condition: `= "${formData.gender}"` }] : []),
            ...(formData.exclusions.length > 0 ? [{ field: 'Exclusions', condition: `NOT "${formData.exclusions.join('", NOT "')}"` }] : []),
            { field: 'Location', condition: `within 50km of "${formData.location || 'Mumbai'}"` },
        ];

        return (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
                <div style={{
                    background: colors.surface, border: `1px solid ${colors.border}`,
                    borderRadius: radius.lg, padding: spacing.xl,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
                        <div style={{ width: 40, height: 40, borderRadius: radius.md, background: colors.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <HiOutlineCpuChip style={{ width: 20, height: 20, color: colors.accent }} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: fontSize.lg, fontFamily: fonts.heading, fontWeight: 700, color: colors.textPrimary }}>
                                AI-Generated Matching Rules
                            </h3>
                            <p style={{ margin: 0, fontSize: fontSize.xs, color: colors.textSecondary }}>
                                Review the structured logic that will be used to match eligible patients
                            </p>
                        </div>
                    </div>

                    <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: radius.lg, overflow: 'hidden' }}>
                        {rules.map((rule, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.06 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: spacing.md,
                                    padding: `${spacing.md} ${spacing.lg}`,
                                    borderBottom: idx < rules.length - 1 ? `1px solid ${colors.border}30` : 'none',
                                }}>
                                <HiOutlineCheckCircle style={{ width: 18, height: 18, color: colors.green, flexShrink: 0 }} />
                                <span style={{
                                    fontSize: fontSize.sm, fontFamily: fonts.mono, color: colors.accent,
                                    fontWeight: 600, minWidth: '100px',
                                }}>{rule.field}</span>
                                <span style={{ fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.mono }}>
                                    {rule.condition}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: spacing.md }}>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={handleConfirm} style={{
                            flex: 1, padding: `12px ${spacing.lg}`,
                            background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                            color: '#fff', border: 'none', borderRadius: radius.md,
                            fontSize: fontSize.base, fontWeight: 700, cursor: 'pointer', fontFamily: fonts.body,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
                            boxShadow: `0 4px 20px ${colors.accent}40`,
                        }}>
                        <HiOutlineCheckCircle style={{ width: 18, height: 18 }} /> Confirm & Post Trial
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }}
                        onClick={() => setPhase('form')} style={{
                            padding: `12px ${spacing.lg}`, background: 'transparent',
                            color: colors.textSecondary, border: `1px solid ${colors.border}`,
                            borderRadius: radius.md, fontSize: fontSize.sm, fontWeight: 500,
                            cursor: 'pointer', fontFamily: fonts.body,
                            display: 'flex', alignItems: 'center', gap: spacing.xs,
                        }}>
                        <HiOutlineArrowPath style={{ width: 16, height: 16 }} /> Edit Criteria
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    // ── SUCCESS VIEW ──────────────────────────
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: '450px', gap: spacing.lg,
                background: colors.surface, border: `1px solid ${colors.border}`,
                borderRadius: radius.lg, padding: spacing.xl,
            }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                style={{
                    width: 80, height: 80, borderRadius: '50%', background: colors.greenGlow,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <HiOutlineCheckCircle style={{ width: 40, height: 40, color: colors.green }} />
            </motion.div>
            <h2 style={{
                fontFamily: fonts.heading, fontSize: fontSize.xxl, fontWeight: 700,
                color: colors.textPrimary, textAlign: 'center', margin: 0,
            }}>
                Trial Posted Successfully!
            </h2>
            <p style={{
                fontSize: fontSize.lg, color: colors.accent, fontWeight: 600, textAlign: 'center',
                display: 'flex', alignItems: 'center', gap: spacing.sm, margin: 0,
            }}>
                <HiOutlineLink style={{ width: 20, height: 20 }} /> 47 matches found
            </p>
            <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center', maxWidth: 420, margin: 0 }}>
                AI has identified 47 eligible patients based on your criteria. Review them in Matched Candidates.
            </p>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setPage('candidates')} style={{
                    padding: `12px 32px`,
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                    color: '#fff', border: 'none', borderRadius: radius.md,
                    fontSize: fontSize.base, fontWeight: 700, cursor: 'pointer', fontFamily: fonts.body,
                    boxShadow: `0 4px 20px ${colors.accent}40`,
                    display: 'flex', alignItems: 'center', gap: spacing.sm,
                }}>
                <HiOutlineUserGroup style={{ width: 18, height: 18 }} /> View Matched Candidates
            </motion.button>
        </motion.div>
    );
}
