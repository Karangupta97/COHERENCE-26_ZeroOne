import React from 'react';
import { useTheme } from '../../theme';

export default function PatientAvatar({ patientId, size = 44 }) {
    const { colors, fonts } = useTheme();
    const last4 = patientId.slice(-4);

    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.accent}30, ${colors.accent}10)`,
            border: `2px solid ${colors.accent}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: fonts.mono,
            fontSize: size > 40 ? '13px' : '11px',
            fontWeight: 600,
            color: colors.accent,
            flexShrink: 0,
            transition: 'all 0.3s ease',
        }}>
            {last4}
        </div>
    );
}
