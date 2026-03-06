// ============================================================
//  PostTrial — Multi-section trial posting form
// ============================================================

import { useState } from 'react';
import { useTheme } from '../../theme';

const PHASES = ['Phase I', 'Phase II', 'Phase III', 'Phase IV'];
const CATEGORIES = ['Endocrinology', 'Cardiology', 'Oncology', 'Neurology', 'Metabolic', 'Nephrology', 'Pulmonology', 'Rheumatology'];
const DIAGNOSES = ['Type 2 Diabetes', 'Hypertension', 'Breast Cancer', 'Chronic Kidney Disease', 'Metabolic Syndrome', 'Asthma', 'COPD', 'Rheumatoid Arthritis', 'Heart Failure', 'Alzheimer\'s Disease'];
const EXCLUSIONS = ['Pregnancy', 'Active Infection', 'Liver Cirrhosis', 'Uncontrolled Diabetes', 'Recent Surgery', 'Immunocompromised'];
const OPERATORS = ['>', '<', '>=', '<=', '=', '!='];

export default function PostTrial({ setPage }) {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();

    const [formData, setFormData] = useState({
        trialName: '',
        trialId: '',
        phase: '',
        category: '',
        duration: '',
        ageMin: '',
        ageMax: '',
        gender: 'All',
        diagnoses: [],
        exclusions: [],
        labValues: [{ labName: '', operator: '>', value: '', unit: '' }],
        slots: '',
        target: '',
        compensation: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
    });

    const [step, setStep] = useState('form'); // form | loading | preview | success
    const [openSection, setOpenSection] = useState('basic');

    const update = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

    const toggleChip = (key, val) => {
        setFormData(prev => ({
            ...prev,
            [key]: prev[key].includes(val)
                ? prev[key].filter(v => v !== val)
                : [...prev[key], val],
        }));
    };

    const addLabRow = () => {
        setFormData(prev => ({
            ...prev,
            labValues: [...prev.labValues, { labName: '', operator: '>', value: '', unit: '' }],
        }));
    };

    const updateLab = (idx, field, val) => {
        setFormData(prev => ({
            ...prev,
            labValues: prev.labValues.map((l, i) => i === idx ? { ...l, [field]: val } : l),
        }));
    };

    const removeLab = (idx) => {
        setFormData(prev => ({
            ...prev,
            labValues: prev.labValues.filter((_, i) => i !== idx),
        }));
    };

    const handleSubmit = () => {
        setStep('loading');
        setTimeout(() => setStep('preview'), 2500);
    };

    const handleConfirm = () => {
        setStep('success');
    };

    const inputStyle = {
        padding: `${spacing.sm} ${spacing.md}`,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.md,
        color: colors.textPrimary,
        fontFamily: fonts.body,
        fontSize: fontSize.sm,
        outline: 'none',
        transition: 'border-color 0.2s ease',
        width: '100%',
    };

    const labelStyle = {
        fontSize: fontSize.xs,
        fontWeight: 600,
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '6px',
        display: 'block',
    };

    const sectionStyle = (key) => ({
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.lg,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
    });

    const sectionHeaderStyle = (key) => ({
        padding: `${spacing.md} ${spacing.lg}`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: openSection === key ? colors.accentGlow : 'transparent',
        borderBottom: openSection === key ? `1px solid ${colors.border}` : 'none',
        transition: 'all 0.2s ease',
    });

    // ─── FORM VIEW ─────────────────────────────
    if (step === 'form') {
        return (
            <div style={{
                padding: spacing.xl,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.lg,
                animation: 'fadeInUp 0.4s ease',
            }}>

                {/* Section 1: Basic Info */}
                <div style={sectionStyle('basic')}>
                    <div style={sectionHeaderStyle('basic')} onClick={() => setOpenSection(openSection === 'basic' ? '' : 'basic')}>
                        <span style={{ fontSize: fontSize.base, fontWeight: 600, color: colors.textPrimary }}>
                            🔬 Basic Information
                        </span>
                        <span style={{ color: colors.textSecondary, fontSize: '18px' }}>{openSection === 'basic' ? '▾' : '▸'}</span>
                    </div>
                    {openSection === 'basic' && (
                        <div style={{ padding: spacing.lg, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                            <div>
                                <label style={labelStyle}>Trial Name</label>
                                <input style={inputStyle} placeholder="e.g. GLYCO-ADVANCE" value={formData.trialName} onChange={e => update('trialName', e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Trial ID</label>
                                <input style={inputStyle} placeholder="e.g. CT-2024-007" value={formData.trialId} onChange={e => update('trialId', e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Phase</label>
                                <select style={inputStyle} value={formData.phase} onChange={e => update('phase', e.target.value)}>
                                    <option value="">Select Phase</option>
                                    {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Medical Category</label>
                                <select style={inputStyle} value={formData.category} onChange={e => update('category', e.target.value)}>
                                    <option value="">Select Category</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Duration</label>
                                <input style={inputStyle} placeholder="e.g. 18 months" value={formData.duration} onChange={e => update('duration', e.target.value)} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 2: Patient Requirements */}
                <div style={sectionStyle('requirements')}>
                    <div style={sectionHeaderStyle('requirements')} onClick={() => setOpenSection(openSection === 'requirements' ? '' : 'requirements')}>
                        <span style={{ fontSize: fontSize.base, fontWeight: 600, color: colors.textPrimary }}>
                            👤 Patient Requirements
                        </span>
                        <span style={{ color: colors.textSecondary, fontSize: '18px' }}>{openSection === 'requirements' ? '▾' : '▸'}</span>
                    </div>
                    {openSection === 'requirements' && (
                        <div style={{ padding: spacing.lg, display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
                            {/* Age Range + Gender */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing.md }}>
                                <div>
                                    <label style={labelStyle}>Min Age</label>
                                    <input type="number" style={inputStyle} placeholder="18" value={formData.ageMin} onChange={e => update('ageMin', e.target.value)} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Max Age</label>
                                    <input type="number" style={inputStyle} placeholder="75" value={formData.ageMax} onChange={e => update('ageMax', e.target.value)} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Gender</label>
                                    <select style={inputStyle} value={formData.gender} onChange={e => update('gender', e.target.value)}>
                                        <option value="All">All</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                </div>
                            </div>

                            {/* Diagnoses Chips */}
                            <div>
                                <label style={labelStyle}>Required Diagnosis (select multiple)</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
                                    {DIAGNOSES.map(d => {
                                        const selected = formData.diagnoses.includes(d);
                                        return (
                                            <button key={d} onClick={() => toggleChip('diagnoses', d)} style={{
                                                padding: `${spacing.xs} ${spacing.md}`,
                                                borderRadius: radius.full,
                                                border: `1px solid ${selected ? colors.accent : colors.border}`,
                                                background: selected ? colors.accentGlow : 'transparent',
                                                color: selected ? colors.accent : colors.textSecondary,
                                                fontSize: fontSize.xs,
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                fontFamily: fonts.body,
                                                transition: 'all 0.2s ease',
                                            }}>
                                                {selected ? '✓ ' : ''}{d}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Exclusion Conditions */}
                            <div>
                                <label style={labelStyle}>Exclusion Conditions (select multiple)</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
                                    {EXCLUSIONS.map(e => {
                                        const selected = formData.exclusions.includes(e);
                                        return (
                                            <button key={e} onClick={() => toggleChip('exclusions', e)} style={{
                                                padding: `${spacing.xs} ${spacing.md}`,
                                                borderRadius: radius.full,
                                                border: `1px solid ${selected ? colors.red : colors.border}`,
                                                background: selected ? `${colors.red}15` : 'transparent',
                                                color: selected ? colors.red : colors.textSecondary,
                                                fontSize: fontSize.xs,
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                fontFamily: fonts.body,
                                                transition: 'all 0.2s ease',
                                            }}>
                                                {selected ? '✕ ' : ''}{e}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Lab Values */}
                            <div>
                                <label style={labelStyle}>Lab Values</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                                    {formData.labValues.map((lab, idx) => (
                                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 80px 1fr 1fr auto', gap: spacing.sm, alignItems: 'center' }}>
                                            <input style={inputStyle} placeholder="Lab Name (e.g. HbA1c)" value={lab.labName} onChange={e => updateLab(idx, 'labName', e.target.value)} />
                                            <select style={inputStyle} value={lab.operator} onChange={e => updateLab(idx, 'operator', e.target.value)}>
                                                {OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                            <input style={inputStyle} placeholder="Value" value={lab.value} onChange={e => updateLab(idx, 'value', e.target.value)} />
                                            <input style={inputStyle} placeholder="Unit" value={lab.unit} onChange={e => updateLab(idx, 'unit', e.target.value)} />
                                            <button onClick={() => removeLab(idx)} style={{
                                                background: `${colors.red}15`,
                                                color: colors.red,
                                                border: 'none',
                                                borderRadius: radius.sm,
                                                padding: spacing.sm,
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                lineHeight: 1,
                                            }}>✕</button>
                                        </div>
                                    ))}
                                    <button onClick={addLabRow} style={{
                                        background: colors.accentGlow,
                                        color: colors.accent,
                                        border: `1px dashed ${colors.accent}40`,
                                        borderRadius: radius.md,
                                        padding: spacing.sm,
                                        fontSize: fontSize.xs,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        fontFamily: fonts.body,
                                    }}>
                                        + Add Lab Value
                                    </button>

                                    {/* Lab Value Examples Hint */}
                                    <div style={{
                                        background: colors.surface,
                                        border: `1px solid ${colors.border}`,
                                        borderRadius: radius.md,
                                        padding: `${spacing.sm} ${spacing.md}`,
                                        marginTop: spacing.xs,
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: spacing.xs,
                                            marginBottom: spacing.xs,
                                        }}>
                                            <span style={{ fontSize: '13px' }}>💡</span>
                                            <span style={{
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                color: colors.textSecondary,
                                            }}>Common Lab Value Examples</span>
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
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    padding: '2px 8px',
                                                    borderRadius: radius.sm,
                                                    background: `${colors.accent}10`,
                                                    border: `1px solid ${colors.accent}20`,
                                                    fontSize: '11px',
                                                    fontFamily: fonts.mono,
                                                    color: colors.textSecondary,
                                                }}>
                                                    <span style={{ fontWeight: 600, color: colors.accent }}>{ex.lab}</span>
                                                    <span>{ex.op}</span>
                                                    <span>{ex.val}</span>
                                                    <span style={{ opacity: 0.6 }}>{ex.unit}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 3: Logistics */}
                <div style={sectionStyle('logistics')}>
                    <div style={sectionHeaderStyle('logistics')} onClick={() => setOpenSection(openSection === 'logistics' ? '' : 'logistics')}>
                        <span style={{ fontSize: fontSize.base, fontWeight: 600, color: colors.textPrimary }}>
                            📦 Logistics
                        </span>
                        <span style={{ color: colors.textSecondary, fontSize: '18px' }}>{openSection === 'logistics' ? '▾' : '▸'}</span>
                    </div>
                    {openSection === 'logistics' && (
                        <div style={{ padding: spacing.lg, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                            <div>
                                <label style={labelStyle}>Available Slots</label>
                                <input type="number" style={inputStyle} placeholder="50" value={formData.slots} onChange={e => update('slots', e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Enrollment Target</label>
                                <input type="number" style={inputStyle} placeholder="50" value={formData.target} onChange={e => update('target', e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Compensation</label>
                                <input style={inputStyle} placeholder="₹5,000/visit" value={formData.compensation} onChange={e => update('compensation', e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Location</label>
                                <input style={inputStyle} placeholder="Mumbai" value={formData.location} onChange={e => update('location', e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Start Date</label>
                                <input type="date" style={inputStyle} value={formData.startDate} onChange={e => update('startDate', e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>End Date</label>
                                <input type="date" style={inputStyle} value={formData.endDate} onChange={e => update('endDate', e.target.value)} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Description</label>
                                <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Describe the trial objectives, methodology, and any additional notes..." value={formData.description} onChange={e => update('description', e.target.value)} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button onClick={handleSubmit} style={{
                    padding: `${spacing.md} ${spacing.xl}`,
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: radius.md,
                    fontSize: fontSize.base,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: fonts.body,
                    transition: 'all 0.3s ease',
                    boxShadow: `0 4px 20px ${colors.accent}40`,
                }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 30px ${colors.accent}50`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 20px ${colors.accent}40`; }}
                >
                    🚀 Submit Trial for AI Matching
                </button>

                <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
            </div>
        );
    }

    // ─── LOADING VIEW ──────────────────────────
    if (step === 'loading') {
        return (
            <div style={{
                padding: spacing.xl,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
                gap: spacing.lg,
                animation: 'fadeInUp 0.4s ease',
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    border: `3px solid ${colors.border}`,
                    borderTop: `3px solid ${colors.accent}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }} />
                <h3 style={{
                    fontFamily: fonts.heading,
                    fontSize: fontSize.xl,
                    color: colors.textPrimary,
                    textAlign: 'center',
                }}>
                    🤖 AI is converting eligibility criteria into structured matching logic...
                </h3>
                <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center' }}>
                    Analyzing patient requirements, lab thresholds, and creating matching rules
                </p>
                <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
            </div>
        );
    }

    // ─── PREVIEW VIEW ──────────────────────────
    if (step === 'preview') {
        const rules = [
            { field: 'Age', condition: `>= ${formData.ageMin || 40} AND <= ${formData.ageMax || 70}` },
            ...(formData.diagnoses.length > 0 ? [{ field: 'Diagnosis', condition: `contains "${formData.diagnoses.join('" OR "')}"` }] : [{ field: 'Diagnosis', condition: 'contains "Type 2 Diabetes"' }]),
            ...(formData.labValues.filter(l => l.labName).map(l => ({ field: l.labName, condition: `${l.operator} ${l.value} ${l.unit}` }))),
            ...(formData.gender !== 'All' ? [{ field: 'Gender', condition: `= "${formData.gender}"` }] : []),
            ...(formData.exclusions.length > 0 ? [{ field: 'Exclusions', condition: `NOT "${formData.exclusions.join('", NOT "')}"` }] : []),
            { field: 'Location', condition: `within 50km of "${formData.location || 'Mumbai'}"` },
        ];

        return (
            <div style={{
                padding: spacing.xl,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.lg,
                animation: 'fadeInUp 0.4s ease',
            }}>
                <p style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
                    Review the structured logic rules below. These will be used to match eligible patients.
                </p>

                <div style={{
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                    borderRadius: radius.lg,
                    overflow: 'hidden',
                }}>
                    {rules.map((rule, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.md,
                            padding: `${spacing.md} ${spacing.lg}`,
                            borderBottom: idx < rules.length - 1 ? `1px solid ${colors.border}40` : 'none',
                        }}>
                            <span style={{
                                color: colors.green,
                                fontSize: '16px',
                            }}>✓</span>
                            <span style={{
                                fontSize: fontSize.sm,
                                fontFamily: fonts.mono,
                                color: colors.accent,
                                fontWeight: 600,
                                minWidth: '100px',
                            }}>
                                {rule.field}
                            </span>
                            <span style={{ fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: fonts.mono }}>
                                {rule.condition}
                            </span>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: spacing.md }}>
                    <button onClick={handleConfirm} style={{
                        flex: 1,
                        padding: spacing.md,
                        background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                        color: '#fff',
                        border: 'none',
                        borderRadius: radius.md,
                        fontSize: fontSize.base,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: fonts.body,
                    }}>
                        ✅ Confirm & Post Trial
                    </button>
                    <button onClick={() => setStep('form')} style={{
                        padding: `${spacing.md} ${spacing.lg}`,
                        background: 'transparent',
                        color: colors.textSecondary,
                        border: `1px solid ${colors.border}`,
                        borderRadius: radius.md,
                        fontSize: fontSize.sm,
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontFamily: fonts.body,
                    }}>
                        ← Edit Criteria
                    </button>
                </div>

                <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            </div>
        );
    }

    // ─── SUCCESS VIEW ──────────────────────────
    return (
        <div style={{
            padding: spacing.xl,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            gap: spacing.lg,
            animation: 'fadeInUp 0.4s ease',
        }}>
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: colors.greenGlow,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
            }}>
                🎉
            </div>
            <h2 style={{
                fontFamily: fonts.heading,
                fontSize: fontSize.xxl,
                fontWeight: 700,
                color: colors.textPrimary,
                textAlign: 'center',
                margin: 0,
            }}>
                Trial Posted Successfully!
            </h2>
            <p style={{
                fontSize: fontSize.lg,
                color: colors.accent,
                fontWeight: 600,
                textAlign: 'center',
            }}>
                🔗 47 matches found
            </p>
            <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center' }}>
                AI has identified 47 eligible patients based on your criteria. Review them in Matched Candidates.
            </p>
            <button onClick={() => setPage('candidates')} style={{
                padding: `${spacing.md} ${spacing.xl}`,
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                color: '#fff',
                border: 'none',
                borderRadius: radius.md,
                fontSize: fontSize.base,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: fonts.body,
                boxShadow: `0 4px 20px ${colors.accent}40`,
            }}>
                👥 View Matched Candidates →
            </button>

            <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
}

