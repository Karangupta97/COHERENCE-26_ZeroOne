// ============================================================
//  StatusBadge — Color‑coded status pill
// ============================================================

import { useTheme } from '../../theme';

const STATUS_MAP = {
    // Trial statuses
    'Recruiting': { bg: '#22C55E20', color: '#22C55E' },
    'Almost Full': { bg: '#F59E0B20', color: '#F59E0B' },
    'Enrolling Soon': { bg: '#818CF820', color: '#818CF8' },
    'Completed': { bg: '#6B728020', color: '#9CA3AF' },
    'Paused': { bg: '#EF444420', color: '#EF4444' },
    // Doctor statuses
    'Approved': { bg: '#22C55E20', color: '#22C55E' },
    'Pending': { bg: '#F59E0B20', color: '#F59E0B' },
    'Declined': { bg: '#EF444420', color: '#EF4444' },
    // Stages
    'Matched': { bg: '#818CF820', color: '#818CF8' },
    'Doctor Approved': { bg: '#34D39920', color: '#34D399' },
    'Accepted': { bg: '#22C55E20', color: '#22C55E' },
    'Screened': { bg: '#F59E0B20', color: '#F59E0B' },
    'Enrolled': { bg: '#0EA5E920', color: '#0EA5E9' },
    'Rejected': { bg: '#EF444420', color: '#EF4444' },
};

export default function StatusBadge({ status }) {
    const { radius, fontSize } = useTheme();
    const mapped = STATUS_MAP[status] || { bg: '#6B728020', color: '#9CA3AF' };

    return (
        <span style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: radius.full,
            background: mapped.bg,
            color: mapped.color,
            fontSize: fontSize.xs,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            lineHeight: '16px',
        }}>
            {status}
        </span>
    );
}
