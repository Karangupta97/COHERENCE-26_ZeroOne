// ============================================================
//  TrialsManagement — Trial table with actions
// ============================================================

import { useState } from 'react';
import { useTheme } from '../../theme';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import ProgressBar from '../../components/shared/ProgressBar';
import Toast from '../../components/shared/Toast';
import { CLINIC_TRIALS } from './data/mockData';

export default function TrialsManagement({ setPage }) {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();
    const [trials, setTrials] = useState(CLINIC_TRIALS);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

    const handleAction = (action, trial) => {
        if (action === 'pause') {
            setTrials(prev => prev.map(t => t.id === trial.id
                ? { ...t, status: t.status === 'Paused' ? 'Recruiting' : 'Paused' } : t));
            setToast({ show: true, message: `${trial.name} ${trial.status === 'Paused' ? 'resumed' : 'paused'}`, variant: 'info' });
        } else if (action === 'close') {
            setTrials(prev => prev.map(t => t.id === trial.id ? { ...t, status: 'Completed' } : t));
            setToast({ show: true, message: `${trial.name} closed`, variant: 'info' });
        } else if (action === 'funnel') {
            setPage('funnel');
        } else if (action === 'edit') {
            setToast({ show: true, message: `Editing ${trial.name}...`, variant: 'info' });
        }
    };

    const columns = [
        {
            key: 'name', label: 'Trial Name', render: (row) => (
                <div>
                    <div style={{ fontWeight: 600, color: colors.textPrimary }}>{row.name}</div>
                    <div style={{ fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: fonts.mono }}>{row.id}</div>
                </div>
            )
        },
        { key: 'phase', label: 'Phase', render: (row) => <StatusBadge status={row.phase} /> },
        { key: 'category', label: 'Category' },
        { key: 'location', label: 'Location' },
        {
            key: 'slots', label: 'Slots Left', render: (row) => (
                <span style={{ fontFamily: fonts.mono, fontWeight: 600, color: row.slots - row.enrolled <= 3 ? colors.red : colors.textPrimary }}>
                    {row.slots - row.enrolled}
                </span>
            )
        },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
        {
            key: 'progress', label: 'Enrolled / Target', sortable: false, render: (row) => (
                <div style={{ minWidth: '120px' }}>
                    <ProgressBar value={row.enrolled} max={row.target} height="6px" color={colors.accent} />
                </div>
            )
        },
        {
            key: 'actions', label: 'Actions', sortable: false, render: (row, idx, onAction) => (
                <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
                    {[
                        { label: 'Edit', action: 'edit', bg: colors.accentGlow, color: colors.accent, border: colors.accent },
                        { label: row.status === 'Paused' ? 'Resume' : 'Pause', action: 'pause', bg: `${colors.yellow}15`, color: colors.yellow, border: colors.yellow },
                        { label: 'Close', action: 'close', bg: `${colors.red}15`, color: colors.red, border: colors.red },
                        { label: 'Funnel', action: 'funnel', bg: `${colors.green}15`, color: colors.green, border: colors.green },
                    ].map(btn => (
                        <button key={btn.action} onClick={() => onAction(btn.action, row)} style={{
                            padding: '2px 8px', borderRadius: radius.sm, fontSize: '10px', fontWeight: 600,
                            cursor: 'pointer', background: btn.bg, color: btn.color,
                            border: `1px solid ${btn.border}40`, fontFamily: fonts.body,
                        }}>
                            {btn.label}
                        </button>
                    ))}
                </div>
            )
        },
    ];

    return (
        <div style={{ padding: spacing.xl, display: 'flex', flexDirection: 'column', gap: spacing.lg, animation: 'fadeInUp 0.4s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <button onClick={() => setPage('post-trial')} style={{
                    padding: `${spacing.sm} ${spacing.lg}`, background: `linear-gradient(135deg, ${colors.accent}, ${colors.green})`,
                    color: '#fff', border: 'none', borderRadius: radius.md, fontSize: fontSize.sm,
                    fontWeight: 700, cursor: 'pointer', fontFamily: fonts.body,
                }}>
                    + Post New Trial
                </button>
            </div>

            <DataTable columns={columns} data={trials} onAction={handleAction} />

            <Toast message={toast.message} variant={toast.variant} isVisible={toast.show}
                onClose={() => setToast({ ...toast, show: false })} />

            <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
}

