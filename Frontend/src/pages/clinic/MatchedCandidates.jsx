// ============================================================
//  MatchedCandidates — Candidate table with filters + modal
// ============================================================

import { useState, useMemo } from 'react';
import { useTheme } from '../../theme';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import ScoreRing from '../../components/shared/ScoreRing';
import PatientAvatar from '../../components/shared/PatientAvatar';
import Modal from '../../components/shared/Modal';
import Toast from '../../components/shared/Toast';

export default function MatchedCandidates({ candidates, setCandidates }) {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();

    const [filters, setFilters] = useState({ minScore: 0, location: '', doctorStatus: '', gender: '' });
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

    const filtered = useMemo(() => {
        return candidates.filter(c => {
            if (c.score < filters.minScore) return false;
            if (filters.location && c.location !== filters.location) return false;
            if (filters.doctorStatus && c.doctorStatus !== filters.doctorStatus) return false;
            if (filters.gender && c.gender !== filters.gender) return false;
            return true;
        });
    }, [candidates, filters]);

    const locations = [...new Set(candidates.map(c => c.location))];

    const handleAction = (action, candidate) => {
        if (action === 'view') {
            setSelectedCandidate(candidate);
        } else if (action === 'accept') {
            setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, stage: 'Accepted', doctorStatus: 'Approved' } : c));
            setToast({ show: true, message: `${candidate.id} accepted & scheduled for screening`, variant: 'success' });
        } else if (action === 'decline') {
            setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, stage: 'Rejected', doctorStatus: 'Declined' } : c));
            setToast({ show: true, message: `${candidate.id} declined`, variant: 'info' });
        }
    };

    const handleBulkAccept = (selected) => {
        const ids = selected.map(c => c.id);
        setCandidates(prev => prev.map(c => ids.includes(c.id) ? { ...c, stage: 'Accepted', doctorStatus: 'Approved' } : c));
        setToast({ show: true, message: `${selected.length} candidates accepted`, variant: 'success' });
    };

    const handleExportCSV = () => {
        setToast({ show: true, message: 'CSV exported successfully', variant: 'success' });
    };

    const columns = [
        {
            key: 'id',
            label: 'Patient ID',
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <PatientAvatar patientId={row.id} size={28} />
                    <span style={{ fontFamily: fonts.mono, fontWeight: 600 }}>{row.id}</span>
                </div>
            ),
        },
        {
            key: 'age',
            label: 'Age / Gender',
            render: (row) => <span>{row.age} / {row.gender}</span>,
        },
        { key: 'location', label: 'Location' },
        {
            key: 'score',
            label: 'Match Score',
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <ScoreRing score={row.score} size={32} strokeWidth={3} />
                    <span style={{ fontFamily: fonts.mono, fontWeight: 600, fontSize: fontSize.sm }}>{row.score}%</span>
                </div>
            ),
        },
        {
            key: 'doctorStatus',
            label: 'Doctor Status',
            render: (row) => <StatusBadge status={row.doctorStatus} />,
        },
        {
            key: 'stage',
            label: 'Stage',
            render: (row) => <StatusBadge status={row.stage} />,
        },
        {
            key: 'actions',
            label: 'Actions',
            sortable: false,
            render: (row, idx, onAction) => (
                <div style={{ display: 'flex', gap: spacing.xs }}>
                    <button onClick={() => onAction('accept', row)} style={{
                        padding: `2px 8px`, borderRadius: radius.sm, fontSize: fontSize.xs, fontWeight: 600, cursor: 'pointer',
                        background: `${colors.green}20`, color: colors.green, border: `1px solid ${colors.green}40`, fontFamily: fonts.body,
                    }}>Accept</button>
                    <button onClick={() => onAction('decline', row)} style={{
                        padding: `2px 8px`, borderRadius: radius.sm, fontSize: fontSize.xs, fontWeight: 600, cursor: 'pointer',
                        background: `${colors.red}20`, color: colors.red, border: `1px solid ${colors.red}40`, fontFamily: fonts.body,
                    }}>Decline</button>
                    <button onClick={() => onAction('view', row)} style={{
                        padding: `2px 8px`, borderRadius: radius.sm, fontSize: fontSize.xs, fontWeight: 600, cursor: 'pointer',
                        background: colors.accentGlow, color: colors.accent, border: `1px solid ${colors.accent}40`, fontFamily: fonts.body,
                    }}>View</button>
                </div>
            ),
        },
    ];

    const selectStyle = {
        padding: `${spacing.xs} ${spacing.md}`,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.md,
        color: colors.textPrimary,
        fontFamily: fonts.body,
        fontSize: fontSize.xs,
        outline: 'none',
    };

    const matchExplanation = selectedCandidate ? [
        { label: `Age ${selectedCandidate.age} is within trial range (40–70)`, met: selectedCandidate.age >= 40 && selectedCandidate.age <= 70 },
        { label: `Diagnosis: ${selectedCandidate.diagnosis}`, met: true },
        { label: `HbA1c: ${selectedCandidate.hba1c || 'N/A'}${selectedCandidate.hba1c ? ' > 7.0' : ''}`, met: selectedCandidate.hba1c > 7 || !selectedCandidate.hba1c },
        { label: `BMI: ${selectedCandidate.bmi} within acceptable range`, met: selectedCandidate.bmi >= 18 && selectedCandidate.bmi <= 40 },
        { label: `Location: ${selectedCandidate.location} within 50km radius`, met: true },
        { label: `No exclusion conditions detected`, met: !selectedCandidate.kidneyDisease },
    ] : [];

    return (
        <div style={{ padding: spacing.xl, display: 'flex', flexDirection: 'column', gap: spacing.lg, animation: 'fadeInUp 0.4s ease' }}>
            {/* Trial context */}
            <div style={{ display: 'flex', gap: spacing.lg, fontSize: fontSize.sm, color: colors.textSecondary }}>
                <span>🔬 GLYCO-ADVANCE Phase III</span>
                <span>🆔 CT-2024-001</span>
                <span>📍 Mumbai</span>
                <span style={{ color: colors.accent, fontWeight: 600 }}>🔗 {filtered.length} matches</span>
            </div>

            {/* Filter Bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.lg,
                padding: spacing.md,
                background: colors.card,
                borderRadius: radius.lg,
                border: `1px solid ${colors.border}`,
                flexWrap: 'wrap',
            }}>
                <span style={{ fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: 600, whiteSpace: 'nowrap' }}>Filters:</span>

                {/* Min Score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, minWidth: '220px' }}>
                    <label style={{ fontSize: fontSize.xs, color: colors.textSecondary, whiteSpace: 'nowrap', minWidth: '65px' }}>Min Score</label>
                    <input type="range" min="0" max="100" step="1" value={filters.minScore}
                        onChange={e => setFilters(f => ({ ...f, minScore: parseInt(e.target.value) }))}
                        style={{ flex: 1, accentColor: colors.accent, minWidth: '100px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: fontSize.xs, fontFamily: fonts.mono, color: colors.accent, fontWeight: 700, minWidth: '36px', textAlign: 'right' }}>{filters.minScore}%</span>
                </div>

                {/* Dropdowns */}
                <select style={selectStyle} value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}>
                    <option value="">All Locations</option>
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <select style={selectStyle} value={filters.doctorStatus} onChange={e => setFilters(f => ({ ...f, doctorStatus: e.target.value }))}>
                    <option value="">All Doctor Status</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Declined">Declined</option>
                </select>
                <select style={selectStyle} value={filters.gender} onChange={e => setFilters(f => ({ ...f, gender: e.target.value }))}>
                    <option value="">All Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                </select>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={filtered}
                onAction={handleAction}
                selectable
                bulkActions={[
                    { label: '✅ Accept All', variant: 'primary', onClick: handleBulkAccept },
                    { label: '📥 Export CSV', variant: 'secondary', onClick: handleExportCSV },
                ]}
            />

            {/* Candidate Profile Modal */}
            <Modal
                isOpen={!!selectedCandidate}
                onClose={() => setSelectedCandidate(null)}
                title={`Candidate Profile — ${selectedCandidate?.id || ''}`}
                width="650px"
            >
                {selectedCandidate && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
                        {/* Demographics */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.md }}>
                            {[
                                { label: 'Age', value: selectedCandidate.age, icon: '🎂' },
                                { label: 'Gender', value: selectedCandidate.gender === 'M' ? 'Male' : 'Female', icon: '👤' },
                                { label: 'Location', value: selectedCandidate.location, icon: '📍' },
                            ].map(tile => (
                                <div key={tile.label} style={{
                                    background: colors.card,
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: radius.md,
                                    padding: spacing.md,
                                    textAlign: 'center',
                                }}>
                                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{tile.icon}</div>
                                    <div style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{tile.label}</div>
                                    <div style={{ fontSize: fontSize.lg, fontWeight: 700, color: colors.textPrimary }}>{tile.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Medical Snapshot */}
                        <div>
                            <h4 style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.textPrimary, marginBottom: spacing.sm }}>
                                🏥 Medical Snapshot
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
                                {[
                                    { label: 'Diagnosis', value: selectedCandidate.diagnosis },
                                    { label: 'HbA1c', value: selectedCandidate.hba1c ? `${selectedCandidate.hba1c}%` : 'N/A' },
                                    { label: 'BMI', value: selectedCandidate.bmi },
                                    { label: 'Kidney Disease', value: selectedCandidate.kidneyDisease ? 'Yes' : 'No' },
                                ].map(item => (
                                    <div key={item.label} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: `${spacing.xs} ${spacing.md}`,
                                        background: `${colors.border}30`,
                                        borderRadius: radius.sm,
                                    }}>
                                        <span style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{item.label}</span>
                                        <span style={{ fontSize: fontSize.xs, fontWeight: 600, color: colors.textPrimary, fontFamily: fonts.mono }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Match Explanation */}
                        <div>
                            <h4 style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.textPrimary, marginBottom: spacing.sm }}>
                                🤖 AI Match Explanation
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {matchExplanation.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: spacing.sm,
                                        padding: spacing.xs,
                                        fontSize: fontSize.xs,
                                    }}>
                                        <span style={{ color: item.met ? colors.green : colors.red, fontSize: '14px' }}>
                                            {item.met ? '✅' : '❌'}
                                        </span>
                                        <span style={{ color: item.met ? colors.textPrimary : colors.red }}>
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: spacing.md }}>
                            <button onClick={() => { handleAction('accept', selectedCandidate); setSelectedCandidate(null); }} style={{
                                flex: 1, padding: spacing.md, background: `linear-gradient(135deg, ${colors.green}, ${colors.accent})`,
                                color: '#fff', border: 'none', borderRadius: radius.md, fontSize: fontSize.sm, fontWeight: 700,
                                cursor: 'pointer', fontFamily: fonts.body,
                            }}>
                                ✅ Accept & Schedule Screening
                            </button>
                            <button onClick={() => { handleAction('decline', selectedCandidate); setSelectedCandidate(null); }} style={{
                                padding: `${spacing.md} ${spacing.lg}`, background: `${colors.red}15`, color: colors.red,
                                border: `1px solid ${colors.red}40`, borderRadius: radius.md, fontSize: fontSize.sm, fontWeight: 600,
                                cursor: 'pointer', fontFamily: fonts.body,
                            }}>
                                Decline
                            </button>
                            <button onClick={() => setToast({ show: true, message: 'Request sent to referring doctor', variant: 'info' })} style={{
                                padding: `${spacing.md} ${spacing.lg}`, background: 'transparent', color: colors.textSecondary,
                                border: `1px solid ${colors.border}`, borderRadius: radius.md, fontSize: fontSize.sm, fontWeight: 500,
                                cursor: 'pointer', fontFamily: fonts.body,
                            }}>
                                Request More Info
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <Toast
                message={toast.message}
                variant={toast.variant}
                isVisible={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
            />

            <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
}

