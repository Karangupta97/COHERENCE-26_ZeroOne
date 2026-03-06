// ============================================================
//  CandidateWorkflow — Kanban board for candidate pipeline
// ============================================================

import { useState } from 'react';
import { useTheme } from '../../theme';
import KanbanBoard from '../../components/shared/KanbanBoard';
import Toast from '../../components/shared/Toast';

const COLUMNS = ['Matched', 'Doctor Approved', 'Accepted', 'Screened', 'Enrolled', 'Rejected'];
const NEXT_STAGE = {
    'Matched': 'Doctor Approved',
    'Doctor Approved': 'Accepted',
    'Accepted': 'Screened',
    'Screened': 'Enrolled',
};

export default function CandidateWorkflow({ candidates, setCandidates }) {
    const { colors, fonts, spacing, radius, fontSize } = useTheme();
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

    const handleMoveCard = (cardId, currentStage) => {
        const nextStage = NEXT_STAGE[currentStage];
        if (!nextStage) return;
        setCandidates(prev => prev.map(c => c.id === cardId ? { ...c, stage: nextStage } : c));
        setToast({ show: true, message: `${cardId} moved to ${nextStage}`, variant: 'success' });
    };

    return (
        <div style={{ padding: spacing.xl, display: 'flex', flexDirection: 'column', gap: spacing.lg, animation: 'fadeInUp 0.4s ease' }}>

            <KanbanBoard columns={COLUMNS} cards={candidates} onMoveCard={handleMoveCard} />

            <Toast message={toast.message} variant={toast.variant} isVisible={toast.show}
                onClose={() => setToast({ ...toast, show: false })} />

            <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
}

