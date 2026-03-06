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
import React from 'react';
import { useTheme } from '../../theme';

export default function StatusBadge({ status }) {
    const { colors, fonts } = useTheme();

    const config = {
        awaiting: { label: 'Awaiting Review', bg: `${colors.red}18`, color: colors.red, border: colors.red },
        referred: { label: 'Referred', bg: `${colors.yellow}18`, color: colors.yellow, border: colors.yellow },
        enrolled: { label: 'Enrolled', bg: `${colors.green}18`, color: colors.green, border: colors.green },
        screening: { label: 'Screening', bg: `${colors.accent}18`, color: colors.accent, border: colors.accent },
    };

    const c = config[status] || config.awaiting;

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontFamily: fonts.mono,
            fontWeight: 500,
            color: c.color,
            background: c.bg,
            border: `1px solid ${c.border}30`,
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
        }}>
            <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: c.color,
            }} />
            {c.label}
        </span>
    );
}
