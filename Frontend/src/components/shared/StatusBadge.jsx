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
