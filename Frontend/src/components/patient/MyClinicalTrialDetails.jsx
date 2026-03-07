import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme.jsx';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
    HiOutlineDocumentText,
    HiOutlineUserCircle,
    HiOutlineClipboardDocumentList,
    HiOutlineHeart,
    HiOutlineShieldCheck,
    HiOutlineCalendar,
    HiOutlineBuildingOffice2,
} from 'react-icons/hi2';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function MyClinicalTrialDetails() {
    const { colors, fonts } = useTheme();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(() => !!localStorage.getItem('token'));
    const [expandedId, setExpandedId] = useState(null);

    const card = {
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        boxShadow: colors.shadow,
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        fetch('/api/clinical-details/my', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(data => {
                if (data.ok) setRecords(data.data);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const Item = ({ label, value }) => value ? (
        <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: '11px', color: colors.textSecondary, fontFamily: fonts.body }}>{label}</span>
            <p style={{ margin: '2px 0 0', fontSize: '14px', color: colors.textPrimary, fontWeight: 500, fontFamily: fonts.body, wordBreak: 'break-word' }}>
                {Array.isArray(value) ? value.join(', ') : String(value)}
            </p>
        </div>
    ) : null;

    // eslint-disable-next-line no-unused-vars
    const Section = ({ icon: Icon, title, children }) => {
        const hasContent = React.Children.toArray(children).some(c => c);
        if (!hasContent) return null;
        return (
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <Icon style={{ width: 15, height: 15, color: colors.accent }} />
                    <h4 style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: colors.accent, fontFamily: fonts.heading, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {title}
                    </h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', paddingLeft: '21px' }}>
                    {children}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div style={{ padding: '60px', textAlign: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${colors.border}`, borderTopColor: colors.accent, margin: '0 auto 16px' }} />
                <p style={{ color: colors.textSecondary, fontFamily: fonts.body }}>Loading clinical trial details...</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: 1000 }}>
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
                        My Clinical Trial Details
                    </h2>
                    <span style={{ fontSize: '13px', color: colors.textSecondary, fontFamily: fonts.body }}>
                        Medical details submitted by your doctors for clinical trial eligibility
                    </span>
                </div>
            </motion.div>

            <div style={{
                padding: '12px 16px', borderRadius: '10px',
                background: colors.accentGlow || `${colors.accent}06`,
                border: `1px solid ${colors.accent}20`,
                fontSize: '13px', color: colors.textSecondary, fontFamily: fonts.body,
            }}>
                These records are <strong style={{ color: colors.textPrimary }}>read-only</strong>. Only your doctor can update clinical trial details.
            </div>

            {records.length === 0 ? (
                <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}
                    style={{ ...card, padding: '60px 20px', textAlign: 'center' }}>
                    <HiOutlineClipboardDocumentList style={{ width: 48, height: 48, color: colors.textSecondary, margin: '0 auto 12px', display: 'block' }} />
                    <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontFamily: fonts.heading, color: colors.textPrimary }}>No Records Yet</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: colors.textSecondary, fontFamily: fonts.body }}>
                        Your doctor has not submitted any clinical trial details. Share your anonymized ID during your next consultation.
                    </p>
                </motion.div>
            ) : (
                records.map((record, idx) => {
                    const isExpanded = expandedId === record._id;
                    return (
                        <motion.div key={record._id} {...fadeUp} transition={{ duration: 0.4, delay: 0.05 * idx }}>
                            <div style={{ ...card, overflow: 'hidden' }}>
                                {/* Record header */}
                                <div
                                    onClick={() => setExpandedId(isExpanded ? null : record._id)}
                                    style={{
                                        padding: '16px 20px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        borderBottom: isExpanded ? `1px solid ${colors.border}` : 'none',
                                        transition: 'all 0.2s',
                                    }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: '10px',
                                            background: `${colors.accent}12`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <HiOutlineClipboardDocumentList style={{ width: 18, height: 18, color: colors.accent }} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>
                                                {record.primaryDiagnosis || 'Clinical Assessment'}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: colors.textSecondary }}>
                                                {record.doctorInfo && (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                        <HiOutlineUserCircle style={{ width: 12, height: 12 }} />
                                                        {record.doctorInfo.name}
                                                        {record.doctorInfo.specialization && ` · ${record.doctorInfo.specialization}`}
                                                    </span>
                                                )}
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                    <HiOutlineCalendar style={{ width: 12, height: 12 }} />
                                                    {new Date(record.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '10px', fontWeight: 600, padding: '3px 10px', borderRadius: '8px',
                                        background: record.status === 'submitted' ? `${colors.green}15` : `${colors.accent}15`,
                                        color: record.status === 'submitted' ? colors.green : colors.accent,
                                        fontFamily: fonts.body, textTransform: 'capitalize',
                                    }}>
                                        {record.status}
                                    </span>
                                </div>

                                {/* Expanded details */}
                                {isExpanded && (
                                    <div style={{ padding: '20px' }}>
                                        <Section icon={HiOutlineUserCircle} title="Demographics">
                                            <Item label="Age" value={record.age} />
                                            <Item label="Gender" value={record.gender} />
                                            <Item label="Ethnicity" value={record.ethnicity} />
                                            <Item label="Blood Group" value={record.bloodGroup} />
                                            <Item label="Smoking" value={record.smokingStatus} />
                                            <Item label="Alcohol" value={record.alcoholUse} />
                                        </Section>

                                        <Section icon={HiOutlineClipboardDocumentList} title="Medical History">
                                            <Item label="Primary Diagnosis" value={record.primaryDiagnosis} />
                                            <Item label="Diagnosis Date" value={record.diagnosisDate ? new Date(record.diagnosisDate).toLocaleDateString() : null} />
                                            <Item label="Secondary Diagnoses" value={record.secondaryDiagnoses} />
                                            <Item label="Medical History" value={record.medicalHistory} />
                                            <Item label="Surgical History" value={record.surgicalHistory} />
                                            <Item label="Family History" value={record.familyHistory} />
                                            <Item label="Allergies" value={record.allergies} />
                                        </Section>

                                        {record.currentMedications?.length > 0 && record.currentMedications.some(m => m.name) && (
                                            <Section icon={HiOutlineClipboardDocumentList} title="Medications">
                                                {record.currentMedications.filter(m => m.name).map((m, i) => (
                                                    <Item key={i} label={m.name} value={`${m.dosage || '–'} · ${m.frequency || '–'}`} />
                                                ))}
                                            </Section>
                                        )}

                                        <Section icon={HiOutlineHeart} title="Vitals">
                                            <Item label="Blood Pressure" value={record.vitals?.bloodPressureSystolic ? `${record.vitals.bloodPressureSystolic}/${record.vitals.bloodPressureDiastolic} mmHg` : null} />
                                            <Item label="Heart Rate" value={record.vitals?.heartRate ? `${record.vitals.heartRate} bpm` : null} />
                                            <Item label="Weight" value={record.vitals?.weight ? `${record.vitals.weight} kg` : null} />
                                            <Item label="Height" value={record.vitals?.height ? `${record.vitals.height} cm` : null} />
                                            <Item label="BMI" value={record.vitals?.bmi} />
                                        </Section>

                                        <Section icon={HiOutlineHeart} title="Lab Values">
                                            <Item label="HbA1c" value={record.labValues?.hba1c} />
                                            <Item label="Creatinine" value={record.labValues?.creatinine} />
                                            <Item label="ALT" value={record.labValues?.alt} />
                                            <Item label="AST" value={record.labValues?.ast} />
                                            <Item label="Hemoglobin" value={record.labValues?.hemoglobin} />
                                            <Item label="Platelets" value={record.labValues?.plateletCount} />
                                            <Item label="WBC" value={record.labValues?.wbc} />
                                        </Section>

                                        <Section icon={HiOutlineShieldCheck} title="Eligibility">
                                            <Item label="ECOG Status" value={record.ecogPerformanceStatus != null ? record.ecogPerformanceStatus : null} />
                                            <Item label="Adequate Organ Function" value={record.hasAdequateOrganFunction != null ? (record.hasAdequateOrganFunction ? 'Yes' : 'No') : null} />
                                            <Item label="Pregnant/Nursing" value={record.isPregnantOrNursing != null ? (record.isPregnantOrNursing ? 'Yes' : 'No') : null} />
                                            <Item label="Informed Consent" value={record.hasInformedConsent != null ? (record.hasInformedConsent ? 'Yes' : 'No') : null} />
                                        </Section>

                                        {(record.inclusionNotes || record.exclusionNotes || record.doctorRemarks) && (
                                            <Section icon={HiOutlineDocumentText} title="Doctor Notes">
                                                {record.inclusionNotes && <Item label="Inclusion Notes" value={record.inclusionNotes} />}
                                                {record.exclusionNotes && <Item label="Exclusion Notes" value={record.exclusionNotes} />}
                                                {record.doctorRemarks && <Item label="Doctor Remarks" value={record.doctorRemarks} />}
                                            </Section>
                                        )}

                                        {record.doctorInfo?.hospital && (
                                            <div style={{
                                                marginTop: 8, padding: '10px 14px', borderRadius: '8px',
                                                background: colors.card, border: `1px solid ${colors.border}`,
                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                fontSize: '12px', color: colors.textSecondary,
                                            }}>
                                                <HiOutlineBuildingOffice2 style={{ width: 14, height: 14 }} />
                                                {record.doctorInfo.hospital}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })
            )}
        </div>
    );
}
